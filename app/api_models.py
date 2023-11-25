from flask_restx import fields
from .extensions import api

# schema para los datos enviado desde el formulario de login
input_login_modelo = api.model('InputUsuario',{
  'correo': fields.String,
  'contrasena':fields.String
})

# schema a returnar cuando enviemos la informacion del usuario devuelta
modelo_usuario = api.model("Usuario", {
  "id":fields.Integer,
  "correo": fields.String
})

# schema para los datos enviado desde el formulario de agregar pacientes
input_modelo_paciente = api.model('InputPaciente', {
  "nombre":fields.String,
  "edad":fields.String,
  "especialistas":fields.String,
  "telefono":fields.String,
  "genero":fields.String,
  "dpi":fields.String,
  "direccion":fields.String,
})





# schema a returnar cuando enviemos la informacion del paciente  devuelta
modelo_paciente = api.model("Paciente",{ 
  "id":fields.Integer,
  "nombre":fields.String,
  "especialistas":fields.List(fields.String)
})

# schema para los datos enviado desde el formulario de buscar un paciente por id
input_modelo_buscar_paciente = api.model("InputBuscarPaciente", {
  "nombre":fields.String,
})

# # schema a returnar cuando enviemos la informacion completa del paciente
full_modelo_paciente = api.model("FullInfoPaciente",{
  "id":fields.Integer,
  "nombre":fields.String,
  "direccion":fields.String,
  "telefono":fields.String,
  "genero":fields.String,
  "dpi":fields.String,
  "especialistas":fields.List(fields.String),
  "proceso":fields.String,
  "anamnesis":fields.List(fields.String),
  "examen_sangre":fields.List(fields.String),
  "examen_orina":fields.List(fields.String),
  "diagnostico":fields.List(fields.String),
  "medicacion":fields.List(fields.String),
  "factura":fields.List(fields.String),
  "fecha_de_creacion":fields.Date
})

modelo_angtiguo_paciente = api.model('antiguoPaciente',{
  "id":fields.Integer,
  "nombre":fields.String,
  "direccion":fields.String,
  "telefono":fields.String,
  "genero":fields.String,
  "dpi":fields.String,
   "proceso":fields.String,
  "especialistas":fields.List(fields.String),
  "examen_sangre":fields.List(fields.String),
  "examen_orina":fields.List(fields.String),
  "diagnostico":fields.List(fields.String),
  "medicacion":fields.List(fields.String),
  "anamnesis":fields.List(fields.String),
  "factura":fields.List(fields.String),
})

# schema a mostrar en la pagina de especialistas
modelo_especialista = api.model("Especialista",{
  "nombre":fields.String,
  "especialidad":fields.String,
  "horario_laboral":fields.String,
  "puesto":fields.String,
  "id":fields.Integer
})

modelo_especialista_put = api.model('PutUsuario', {
  "es_admin": fields.Boolean,
  "nombre":fields.String,
  "correo": fields.String,
  "contrasena":fields.String,
  "especialidad":fields.String,
  "horario_laboral":fields.String,
  "puesto":fields.String,
})

modelo_especialista_put_input = api.model('InPutUsuarioPut', {
  "es_admin": fields.Boolean,
  "nombre":fields.String,
  "correo": fields.String,
  "contrasena":fields.String,
  "especialidad":fields.String,
  "horario_laboral":fields.String,
  "puesto":fields.String,
})

input_modelo_especialista = api.model('InputEspecialista', {
  "nombre": fields.String,
  "especialidad": fields.String,
  "puesto":fields.String
})


modelo_anamnesis_y_examenes = api.model("ShowAnamnesisYexamenes",{
   "consulta":fields.String,
  "peso":fields.Integer,
  "altura":fields.Integer,
  "examenes":fields.List(fields.String),
  "antecedentes":fields.String,
  "alergias" : fields.Boolean
})

input_anamnesis_y_examenes = api.model("InputAnamnesis",{
  "consulta":fields.String,
  "peso":fields.Integer,
  "altura":fields.Integer,
  "examenes":fields.List(fields.String),
  "antecedentes":fields.String,
  "alergias" : fields.Boolean
})




input_diagnostico_y_receta = api.model('InputRecetaYdiagnostico',{
  "diagnostico":fields.String,
  "medicamento":fields.List(fields.String),
  "cantidad":fields.List(fields.String),
  "dosis":fields.List(fields.String)
})

modelo_diagnostico_receta=api.model('DiagnosticoYreceta',{
  "proceso": fields.String
})

modelo_examenes = api.model('ExamenesDeLaboratorio', {
  "id":fields.Integer,
  "nombre":fields.String,
  "examen_orina":fields.List(fields.String),
  "examen_sangre":fields.List(fields.String)
})

input_modelo_examenes = api.model("InputExamenes",{
  "nombre":fields.String,
  "hemoglobina":fields.String,
  "hematocrito":fields.String,
  "aspecto":fields.String,
  "color":fields.String,
  "id":fields.Integer
})


modelo_pacientes_en_espera_examenes_completados =api.model("PacientesEnEsperaYexamenesCompletados",{
  "id":fields.Integer,
  "nombre":fields.String,
  "proceso":fields.String,
  "especialistas":fields.List(fields.String),

})

modelo_resultados_examenes = api.model("ExamenesConResultados",{
  "nombre":fields.String,
   "status":fields.String,
  "hemoglobina":fields.String,
  "hematocrito":fields.String,
  "aspecto":fields.String,
   "trigliceridos":fields.String,
    "glucosa":fields.String,
     "proteinas":fields.String,
  "color":fields.String,
  "id": fields.Integer,
  "paciente_id":fields.Integer

})

receta = api.model('ModeloReceta',{
  "informacion":fields.String,
  "fecha_de_creacion":fields.DateTime
})

modelo_factura = api.model("InputFactura", {
  "producto":fields.String,
  "cantidad":fields.Integer,
  "precio":fields.Integer
})

show_factura = api.model('showFactura',{
  "subtotal": fields.String,
  "paciente_id":fields.Integer,
  "total": fields.Integer
})

modelo_medicamento = api.model("factura", {
  "id":fields.Integer,
  "nombre":fields.String,
  "cantidad_disponible":fields.Integer,
  "precio":fields.Integer
})