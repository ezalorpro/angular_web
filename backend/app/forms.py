import wtforms
from flask_wtf import FlaskForm
from wtforms import ValidationError, validators

from app.models import User


class LoginForm(FlaskForm):
    username = wtforms.StringField(
        label="Usuario", validators=[validators.DataRequired(),]
    )

    password = wtforms.PasswordField(
        label="Contraseña", validators=[validators.DataRequired(),]
    )

    recordar = wtforms.BooleanField(label="recordarme?", default=False)

    def validate_password(self, field):
        user = User.query.filter(User.username == self.username.data).first()
        if user is None or not user.check_password(field.data):
            raise ValidationError("Usuario y/o contraseña invalido/s")