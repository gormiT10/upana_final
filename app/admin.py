
import secrets
import string
from .extensions import bcrypt
from flask_restx import Resource,Namespace, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import modelo_especialista, input_modelo_especialista, modelo_especialista_put,modelo_especialista_put_input
from .extensions import db, bcrypt
from .models import  Usuario




# la autorizacion enviada en los headeres de la http request (jswonwebToken)
autorizacion = {
  "jsonWebtoken":{
    "type":"apiKey",
    "in":"header",
    "name":"Authorizacion"
  }
}


# el blueprint
admins = Namespace('api', authorizations=autorizacion)



# ruta para obtener el usario que esta logeado:
@admins.route('/usuario/logeado')
class UsuarioLogeado(Resource):
  method_decorators = [ jwt_required()]
  
  @admins.doc(security='jsonWebtoken')
  @admins.marshal_with(modelo_especialista)
  def get(self):
    try:
      algun_usuario = Usuario.query.filter_by(id=get_jwt_identity()).first()
      return algun_usuario
    except Exception as e:
      abort(500, message=f'error {e}')

# ruta que nos devolvera los usuarios registrados para manejar el sistema, tambien nos servira para registrar un nuevo usuario
@admins.route('/especialistas/activos')
class PanelAdminstradores(Resource):
  # protegiendo las rutas 
  method_decorators = [ jwt_required()]

  @admins.marshal_with(modelo_especialista)
  @admins.doc(security='jsonWebtoken')
  def get(self):
    try:
      
      algun_usuario = Usuario.query.filter_by(id=get_jwt_identity()).first()
      if algun_usuario.es_admin:
        usuarios = Usuario.query.all()
        return usuarios
      else:
        abort(400, message='NO es admin')
    except Exception as e:
      abort(500, message=f'error {e}')
  
  # def generar_contrasena(self):
  #   alphabet = string.ascii_letters + string.digits + string.punctuation
  #   password = ''.join(secrets.choice(alphabet) for _ in range(12))
  #   return password
  # enviar la informacion del especialista cuando desiemos agregar uno nuevo
  #esto solo lo podran hacer los administradores

  # metodo para agregar un nuevo usuario
  @admins.marshal_with(modelo_especialista)
  @admins.expect(input_modelo_especialista)
  @admins.doc(security='jsonWebtoken')
  def post(self):
    try:

      if ('nombre' not in admins.payload  or 
       not admins.payload['especialidad'] or not admins.payload['puesto'] 
       or  not admins.payload['horario_laboral'] or  not admins.payload['contrasena']):
          abort(400, message="error: missing 'nombre' in the payload")

      
      email_id = admins.payload['nombre'].replace(' ', '_')

      existing_especialista = Usuario.query.filter_by(nombre=admins.payload["nombre"]).first()

      if existing_especialista:
    # If the nombre already exists, return an error response
        abort(400, message="error: 'nombre' este usuario ya existe")

      hashed_contrasena = bcrypt.generate_password_hash(admins.payload['contrasena'])
      nuevo_especialista = Usuario(nombre=admins.payload["nombre"], 
                                  especialidad = admins.payload["especialidad"],
                                  puesto = admins.payload["puesto"],
                                  correo = email_id + '@upanaHospital.com',
                                  horario_laboral = admins.payload['horario_laboral'],
                                  contrasena = hashed_contrasena,
                                  es_admin  = admins.payload['es_admin']
                                  )
      db.session.add(nuevo_especialista)
      db.session.commit()
      return nuevo_especialista
    except Exception as e:
      db.session.rollback()
      abort(500, message=f'error {e}')
  


# ruta que nos permitira ver,editar y eliminar un usuario
@admins.route('/editar/usuario/<int:usuario_id>')
class EditandoUsuarios(Resource):
  method_decorators = [jwt_required()]

#  metodo para jalar la informacion de un usuario especifico
  @admins.marshal_with(modelo_especialista_put)
  @admins.doc(security='jsonWebtoken')
  def get(self, usuario_id):
     try:
      algun_usuario = Usuario.query.filter_by(id=usuario_id).first()
      return algun_usuario
     except Exception as e:
       abort(500, message=f'error {e}')
  

# metodo para actualizar informacion
  @admins.marshal_with(modelo_especialista_put)
  @admins.expect(modelo_especialista_put_input)
  @admins.doc(security = 'jsonWebtoken')
  def put(self,usuario_id):
    try:

      # verificando que venga la informacion completa
      if ('nombre' not in admins.payload  or 
       not admins.payload['especialidad'] or not admins.payload['puesto'] or  not admins.payload['correo']
       or  not admins.payload['horario_laboral'] or  not admins.payload['contrasena']):
          abort(400, message="error: missing 'nombre' in the payload")


      # editando la informacion del usuario
      algun_usuario  = Usuario.query.filter_by(id=usuario_id).first()
      hashed_contrasena = bcrypt.generate_password_hash(admins.payload['contrasena']).decode('utf-8')
      algun_usuario.es_admin = admins.payload['es_admin']
      algun_usuario.nombre = admins.payload['nombre']
      algun_usuario.correo = admins.payload['correo']
      algun_usuario.especialidad = admins.payload['especialidad']
      algun_usuario.horario_laboral = admins.payload['horario_laboral']
      algun_usuario.puesto = admins.payload['puesto']
      if admins.payload['contrasena']:
        algun_usuario.contrasena = hashed_contrasena

      db.session.commit()
      return algun_usuario
    except Exception as e:
      db.session.rollback()
      abort(500, message=f'error {e}')


  # metodo para eliminar usuario
  @admins.marshal_with(modelo_especialista_put)
  @admins.doc(security='jsonWebtoken')
  def delete(self,usuario_id):
     try:
      algun_usuario = Usuario.query.filter_by(id=usuario_id).first()
      db.session.delete(algun_usuario)
      db.session.commit()
      return algun_usuario
     except Exception as e:
       db.session.rollback()
       abort(500, message=f'error {e}')
