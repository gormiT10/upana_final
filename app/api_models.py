from flask_restx import fields
from .extensions import api

input_login_modelo = api.model('InputUsuario',{
  'correo': fields.String,
  'contrasena':fields.String
})

modelo_usuario = api.model("Usuario", {
  "id":fields.Integer,
  "correo": fields.String
})

input_modelo_paciente = api.model('InputPaciente', {
  "nombre":fields.String,
  "especialistas":fields.String
})

modelo_paciente = api.model("Paciente",{
  "id":fields.Integer,
  "nombre":fields.String,
  "especialistas":fields.List(fields.String)
})

input_modelo_buscar_paciente = api.model("InputBuscarPaciente", {
  "id":fields.Integer,
})

full_modelo_paciente = api.model("FullInfoPaciente",{
  "id":fields.Integer,
  "nombre":fields.String,
  "especialistas":fields.List(fields.String),
  "atendido":fields.Boolean
})