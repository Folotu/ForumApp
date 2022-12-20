from flask import Blueprint, render_template, request, flash, jsonify, abort, redirect, url_for
from flask_login import login_required, current_user
from . import db, app
import json
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
        if (current_user.is_anonymous):
            person = "Guest"
        else:
            person = current_user.username
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
    if current_user.is_authenticated:
        specificPersonPostUpvote = Upvote.query.filter_by(post_id=post_id, author = current_user).first()
        specificPersonCommentUpvote = []
        for i in range(len(comments)):
            specificPersonCommentUpvote.append(Upvote.query.filter_by(comment=comments[i], author = current_user).first())

        # specificPersonReplyUpvote = Upvote.query.filter_by(reply_id = , author_id = current_user).all()
    return render_template('post.html', post=post, comments=comments, replies=replies, Upvotes = {'PostUpvote': specificPersonPostUpvote, 'CommsUpvote':specificPersonCommentUpvote, })

@views.route('/post/<int:post_id>/vote/<string:action>/', methods=['POST'])
def add_post_vote(post_id, action):
    if current_user.is_anonymous:
        # Do something for anonymous users
        return jsonify({'redirect': url_for('auth.login')})
    post = Post.query.get(post_id)
    if not post:
        abort(404)
    # Check if the user has already voted on this post
    upvote = Upvote.query.filter_by(author=current_user, post=post).first()

    if upvote:
        # If the user has already voted, update the vote action and vote count accordingly
        if upvote.act == 'ADD' and action == 'subtract':
            post.number_of_votes -= 2
            upvote.act = 'MIN'
        elif upvote.act == 'MIN' and action == 'add':
            post.number_of_votes += 2
            upvote.act = 'ADD'
        #The reason for adding or subtracting 2 from the vote count instead of just 1 
        # is to cancel out the previous vote. For example, if the user had previously upvoted 
        # the post and is now trying to downvote it, the vote count needs to be decreased 
        # by 2 (1 for the upvote and 1 for the downvote) to cancel out the previous vote.
        elif upvote.act == 'MIN' and action == 'unvote':
                post.number_of_votes += 1
                db.session.delete(upvote)
        elif upvote.act == 'ADD' and action == 'unvote':
                post.number_of_votes -= 1
                db.session.delete(upvote)
        
    else:
        # If the user has not voted yet, create a new vote
        if action == 'add':
            post.number_of_votes += 1
            Upvote(author=current_user, post=post, act='ADD')
        elif action == 'subtract':
            post.number_of_votes -= 1
            Upvote(author=current_user, post=post, act='MIN')

    # Commit the vote to the database
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
def add_comment_vote(comment_id, action):
    if (current_user.is_anonymous):
    # Do something for anonymous users
        return jsonify({'redirect': url_for('auth.login')})

    comment = Comment.query.get(comment_id)
    
    # Check if the user has already voted on this comment
    upvote = Upvote.query.filter_by(author=current_user, comment=comment).first()

    if upvote:
        # If the user has already voted, update the vote action and vote count accordingly
        if upvote.act == 'ADD' and action == 'subtract':
            comment.number_of_votes -= 2
            upvote.act = 'MIN'
        elif upvote.act == 'MIN' and action == 'add':
            comment.number_of_votes += 2
            upvote.act = 'ADD'
        elif upvote.act == 'MIN' and action == 'unvote':
                comment.number_of_votes += 1
                db.session.delete(upvote)
        elif upvote.act == 'ADD' and action == 'unvote':
                comment.number_of_votes -= 1
                db.session.delete(upvote)
        
    else:
        # If the user has not voted yet, create a new vote
        if action == 'add':
            comment.number_of_votes += 1
            Upvote(author=current_user, comment=comment, act='ADD')
        elif action == 'subtract':
            comment.number_of_votes -= 1
            Upvote(author=current_user, comment=comment, act='MIN')

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

@views.route('/reply/<int:reply_id>/vote/<string:action>/', methods=['POST'])

def add_reply_vote(reply_id, action):
    if (current_user.is_anonymous):
    # Do something for anonymous users
        return jsonify({'redirect': url_for('auth.login')})

    reply = Reply.query.get(reply_id)
    
    if (action == 'add'):
        reply.number_of_votes += 1
    elif (action == 'subtract'):
        reply.number_of_votes -= 1

    # commit vote on the comment to the database
    db.session.commit()

    return jsonify({'votes': reply.number_of_votes})

