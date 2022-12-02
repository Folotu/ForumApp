from flask import Blueprint, render_template, request, flash, jsonify, abort, redirect, url_for
from flask_login import login_required, current_user
from . import db, app
import json
# from flask_cors import CORS
from .models import *
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, request, redirect, url_for
views = Blueprint('views', __name__)



@views.route('/admin', methods=['GET', 'POST'])
def home():

    # return redirect(url_for('admin.index'))
    pass
    # return render_template("base.html", current_user)
    # return render_template("adminhome.html")


@views.route('/')
def index():
    posts = Post.query.all()
    return render_template('index.html', posts=posts)


@views.route('/post/<int:post_id>', methods=['GET', 'POST'])
def post(post_id):
    # Handle POST request for creating a new post
    if request.method == 'POST':
        # Extract post data from the request
        title = request.form.get('title')
        description = request.form.get('description')
        category_name = request.form.get('category')
        author_id = request.form.get('author_id')

        # Check if the category exists, and create it if it doesn't
        category = Category.query.filter_by(name=category_name).first()
        if category is None:
            category = Category(name=category_name)
            db.session.add(category)
            db.session.commit()

        # Create the new post
        post = Post(
            title=title,
            description=description,
            category_id=category.id,
            author_id=author_id
        )
        db.session.add(post)
        db.session.commit()

    # Handle GET request for viewing a post
    else:
        post = Post.query.get(post_id)
        comments = Comment.query.filter_by(post_id=post_id).all()
        return render_template('post.html', post=post, comments=comments)




@views.route('/post/<int:post_id>/add_comment', methods=['POST'])
def add_comment(post_id):
    comment_text = request.form['comment']
    user_id = request.form['user_id']

    # Create a new comment
    comment = Comment(author_id=user_id, post_id=post_id, comment=comment_text)

    # Add the comment to the database
    db.session.add(comment)
    db.session.commit()

    # Redirect the user to the post page
    return redirect(url_for('post', post_id=post_id))


@app.route('/comment/<int:comment_id>/add_reply', methods=['POST'])
def add_reply(comment_id):
    # Query the post_id from the Comment model
    comment = Comment.query.get(comment_id)
    post_id = comment.post_id

    reply_text = request.form['reply']
    user_id = request.form['user_id']
    reply_parent_id = request.form['reply_parent_id']

    # Create a new reply
    reply = Reply(author_id=user_id, comment_id=comment_id, reply=reply_text, reply_parent_id=reply_parent_id)

    # Add the reply to the database
    db.session.add(reply)
    db.session.commit()

    # Redirect the user to the post page
    return redirect(url_for('post', post_id=post_id))

