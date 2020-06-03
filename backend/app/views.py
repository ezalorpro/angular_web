from flask import make_response, redirect
from app import app

@app.route('/')
def main():
    return redirect('home')

@app.route('/home')
def home():
    return make_response(open('app/templates/index.html').read())


@app.route('/dashboard')
def dashboard():
    return make_response(open('app/templates/index.html').read())


@app.route('/login')
def login():
    return make_response(open('app/templates/index.html').read())