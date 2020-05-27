from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/", methods=['GET'])
def index():
    return "Pagina de inicio"


@app.route("/data/", methods=['GET'])
def data():
    data = {
        "data": [
            {
                "usuario": "kleiver",
                "password": "123456",
                "first_name": "kleiver",
                "last_name": "carrasco",
                "email": "kleiver615@gmail.com"
            },
            {
                "usuario": "nicolas",
                "password": "123456",
                "first_name": "nicolas",
                "last_name": "maduro",
                "email": "nicolas@patria.co.ve"
            },
        ]
    }
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
