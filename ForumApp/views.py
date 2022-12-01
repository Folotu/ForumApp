from flask import Blueprint, render_template, request, flash, jsonify, abort, redirect, url_for
from flask_login import login_required, current_user
from . import db, app
import json
# from flask_cors import CORS
from .models import *
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash

views = Blueprint('views', __name__)



@views.route('/admin', methods=['GET', 'POST'])
def home():

    # return redirect(url_for('admin.index'))
    pass
    # return render_template("base.html", current_user)
    # return render_template("adminhome.html")