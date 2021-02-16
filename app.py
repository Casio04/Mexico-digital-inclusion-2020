from flask import Flask, render_template, jsonify
from flask.json import JSONEncoder
import pandas as pd
import pymongo
import json
from bson import json_util
from mongoengine.base import BaseDocument
from mongoengine.queryset.base import BaseQuerySet

class MongoEngineJSONEncoder(JSONEncoder):
    def default(self,obj):
        if isinstance(obj,BaseDocument):
            return json_util._json_convert(obj.to_mongo())
        elif isinstance(obj,BaseQuerySet):
            return json_util._json_convert(obj.as_pymongo())
        return JSONEncoder.default(self, obj)

app = Flask(__name__)
app.json_encoder = MongoEngineJSONEncoder

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
   
    conn = 'mongodb+srv://CarlosCasio:Casio@censuscluster.yunqv.mongodb.net/censo?retryWrites=true&w=majority'
    client = pymongo.MongoClient(conn)
    db = client.censo
    estados = db.estados.find()
    # print(estados)
    states_list = []
    for estado in estados:
        states_list.append(estado["features"])
    json_sates = json.dumps(list([i[0] for i in states_list]))
    client.close()
    return json_sates

@app.route("/api_municipios/<state>")
def municipalities(state):
    conn = 'mongodb+srv://CarlosCasio:Casio@censuscluster.yunqv.mongodb.net/censoMunicipio?retryWrites=true&w=majority'
    client = pymongo.MongoClient(conn)
    db = client.censoMunicipio
    # db = client.inclusion_digital
    municipios = db.municipios.find({"features.properties.ENTIDAD": int(state)},{'_id': False})
    mun_list = []
    for mun in municipios:
        mun_list.append(mun)
    
    client.close()

    # json_result = json.dumps(list([i[0] for i in mun_list]))
    return json.dumps(mun_list)

@app.route("/api_municipios_no_coords")
def no_coords():
    conn = 'mongodb+srv://CarlosCasio:Casio@censuscluster.yunqv.mongodb.net/cordlessMun?retryWrites=true&w=majority'
    client = pymongo.MongoClient(conn)
    db = client.cordlessMun
    municipios = db.municipios.find({},{'_id': False})
    # print(estados)
    mun_list = []
    for mun in municipios:
        mun_list.append(mun)

    client.close()
    return json.dumps(mun_list)
        
if __name__=="__main__":
    app.debug = True
    app.run()