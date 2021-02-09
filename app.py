from flask import Flask, render_template
import pandas as pd
import pymongo
import json


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/index.html")
def index_2():
    return render_template("index.html")

@app.route("/national.html")
def state_info():
    return render_template("national.html")

@app.route("/statal.html")
def statal():
    return render_template("statal.html")

@app.route("/about.html")
def about():
    return render_template("about.html")

@app.route("/api_states")
def states():
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)
    db = client.inclusion_digital
    estados = db.estados.find()
    states_list = []
    for estado in estados:
        states_list.append(estado["features"])

    return json.dumps(list([i[0] for i in states_list]))

if __name__=="__main__":
    app.run(debug=True)