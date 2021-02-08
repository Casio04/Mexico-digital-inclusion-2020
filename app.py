from flask import Flask, render_template
import pandas as pd
import pymongo
from sqlalchemy import create_engine

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/State_info.html")
def state_info():
    return render_template("State_info.html")

@app.route("/api_states")
def states():
    conn = 'mongodb://localhost:27017'
    client = pymongo.MongoClient(conn)
    db = client.inclusion_digital
    estados = db.estados.find()
    states_list = []
    for estado in estados:
        states_list.append(estado["features"])

    return pd.DataFrame(states_list).to_json(orient="records")

if __name__=="__main__":
    app.run(debug=True)