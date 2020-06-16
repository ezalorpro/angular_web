from flask import make_response, redirect, render_template, request, jsonify, url_for
from werkzeug.utils import secure_filename
from flask_login import current_user
from app.models import User, ImagePost, Post
from app import app, db, photos


@app.route('/')
def main():
    return redirect('home')

@app.route('/<path:path>')
def frontend(path):
    return render_template('index.html')

@app.route("/post_image_handler", methods=["POST"], endpoint="post_image_handler")
def post_image_handler():
    image = request.files["file"]
    image_name = request.files["file"].filename
    image_db = ImagePost(user=current_user)
    db.session.add(image_db)
    db.session.flush()
    image_db.image_name = secure_filename(str(image_db.id) + "-" + image_name)
    image_name = image_db.image_name
    db.session.commit()
    photos.save(image, name=image_name)
    return jsonify({"location": url_for("static", filename="images/" + image_name)})