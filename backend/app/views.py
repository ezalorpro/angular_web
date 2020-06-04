from flask import make_response, redirect, render_template
from app import app

@app.route('/')
def main():
    return redirect('home')

@app.route('/home')
def home():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return make_response(open('app/templates/index.html').read())


@app.route('/login')
def login():
    return make_response(open('app/templates/index.html').read())