from flask_restx import Resource,Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from .api_models import  (full_modelo_paciente,input_anamnesis_y_examenes, 
                          modelo_anamnesis_y_examenes, input_diagnostico_y_receta, modelo_diagnostico_receta, modelo_pacientes_en_espera_examenes_completados, modelo_resultados_examenes)
from .extensions import db, bcrypt
from .models import  Usuario, Paciente,ExamenSangre, ExamenOrina, Anamnesis,Diagnostico,Medicacion



from sqlalchemy.orm import aliased

autorizacion = {
  "jsonWebToken":{
    "type":"apiKey",
    "in":"header",
    "name":"Authorizacion"
  }
}

soyespecialista = Namespace('api', authorizations=autorizacion)

@soyespecialista.route('/soyespecialista')
class PaginaParaEspecialistas(Resource):
  @soyespecialista.marshal_list_with(modelo_pacientes_en_espera_examenes_completados)
  def get(self):
 
    pacientes_con_resultados_parciales = set()
    pacientes_con_examenes_pendientes = set()
    algun_especialista = db.session.query(Usuario).filter_by(id=1).first()
  
    pacientes_en_espera = (db.session.query(Paciente)
                           .filter(
                            Paciente.proceso == 'en-sala',
                           Paciente.especialistas.contains(algun_especialista),
                           ).all()
                           )
    examenes_con_resultados = ExamenSangre.query.filter_by(status='completados', especialista_id = algun_especialista.id).all() + ExamenOrina.query.filter_by(status='completados', especialista_id=algun_especialista.id).all()
    examenes_en_laboratorio = (db.session.query(ExamenSangre).filter(ExamenSangre.status == 'en-laboratorio').all() +
                       db.session.query(ExamenOrina).filter(ExamenOrina.status =='en-laboratorio').all())


    for examen in examenes_con_resultados:
      algun_paciente = Paciente.query.filter_by(id=examen.paciente_id).first()
      if algun_paciente:
        pacientes_con_resultados_parciales.add(algun_paciente)

   
    for examen in examenes_en_laboratorio:
      algun_paciente = Paciente.query.filter_by(id=examen.paciente_id).first()
      pacientes_con_examenes_pendientes.add(algun_paciente)

    pacientes_con_resultados_completos = list(pacientes_con_resultados_parciales-pacientes_con_examenes_pendientes)
      
    lista_de_pacientes_con_resultados = [paciente for paciente in pacientes_con_resultados_completos if paciente.proceso != 'pagar-en-farmacia']
  
    
    cola_de_pacientes_en_sala = sorted(pacientes_en_espera, key=lambda x:x.fecha_de_creacion)
    cola_de_examenes_completados = sorted(lista_de_pacientes_con_resultados, key=lambda x:x.fecha_de_creacion)
    
 
    
    #podemos ver cada uno de los pacientes a ser atendidos por este especialista que al clickiarse nos llevara la pagina de anamnesis
    #podemos ver cada uno de los examanes completados que al clickiar seremos redirigidos a la pagina donde veremos la informacion y luego dar receta
    return cola_de_pacientes_en_sala + cola_de_examenes_completados
  

@soyespecialista.route("/especialista/paciente/<int:paciente_id>")
class PaginaConsulta(Resource):
  @soyespecialista.marshal_with(full_modelo_paciente)
  def get(self, paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    algun_paciente.atendido = True
    db.session.commit()
    return algun_paciente
  
  @soyespecialista.marshal_with(modelo_anamnesis_y_examenes)
  @soyespecialista.expect(input_anamnesis_y_examenes)
  def post(self,paciente_id):
    algun_especialista = Usuario.query.filter_by(id=1).first()
    examenes_disponibles = {
      'orina': ExamenOrina,
      'sangre': ExamenSangre
    }
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    nueva_consulta = Anamnesis(peso =soyespecialista.payload['peso'], altura = soyespecialista.payload['altura'],
                               consulta= soyespecialista.payload['consulta'], paciente = algun_paciente)
    
    algun_paciente.proceso = 'en-consulta'
    db.session.add(nueva_consulta)
    db.session.commit()


    for examen in soyespecialista.payload['examenes']:
      if examen in examenes_disponibles:
        examen_en_laboratorio = examenes_disponibles[examen]
        nuevo_examen = examen_en_laboratorio(status = 'en-laboratorio', paciente_id=paciente_id, especialista_id = algun_especialista.id)
        db.session.add(nuevo_examen)
        db.session.commit()

    # de aqui redireccionaremos a la pagina principal y el laboratorista podra ver que tiene pacientes en fila
    return nueva_consulta 
  
 

@soyespecialista.route('/especialistas/receta/<int:paciente_id>')
class RecetaMedica(Resource):
  @soyespecialista.marshal_with(modelo_resultados_examenes)
  def get(self,paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    examenes = ExamenSangre.query.filter_by(status='completados', paciente_id = algun_paciente.id).all() + ExamenOrina.query.filter_by(status='completados', paciente_id=algun_paciente.id).all()
    return examenes


  @soyespecialista.marshal_with(modelo_diagnostico_receta)
  @soyespecialista.expect(input_diagnostico_y_receta)
  def post(self,paciente_id):
    algun_paciente = Paciente.query.filter_by(id=paciente_id).first()
    algun_paciente.proceso = 'pagar-en-farmacia'
    db.session.commit()
    nuevo_diagnostico = Diagnostico(informacion = soyespecialista.payload['diagnostico'], paciente_id = paciente_id)
   
    db.session.add(nuevo_diagnostico)
    db.session.commit()

    medicamento = zip(soyespecialista.payload['cantidad'],soyespecialista.payload['medicamento'], soyespecialista.payload['dosis'])
    receta = '\n'.join(' '.join(map(str, i)) for i in medicamento)
    nueva_medicacion = Medicacion(informacion=receta, paciente_id=paciente_id)
    db.session.add(nueva_medicacion)
    db.session.commit()

    # redireccionar al menu principal para que puedan ir a pagar a farmacia
    return algun_paciente





