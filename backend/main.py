from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
from flask_cors import CORS
from sqlalchemy_serializer import SerializerMixin


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///php_web"
CORS(app)
db = SQLAlchemy(app)

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String, index=True, unique=True, nullable=False)
    first_name = db.Column(db.String, index=True)
    last_name = db.Column(db.String, index=True)
    email = db.Column(db.String, index=True, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, index=True)
    avatar_url = db.Column(db.String, index=True)
    location = db.Column(db.String, index=True)
    gender = db.Column(JSON)
    information = db.Column(db.Text, index=True)
    roles = db.Column(JSON)
    
@app.route("/", methods=['GET'])
def index():
    return "Pagina de inicio"


@app.route("/data/", methods=['GET'])
def data():
    Query_result = User.query.order_by(User.id).all()
    data = {'data': []}
    for user in Query_result:
        user_dict = user.to_dict()
        if isinstance(user_dict['roles'],dict):
            user_dict['roles'] = [role for _,role in user_dict['roles'].items()]
        user_dict['roles'].sort()
        data['data'].append(user_dict)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
