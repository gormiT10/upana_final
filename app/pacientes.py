

#imports
from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import input_modelo_paciente, modelo_paciente, input_modelo_buscar_paciente, full_modelo_paciente
from .extensions import db
from .models import Paciente, Usuario
from flask_restx import abort

# la autorizacion enviada en los headeres de la http request (jswonwebToken)
autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}

# el blueprint
paciente = Namespace('api', authorizations=autorizacion)

# ruta para visualizar pacientes en sala de espera y agregar un nuevo paciente
@paciente.route("/pacientes")
class Pacientes(Resource):

  #decorator que nos permitira proteger nuestros endpoints
  method_decorators = [jwt_required()]


#metodo que agregara un nuevo paciente a la base de datos
  # modelos; 1. definido en api_models que retornara informacion especifica de confirmacion cuando un paciente es agregado, 2 modelo que tipifica el json a recibir
  @paciente.marshal_with(modelo_paciente)
  @paciente.expect(input_modelo_paciente)
  @paciente.doc(security='jsonWebtoken')
  def post(self):


    # falta agregar la validacion de nombre repetidos
    try:
      if ('nombre' not in paciente.payload or not paciente.payload['especialistas']
           or 'telefono' not in paciente.payload or 'genero' not in paciente.payload or 'dpi' not in paciente.payload 
           or 'direccion' not in paciente.payload):
          abort(400, message="error: falta 'informacion' in el payload")

      # verificando que no exista ya el usuario en la db
      paciente_existente = Usuario.query.filter_by(nombre=paciente.payload["nombre"]).first()
      if paciente_existente:
        abort(400, message="error: 'nombre' este paciente ya existe")
          
      especialista = Usuario.query.filter_by(nombre=paciente.payload['especialistas']).first()
      if not especialista:
          abort(404, message="no se encontro ningun especialista")

      nuevo_paciente = Paciente(nombre=paciente.payload['nombre'], telefono=paciente.payload['telefono'], genero=paciente.payload['genero'],
                                dpi = paciente.payload['dpi'], direccion = paciente.payload['direccion'])
      db.session.add(nuevo_paciente)
      especialista.pacientes.append(nuevo_paciente)
      nuevo_paciente.especialistas.append(especialista)
      db.session.commit()

      return nuevo_paciente
    except KeyError as e:
        abort(400, message=f"error: {str(e)}")
    except Exception as e:
        db.session.rollback()
        abort(500, message=f"error: {str(e)}")

    
    
    
  
  # ruta para mostrar los pacientes no atendidos
  @paciente.marshal_list_with(modelo_paciente)
  @paciente.doc(security='jsonWebtoken')
  def get(self):
    try:

      pacientes = Paciente.query.filter_by(proceso='en-sala').all()
      pacientes_no_atendidos = [paciente_registrado for paciente_registrado in pacientes if paciente_registrado.atendido == False]
      
      return pacientes_no_atendidos
    except Exception as e:
        abort(500, message=f"error: {str(e)}")


# ruta para buscar un paciente usando el nombre
@paciente.route('/buscar/paciente')
class BuscarPaciente(Resource):
  method_decorators = [jwt_required()]
  @paciente.marshal_with(modelo_paciente)
  @paciente.expect(input_modelo_buscar_paciente)
  @paciente.doc(security="jsonWebtoken")
  def post(self):
    try:
      if not paciente.payload['nombre']:
         abort(400,message='nombre no contiene informacion')

      algun_paciente = Paciente.query.filter_by(nombre=paciente.payload['nombre']).all()
      print(algun_paciente)
      return algun_paciente
    
    except Exception as e:
       abort(500, message=f'error {e}')
   

# ruta para ir a un paciente en especifico
@paciente.route('/buscar/paciente/<int:paciente_id>')
class VerPaciente(Resource):
  method_decorators  = [jwt_required()]

  # en este metodo podremos ver la informacion completa del paciente no atendido
  @paciente.marshal_with(full_modelo_paciente)
  @paciente.doc(security = 'jsonWebtoken')
  def get(self, paciente_id):
    try:
      paciente_seleccionado = Paciente.query.filter_by(id=paciente_id).first()
      return paciente_seleccionado
    except Exception as e:
       abort(500, message=f'error {e}')
  

  # metodo que nos permitira editar la informacion de un paciente no atendido unicamente
  @paciente.marshal_with(modelo_paciente)
  @paciente.expect(input_modelo_paciente)
  @paciente.doc(security='jsonWebtoken')
  def put(self, paciente_id):
    try:
      algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
      
      if 'nombre' not in paciente.payload or not paciente.payload['especialistas']:
            abort(400, message="error: missing 'data' in the payload")
            
      especialista = Usuario.query.filter_by(nombre=paciente.payload['especialistas']).first()

      # verificando que el paciente a modificar no haya sido atendido
      if not algun_paciente.atendido and algun_paciente.especialistas:
        algun_paciente.especialistas.remove(algun_paciente.especialistas[-1])

      # agregando la nueva consulta
      algun_paciente.especialistas.append(especialista)
      especialista.pacientes.append(algun_paciente)
      algun_paciente.atendido =False
      algun_paciente.nombre = paciente.payload['nombre']
      db.session.commit()

      return algun_paciente
    except Exception as e:
       db.session.rollback()
       abort(500, message=f'error {e}')
       
  
  # metodo que eliminira el paciente no atendido
  @paciente.marshal_with(modelo_paciente)
  @paciente.doc(security='jsonWebtoken')
  def delete(self,paciente_id):
    try:
      algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
      db.session.delete(algun_paciente)
      db.session.commit()
      return algun_paciente
    except Exception as e:
       db.session.rollback()
       abort(500, message= f'error {e}')



# ruta que nos permitira agregar  un antiguo paciente a la lista para ser atendido
@paciente.route('/nueva/consulta/<int:paciente_id>')
class AntiguoPacienteNuevaConsulta(Resource):
   method_decorators  = [jwt_required()]
   @paciente.doc(security='jsonWebtoken')
   @paciente.marshal_with(modelo_paciente)
   def get(self, paciente_id):
      try:
        algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
        if algun_paciente.proceso == 'en-sala':
           abort(400,message='paciente en sala')
        algun_paciente.proceso = 'en-sala'
        db.session.commit()
        return algun_paciente
      except Exception as e:
       db.session.rollback()
       abort(500, message= f' el paciente ya esta en sala {e}')
    


# ruta que nos permitira remover  un antiguo paciente de la lista para ser atendido
@paciente.route('/cancelar/nueva/consulta/<int:paciente_id>')
class AntiguoPacienteRemoverConsulta(Resource):
   method_decorators  = [jwt_required()]
   @paciente.doc(security='jsonWebtoken')
   @paciente.marshal_with(modelo_paciente)
   def get(self, paciente_id):
      try:
        algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
        if algun_paciente.proceso == 'finalizado':
           abort(400,message='cita a finalizado')
        algun_paciente.proceso = 'finalizado'
        db.session.commit()
        return algun_paciente
      except Exception as e:
       db.session.rollback()
       abort(500, message= f'cita a finalizado {e}')
