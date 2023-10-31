from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import input_modelo_paciente, modelo_paciente, input_modelo_buscar_paciente, full_modelo_paciente
from .extensions import db
from .models import Paciente, Usuario
from flask import jsonify

autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}
paciente = Namespace('api', authorizations=autorizacion)

@paciente.route("/pacientes")
class Pacientes(Resource):
  @paciente.expect(input_modelo_paciente)
  def post(self):
    especialista = Usuario.query.filter_by(nombre=paciente.payload['especialistas']).first()
    nuevo_paciente = Paciente(nombre=paciente.payload['nombre'])
    db.session.add(nuevo_paciente)
    db.session.commit()

    especialista.pacientes.append(nuevo_paciente)
    nuevo_paciente.especialistas.append(especialista)
    db.session.commit()

    
    return {'response':'200'}
  
  @paciente.marshal_list_with(modelo_paciente)
  def get(self):
    pacientes = Paciente.query.all()
    pacientes_no_atendidos = [paciente_registrado for paciente_registrado in pacientes if paciente_registrado.atendido == False]
    return pacientes_no_atendidos



@paciente.route('/buscar/paciente')
class BuscarPaciente(Resource):
  @paciente.marshal_with(modelo_paciente)
  @paciente.expect(input_modelo_buscar_paciente)
  def post(self):
    algun_paciente = Paciente.query.filter_by(id=paciente.payload['id']).first()
    return algun_paciente
   

@paciente.route('/buscar/paciente/<int:paciente_id>')
class VerPaciente(Resource):
  @paciente.marshal_with(full_modelo_paciente)
  def get(self, paciente_id):
    paciente_seleccionado = Paciente.query.filter_by(id=paciente_id).first()
    return paciente_seleccionado