from flask import Flask
from flask_admin.contrib.sqla import ModelView
from .models import Usuario, Paciente
from .admin import UsuarioAdminView,PacienteAdminView
from flask_cors import CORS

from .extensions import api,db,admin,bcrypt,mail,jwt
from .user_resources import autenticacion
from .main import main
from .pacientes import paciente
from .especialistas import soyespecialista
from .admin import admins
from .laboratiorio import laboratorio
from .farmacia import farmacia

def create_app():
  app = Flask(__name__)
  # pendiente lo del email
  app.config["MAIL_SERVER"] = ''
  app.config["MAIL_PORT"] = ''
  app.config["MAIL_USERNAME"] = ''
  app.config["MAIL_PASSWORD"] = ''
  app.config["MAIL_USE_TLS"] = False
  app.config["MAIL_USE_SSL"] = False
  cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

  app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///db.sqlite3'
  app.config['SECRET_KEY'] = 'hashit'

  api.init_app(app)
  db.init_app(app)
  admin.init_app(app)
  bcrypt.init_app(app)
  mail.init_app(app)
  jwt.init_app(app)
  cors.init_app(app)

  admin.add_view(UsuarioAdminView(Usuario,db.session))
  admin.add_view(PacienteAdminView(Paciente, db.session))      
  api.add_namespace(autenticacion)
  api.add_namespace(main)
  api.add_namespace(paciente)
  api.add_namespace(soyespecialista)
  api.add_namespace(admins)
  api.add_namespace(laboratorio)
  api.add_namespace(farmacia)
  return app