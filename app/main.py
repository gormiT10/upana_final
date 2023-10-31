from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required,get_jwt_identity
from .api_models import modelo_usuario
from .models import Usuario

autorizacion = {
  "jsonWebtoken":{
   "type" : "apiKey",
   "in":"header",
   "name":"Authorization"
  }
}

main = Namespace('api', authorizations=autorizacion)


# para el menu principal el cliente unicamente necesitara el correo y su foto de perfil
@main.route('/menu/principal')
class Menu(Resource):
  method_decorators = [jwt_required()]

  @main.marshal_with(modelo_usuario,envelope='resource')
  @main.doc(security="jsonWebtoken")
  def get(self):
    usuario = Usuario.query.filter_by(id=get_jwt_identity()).first()
    return usuario
  