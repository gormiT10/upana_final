from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import  (modelo_resultados_examenes, modelo_examenes)
from .extensions import db, bcrypt
from .models import  Usuario, Paciente,ExamenSangre, ExamenOrina, Anamnesis,Diagnostico,Medicacion
from .api_models import input_modelo_examenes
from itertools import zip_longest

autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}

laboratorio = Namespace('api', authorizations=autorizacion)

@laboratorio.route('/laboratorio')
class Laboratorio(Resource):
  @laboratorio.marshal_list_with(modelo_examenes)
  def get(self):
    paciente_con_examenes = set()
    examenes = (db.session.query(ExamenSangre).filter(ExamenSangre.status == 'en-laboratorio').all() +
                       db.session.query(ExamenOrina).filter(ExamenOrina.status =='en-laboratorio').all())
    

    for examen in  examenes:
       algun_paciente = Paciente.query.filter_by(id=examen.paciente_id).first()
       paciente_con_examenes.add(algun_paciente)
    cola_de_pacientes = sorted(paciente_con_examenes, key=lambda x: x.fecha_de_creacion)

    return cola_de_pacientes


# me quede aqui en como mostrar y recibir informacion de  las forms del laboratorista
@laboratorio.route("/laboratorio/examenes/<int:paciente_id>")
class ExamenEnLaboratorio(Resource):

  @laboratorio.marshal_list_with(modelo_resultados_examenes)
  def get(self,paciente_id):
    examens_del_paciente = []
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    for examen_orina, examen_sangre in zip_longest(algun_paciente.examen_sangre, algun_paciente.examen_orina, fillvalue=None):
       if  examen_orina and examen_orina.status != 'completados':
          examens_del_paciente.append(examen_orina)
       if examen_sangre and examen_sangre.status != 'completados':
          examens_del_paciente.append(examen_sangre)

    return examens_del_paciente


  def actualizando_examenes(self,algun_examen_especifico):
    if algun_examen_especifico.nombre == "orina":
        algun_examen_especifico.status = 'completados'
        algun_examen_especifico.color = laboratorio.payload['color']
        algun_examen_especifico.aspecto = laboratorio.payload['aspecto']
        db.session.commit()
    elif algun_examen_especifico.nombre == "sangre":
        algun_examen_especifico.status = 'completados'
        algun_examen_especifico.hemoglobina = laboratorio.payload['hemoglobina']
        algun_examen_especifico.hematocrito = laboratorio.payload['hematocrito']
        db.session.commit()

  @laboratorio.marshal_with(modelo_examenes)
  @laboratorio.expect(input_modelo_examenes)
  def post(self,paciente_id):
   
    examenes_disponibles = {'orina':ExamenOrina, "sangre":ExamenSangre}
    if laboratorio.payload['nombre'] in examenes_disponibles:
      examen = examenes_disponibles[laboratorio.payload['nombre']]
      algun_examen_especifico = examen.query.filter_by(id=laboratorio.payload['id']).first()
      self.actualizando_examenes(algun_examen_especifico=algun_examen_especifico)
    return algun_examen_especifico