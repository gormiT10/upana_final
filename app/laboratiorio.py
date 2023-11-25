from flask_restx import Resource,Namespace,abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import  (modelo_resultados_examenes, modelo_examenes)
from .extensions import db, bcrypt
from .models import  Usuario, Paciente,ExamenSangre, ExamenOrina, Anamnesis,Diagnostico,Medicacion
from .api_models import input_modelo_examenes
from itertools import zip_longest

# la autorizacion enviada en los headeres de la http request (jswonwebToken)
autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}

# blueprint
laboratorio = Namespace('api', authorizations=autorizacion)


# ruta que nos mostrara todos los pacientes que estan haciendose examens en el laboaratorio
@laboratorio.route('/laboratorio')
class Laboratorio(Resource):
  method_decorators = [jwt_required()]
  @laboratorio.marshal_list_with(modelo_examenes)
  @laboratorio.doc(security ='jsonWebtoken')
  def get(self):
    try:

      # usamos un set para no tener nombres repetidos
      paciente_con_examenes = set()

      # exemenes pendientes
      examenes = (db.session.query(ExamenSangre).filter(ExamenSangre.status == 'en-laboratorio').all() +
                        db.session.query(ExamenOrina).filter(ExamenOrina.status =='en-laboratorio').all())
      
      # identificando los pacientes
      for examen in  examenes:
        algun_paciente = Paciente.query.filter_by(id=examen.paciente_id).first()
        paciente_con_examenes.add(algun_paciente)
      cola_de_pacientes = sorted(paciente_con_examenes, key=lambda x: x.fecha_de_creacion)

      return cola_de_pacientes
    except Exception as e:
      abort(500, message=f"error: {str(e)}")


# esta ruta nos devolvera los examenes que el paciente se realizara
@laboratorio.route("/laboratorio/examenes/<int:paciente_id>")
class ExamenEnLaboratorio(Resource):
  method_decorators = [jwt_required()]

  @laboratorio.marshal_list_with(modelo_resultados_examenes)
  @laboratorio.doc(security='jsonWebtoken')
  def get(self,paciente_id):

    try:

      # seleccionando los examenes no completados
      examens_del_paciente = []
      algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
      for examen_orina, examen_sangre in zip_longest(algun_paciente.examen_sangre, algun_paciente.examen_orina, fillvalue=None):
        if  examen_orina and examen_orina.status != 'completados':
            examens_del_paciente.append(examen_orina)
        if examen_sangre and examen_sangre.status != 'completados':
            examens_del_paciente.append(examen_sangre)

      return examens_del_paciente 
    except Exception as e:
      db.session.rollback()
      abort(500, message=f"error: {str(e)}")







# en esta ruta devolveremos las informacion del examen antes de completarse y tambien mandaremos el examen ya completado
@laboratorio.route("/examen/completado/<nombre>/<int:examen_id>")
class InformacionExamenIncompleto(Resource):
   method_decorators = [jwt_required()]
   @laboratorio.marshal_with(modelo_resultados_examenes)
   @laboratorio.doc(security='jsonWebtoken')
   def get(self, examen_id, nombre):
    try:

      examenes_disponibles = {'orina':ExamenOrina, "sangre":ExamenSangre}
    
    
      if nombre in examenes_disponibles:
        examen = examenes_disponibles[nombre]
        algun_examen_especifico = examen.query.filter_by(id=examen_id).first()
        
      return algun_examen_especifico
    except Exception as e:
        abort(500, message=f"error: {str(e)}")

  # metodo que nos servira para llenar los examenes 
   def actualizando_examenes(self,algun_examen_especifico):
    if algun_examen_especifico.nombre == "orina":
        algun_examen_especifico.status = 'completados'
        algun_examen_especifico.color = laboratorio.payload['color']
        algun_examen_especifico.aspecto = laboratorio.payload['aspecto']
        algun_examen_especifico.color = laboratorio.payload['glucosa']
        algun_examen_especifico.aspecto = laboratorio.payload['proteinas']
        db.session.commit()
    elif algun_examen_especifico.nombre == "sangre":
        algun_examen_especifico.status = 'completados'
        algun_examen_especifico.hemoglobina = laboratorio.payload['hemoglobina']
        algun_examen_especifico.hematocrito = laboratorio.payload['hematocrito']
        algun_examen_especifico.hemoglobina = laboratorio.payload['glucosa']
        algun_examen_especifico.hematocrito = laboratorio.payload['trigliceridos']
        db.session.commit()
   

  #  metodo que guardara la informacion de los examenes en la base de datos
   @laboratorio.marshal_with(modelo_examenes)
   @laboratorio.expect(input_modelo_examenes)
   @laboratorio.doc(security='jsonWebtoken')
   def post(self, examen_id, nombre):
    try:
      examenes_disponibles = {'orina':ExamenOrina, "sangre":ExamenSangre}
    
    
      if nombre in examenes_disponibles:
        examen = examenes_disponibles[nombre]
        algun_examen_especifico = examen.query.filter_by(id=examen_id).first()
        self.actualizando_examenes(algun_examen_especifico=algun_examen_especifico)
        
      return algun_examen_especifico
    except Exception as e:
      db.session.rollback()
      abort(500, message=f'error {e}')