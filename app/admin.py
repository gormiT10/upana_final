from flask_admin.contrib.sqla import ModelView
import secrets
import string
from .extensions import bcrypt
from flask_wtf import FlaskForm
from .models import Usuario



# buscar como agregar mas caracteres pero sin que agregfa
def generar_contrasena(length=8):
    chars = string.ascii_letters + string.digits
    contrasena = ''.join(secrets.choice(chars) for i in range(length))
    return contrasena


class UsuarioAdminView(ModelView):
    columnas = ["nombre", "correo"]
    contrasena = ''


    def on_model_change(self, form, model, is_created):

        if is_created:
            usuario = form.nombre.data
            email_domain = "hospital.org"  
            correo = f"{usuario}@{email_domain}"
            model.correo = correo

            contrasena = generar_contrasena()
            print(contrasena)
            hashed_contrasena = bcrypt.generate_password_hash(contrasena).decode('utf-8')
            model.contrasena = hashed_contrasena

class PacienteAdminView(ModelView):
    columnas = ['nombre', 'especialistas', ]
    