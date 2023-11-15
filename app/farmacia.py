from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import  (full_modelo_paciente,input_anamnesis_y_examenes, 
                          factura, input_diagnostico_y_receta, modelo_diagnostico_receta, modelo_pacientes_en_espera_examenes_completados, receta)
from .extensions import db, bcrypt
from .models import  Usuario, Paciente,ExamenSangre, ExamenOrina, Anamnesis,Diagnostico,Medicacion




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
    pacientes_pagar_en_farmacia = Paciente.query.filter_by(proceso='pagar-farmacia').all()
    return pacientes_pagar_en_farmacia
  


@farmacia.route('/farmacia/pagar/paciente/<int:paciente_id>')
class PagarEnFarmacia(Resource):
  @farmacia.marshal_with(receta)
  def get(self,paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    receta = Medicacion.query.filter_by(paciente_id=algun_paciente.id).all()
    return receta[-1]
  
  @farmacia.expect(factura)
  def post(self, paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    print(farmacia.payload['producto'])
    print(farmacia.payload['cantidad'])
    print(farmacia.payload['precio'])