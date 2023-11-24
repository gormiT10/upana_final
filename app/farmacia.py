from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import  (full_modelo_paciente,input_anamnesis_y_examenes, 
                          modelo_factura, show_factura, receta, modelo_medicamento)
from .extensions import db, bcrypt
from .models import   Paciente,Medicacion,Medicamento, Facturas
import pandas as pd



autorizacion = {
  "jsonWebToken":{
    "type":"apiKey",
    "in":"header",
    "name":"Authorizacion"
  }
}

farmacia = Namespace('api', authorizations=autorizacion)

@farmacia.route('/farmacia')
class Farmacia(Resource):
  @farmacia.marshal_list_with(full_modelo_paciente)
  def get(self):
    pacientes_pagar_en_farmacia = Paciente.query.filter_by(proceso='pagar-en-farmacia').all()
    cola_de_pacientes_a_pagar = sorted(pacientes_pagar_en_farmacia, key=lambda x:x.fecha_de_creacion)
    return cola_de_pacientes_a_pagar
  


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
  
@farmacia.route("/farmacia/productos")
class ProductosEnFarmacia(Resource):
  @farmacia.marshal_with(modelo_medicamento)
  def get(self):
    medicamentos = Medicamento.query.all()
    return medicamentos
  


@farmacia.route("/farmacia/factura/<int:paciente_id>")
class Factura(Resource):
  @farmacia.marshal_with(show_factura)
  def get(self,paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    factura = algun_paciente.factura[-1]
    return factura
