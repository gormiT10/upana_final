from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_admin import Admin
from flask_bcrypt import Bcrypt
from flask_mailman import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# 1. extension de flask_restx api
#2. nuestro ORM sqlalchemy
# 3.admin para usar el admin panel
# 4.bcrypt para hacer el hashing de las contrasenas
#5. para mandar correos cuando un usuario es agregado
#6. json web token para la comunicacion efectiva entre servidores

api = Api()
db = SQLAlchemy()
admin = Admin()
bcrypt = Bcrypt()
mail = Mail()
jwt = JWTManager()
