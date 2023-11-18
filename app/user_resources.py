from flask_restx import Resource, Namespace
from .api_models import input_login_modelo
from .extensions import db,bcrypt
from .models import Usuario
from flask import jsonify
from flask_jwt_extended import create_access_token,create_refresh_token

autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}
autenticacion = Namespace('api', authorizations=autorizacion)

@autenticacion.route('/login')
class Login(Resource):
  @autenticacion.expect(input_login_modelo)
  def post(self):
    usuario = Usuario.query.filter_by(correo=autenticacion.payload['correo']).first()
    if usuario and bcrypt.check_password_hash(usuario.contrasena, autenticacion.payload['contrasena']):
      access_token = create_access_token(identity=usuario.id, fresh=True)
      refresh_token = create_refresh_token(identity=usuario.id)
      # print(access_token)
      return jsonify({'access_token':access_token,"refresh_token":refresh_token})
    else:
      return jsonify({'invalid Credentials':'LoginPage'})
    

  

