from flask_restx import Resource, Namespace,abort
from .api_models import input_login_modelo
from .extensions import db,bcrypt
from .models import Usuario
from flask import jsonify
from flask_jwt_extended import create_access_token,create_refresh_token

# la autorizacion enviada en los headeres de la http request (jswonwebToken)
autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}

# blueprint
autenticacion = Namespace('api', authorizations=autorizacion)


# ruta que nos permitira logiar a los usuarios o empleados del hospital que usen el sistema
@autenticacion.route('/login')
class Login(Resource):
  @autenticacion.expect(input_login_modelo)
  def post(self):
    try:

      if 'correo' not in autenticacion.payload or not autenticacion.payload['contrasena']:
          abort(400, message="error: missing 'data' in the payload")

      usuario = Usuario.query.filter_by(correo=autenticacion.payload['correo']).first()
      if usuario and bcrypt.check_password_hash(usuario.contrasena, autenticacion.payload['contrasena']):
        access_token = create_access_token(identity=usuario.id, fresh=True)
        refresh_token = create_refresh_token(identity=usuario.id)
        print(access_token)
        return jsonify({'access_token':access_token,"refresh_token":refresh_token})
      else:
        return jsonify({'invalid Credentials':'LoginPage'})
    except Exception as e:
      abort(500, f'algun problema con la informacion enviada {e}')

  

