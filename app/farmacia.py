from flask_restx import Resource,Namespace, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import  (full_modelo_paciente,input_anamnesis_y_examenes, 
                          modelo_factura, show_factura, receta, modelo_medicamento)
from .extensions import db, bcrypt
from .models import   Paciente,Medicacion,Medicamento, Facturas,Usuario
import pandas as pd



autorizacion = {
  "jsonWebtoken":{
    "type":"apiKey",
    "in":"header",
    "name":"Authorizacion"
  }
}

farmacia = Namespace('api', authorizations=autorizacion)


# ruta para devolver los pacientes que ya completaron la mayor parte del proceso y estan listos para pagar-en-farmacia
@farmacia.route('/farmacia')
class Farmacia(Resource):
  method_decorators = [jwt_required()]
  @farmacia.marshal_list_with(full_modelo_paciente)
  @farmacia.doc(security ='jsonWebtoken')
  def get(self):
    try:
      identidad = get_jwt_identity()
      print(identidad)
      algun_usuario = Usuario.query.filter_by(id=identidad).first()

      # verificando la identidad
      if algun_usuario.puesto != 'farmaceutico' and not algun_usuario.es_admin:
        abort(400, message='no es farmaceutico ni administrador')
    
      pacientes_pagar_en_farmacia = Paciente.query.filter_by(proceso='pagar-en-farmacia').all()
      cola_de_pacientes_a_pagar = sorted(pacientes_pagar_en_farmacia, key=lambda x:x.fecha_de_creacion)
      return cola_de_pacientes_a_pagar
    except Exception as e:
      abort(500, message=f"error: {str(e)}")


@farmacia.route('/farmacia/pagar/paciente/<int:paciente_id>')
class PagarEnFarmacia(Resource):
  @farmacia.marshal_with(receta)
  def get(self,paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    receta = Medicacion.query.filter_by(paciente_id=algun_paciente.id).all()
    return receta[-1]
  
  @farmacia.marshal_with(show_factura)
  @farmacia.expect(modelo_factura)
  def post(self, paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    
    lista_productos = farmacia.payload['producto']
    lista_cantidad = farmacia.payload['cantidad']
    lista_precio = farmacia.payload['precio']

    calculando_subtotal = map(lambda x: int(x[0]) * int(x[1]), zip(lista_cantidad, lista_precio))

# Convert the map result to a list
    subtotal_list = list(calculando_subtotal)

    # Combine lista_cantidad, lista_productos, and subtotal_list into a list of tuples
    subtotal = list(zip(lista_cantidad,lista_precio, lista_productos, subtotal_list))

    # Print the result
    df = pd.DataFrame(subtotal, columns=['Cantidad', "Precio",'Producto', 'Subtotal'], index=None)
   

    # Calculate and print the total
    total = sum(subtotal_list)
    factura_info = df.to_string()+ " \n total:" + str(total)
    
    nueva_factura = Facturas(subtotal = factura_info,total=total, paciente_id= paciente_id)
    db.session.add(nueva_factura)
    db.session.commit()
  
    return nueva_factura
  

# ruta que nos devolvera todos los productos que tenemos en farmacia
@farmacia.route("/farmacia/productos")
class ProductosEnFarmacia(Resource):
  method_decorators = [jwt_required()]

  @farmacia.marshal_with(modelo_medicamento)
  @farmacia.doc(security='jsonWebtoken')
  def get(self):
    try:
      medicamentos = Medicamento.query.all()
      medicamentos_ordenados = sorted(medicamentos, key=lambda x:x.nombre)
      return medicamentos_ordenados
    except Exception as e:
      abort(500, message=f"error: {str(e)}")
  


#ruta que devuelve la informacion de la factura
@farmacia.route("/farmacia/factura/<int:paciente_id>")
class Factura(Resource):

  method_decorators = [jwt_required()]

  @farmacia.marshal_with(show_factura)
  @farmacia.doc(security='jsonWebtoken')
  def get(self,paciente_id):
    try:
      algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
      factura = algun_paciente.factura[-1]
      algun_paciente.proceso = 'finalizado'
      db.session.commit()
      return factura
    
    except Exception as e:
      db.session.rollback()
      abort(500, message=f"error: {str(e)}")
