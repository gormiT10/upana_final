from flask_admin.contrib.sqla import ModelView
import secrets
import string
from .extensions import bcrypt
from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import modelo_especialista, input_modelo_especialista
from .extensions import db, bcrypt
from .models import  Usuario
from flask import jsonify





# buscar como agregar mas caracteres pero sin que agregfa
# esta es la funcion que nos permite agregar una contrasena a cada usuario que es creado desde la pagina de administradores
def generar_contrasena(length=8):
    chars = string.ascii_letters + string.digits
    contrasena = ''.join(secrets.choice(chars) for i in range(length))
    return contrasena


# Esta es la clase que define al usario que es guardado desde el admin page
class UsuarioAdminView(ModelView):
    columnas = ["nombre", "correo", 'horario_laboral']
    contrasena = ''


    def on_model_change(self, form, model, is_created):

        if is_created:
            usuario = form.nombre.data
            email_domain = "gmail.com"  
            correo = f"{usuario}@{email_domain}"
            model.correo = correo

            contrasena = generar_contrasena()
            print(contrasena)
            hashed_contrasena = bcrypt.generate_password_hash(contrasena).decode('utf-8')
            model.contrasena = hashed_contrasena


# es la clase que instancia nuestro paciente en el panel de administracion
class PacienteAdminView(ModelView):
    columnas = ['nombre', 'especialistas', 'atendido']


autorizacion = {
  "jsonWebToken":{
    "type":"apiKey",
    "in":"header",
    "name":"Authorizacion"
  }
}

admins = Namespace('api', authorizations=autorizacion)

@admins.route('/especialistas/activos')
class PanelEspecialistas(Resource):
  @admins.marshal_with(modelo_especialista)
  def get(self):
    especialistas = Usuario.query.filter(Usuario.puesto == "especialista").all()
    return especialistas
  
  def generar_contrasena(self):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(alphabet) for _ in range(12))
    return password
  # enviar la informacion del especialista cuando desiemos agregar uno nuevo
  #esto solo lo podran hacer los administradores
  @admins.marshal_with(modelo_especialista)
  @admins.expect(input_modelo_especialista)
  def post(self):
    # remember that you had a problem with json since the unhashed  password included a \slach wich is not allowed in json
    unhashed_contrasena = self.generar_contrasena()
    hashed_contrasena = bcrypt.generate_password_hash(unhashed_contrasena)
    nuevo_especialista = Usuario(nombre=admins.payload["nombre"], 
                                 especialidad = admins.payload["especialidad"],
                                 puesto = admins.payload["puesto"],
                                 correo = admins.payload['nombre'] + "@gmail.com",
                                 contrasena = hashed_contrasena
                                 )
    db.session.add(nuevo_especialista)
    db.session.commit()
    return nuevo_especialista