from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import input_modelo_paciente, modelo_paciente, input_modelo_buscar_paciente, full_modelo_paciente
from .extensions import db
from .models import Paciente, Usuario
from flask import jsonify

# la autorizacion enviada en la http request
autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}

# el blueprint
paciente = Namespace('api', authorizations=autorizacion)

# ruta para agregar un paciente
@paciente.route("/pacientes")
class Pacientes(Resource):
  @paciente.marshal_with(modelo_paciente)
  @paciente.expect(input_modelo_paciente)
  def post(self):
    especialista = Usuario.query.filter_by(nombre=paciente.payload['especialistas']).first()
    nuevo_paciente = Paciente(nombre=paciente.payload['nombre'])
    db.session.add(nuevo_paciente)
    especialista.pacientes.append(nuevo_paciente)
    nuevo_paciente.especialistas.append(especialista)
    db.session.commit()

    
    return nuevo_paciente
  
  # ruta para mostrar los pacientes no atendidos
  @paciente.marshal_list_with(modelo_paciente)
  def get(self):
    pacientes = Paciente.query.filter(proceso='en-sala').all()
    # pacientes_no_atendidos = [paciente_registrado for paciente_registrado in pacientes if paciente_registrado.atendido == False]
    return pacientes


# ruta para buscar un paciente usando el id
@paciente.route('/buscar/paciente')
class BuscarPaciente(Resource):
  @paciente.marshal_with(modelo_paciente)
  @paciente.expect(input_modelo_buscar_paciente)
  def post(self):
    algun_paciente = Paciente.query.filter_by(id=paciente.payload['id']).first()
    return algun_paciente
   

# ruta para ir a un paciente en especifico
@paciente.route('/buscar/paciente/<int:paciente_id>')
class VerPaciente(Resource):
  @paciente.marshal_with(full_modelo_paciente)
  def get(self, paciente_id):
    paciente_seleccionado = Paciente.query.filter_by(id=paciente_id).first()
    return paciente_seleccionado
  
  @paciente.marshal_with(modelo_paciente)
  @paciente.expect(input_modelo_paciente)
  def put(self, paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    especialista = Usuario.query.filter_by(nombre=paciente.payload['especialistas']).first()


    if not algun_paciente.atendido:
      algun_paciente.especialistas.remove(algun_paciente.especialistas[-1])

    algun_paciente.nombre = paciente.payload['nombre']
    algun_paciente.especialistas.append(especialista)
    db.session.commit()


    return algun_paciente
  
  @paciente.marshal_with(modelo_paciente)
  def delete(self,paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    db.session.delete(algun_paciente)
    db.session.commit()
    return algun_paciente


