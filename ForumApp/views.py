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



@views.route('/', methods=['GET','POST'])
def index():

    if request.method == 'POST':
        Cat = request.form.get('search')

        cate = Category.query.filter_by(name=Cat.lower()).first()

        if cate is None:
            flash('Category does not exist', category='warning')
            return redirect(url_for('views.index'))
        else:
            posts = Post.query.filter_by(category_id=cate.id).all()
            return render_template('index.html', posts=posts)

    else:
        posts = Post.query.all()
        return render_template('index.html', posts=posts)


@views.route('/post', methods=['GET','POST'])
@login_required
def Createpost():
    # Handle POST request for creating a new post
    if request.method == 'POST':
        # Extract post data from the request
        title = request.form.get('title')
        description = request.form.get('description')
        category_name = request.form.get('category')
        author_id = current_user.id

        # Check if the category exists, and create it if it doesn't
        category = Category.query.filter_by(name=category_name).first()
        if category is None:
            category = Category(name=category_name.lower())
            db.session.add(category)
            db.session.commit()

        # Create the new post
        post = Post(
            title=title,
            description=description,
            category_id=category.id,
            author_id=author_id,
            number_of_votes = 0
        )
        db.session.add(post)
        db.session.commit()

        flash("Post Created", category='success')
        return redirect(url_for('views.post', post_id=post.id))
    
    else:
        
        return render_template('createPost.html', user=current_user)






@views.route('/post/<int:post_id>', methods=['GET'])
def post(post_id):
    # Handle GET request for viewing a post

    post = Post.query.get(post_id)
    if not post:
        abort(404)
    comments = Comment.query.filter_by(post_id=post_id).all()
    replies = Reply.query.all()
    return render_template('post.html', post=post, comments=comments, replies=replies)


@views.route('/post/<int:post_id>/vote/<string:action>/', methods=['POST'])
@login_required
def add_post_vote(post_id, action):
    post = Post.query.get(post_id)
    if not post:
        abort(404)

    if (action == 'add'):
        post.number_of_votes += 1
    elif (action == 'subtract'):
        post.number_of_votes -= 1

    # commit vote on the comment to the database
    db.session.commit()

    # Redirect the user to the post page
    return jsonify({'votes': post.number_of_votes})



@views.route('/post/<int:post_id>/add_comment', methods=['POST'])
@login_required
def add_comment(post_id):
    comment_text = request.form['comment']
    user_id = current_user.id 

    # Create a new comment
    comment = Comment(author_id=user_id, post_id=post_id, comment=comment_text, number_of_votes = 0)

    # Add the comment to the database
    db.session.add(comment)
    db.session.commit()

    # Redirect the user to the post page
    return redirect(url_for('views.post', post_id=post_id))


@views.route('/comment/<int:comment_id>/vote/<string:action>/', methods=['POST'])
@login_required
def add_comment_vote(comment_id, action):
    comment = Comment.query.get(comment_id)
    
    if (action == 'add'):
        comment.number_of_votes += 1
    elif (action == 'subtract'):
        comment.number_of_votes -= 1

    # commit vote on the comment to the database
    db.session.commit()

    # Redirect the user to the post page
    return jsonify({'votes': comment.number_of_votes})


@app.route('/comment/<int:comment_id>/add_reply', methods=['POST'])
@login_required
def add_reply(comment_id):
    # Query the post_id from the Comment model
    comment = Comment.query.get(comment_id)
    post_id = comment.post_id
    print(request.form)
    reply_text = request.form['reply']

    user_id = current_user.id 
    reply_parent_id = request.form['reply_parent_id']
    print(reply_parent_id)
    # Create a new reply
    if reply_parent_id != '': 
        reply_parent_id = int(reply_parent_id)
        reply = Reply(author_id=user_id, reply=reply_text, replyparent_id=reply_parent_id, number_of_votes = 0)
    else:
        reply = Reply(author_id=user_id, comment_id=comment_id, reply=reply_text, number_of_votes = 0)

    # Add the reply to the database
    db.session.add(reply)
    db.session.commit()

    # Redirect the user to the post page
    return redirect(url_for('views.post', post_id=post_id))

