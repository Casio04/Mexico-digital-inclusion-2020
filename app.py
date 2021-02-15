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

@app.route("/api_municipios")
def municipalities():
    conn = 'mongodb+srv://CarlosCasio:Casio@censuscluster.yunqv.mongodb.net/censoMunicipio?retryWrites=true&w=majority'
    client = pymongo.MongoClient(conn)
    db = client.censoMunicipio
    # db = client.inclusion_digital
    municipios = db.municipios.find({},{'coordinates': False})
    mun_list = []
    for mun in municipios:
        mun_list.append(mun["features"])
    
    client.close()
    json_result = json.dumps(list([i[0] for i in mun_list]))
    return json_result

@app.route("/api_municipios_no_coords")
def no_coords():
    conn = 'mongodb+srv://CarlosCasio:Casio@censuscluster.yunqv.mongodb.net/censoMunicipio?retryWrites=true&w=majority'
    client = pymongo.MongoClient(conn)
    db = client.censoMunicipio
    # db = client.inclusion_digital
    municipios = db.municipios.find()
    mun_list = []
    for iteration, mun in enumerate(municipios):
        mun_list.append(mun["features"])
        del mun_list[iteration][0]["geometry"]

    client.close()
    json_result = json.dumps(list([i[0] for i in mun_list]))
    return json_result

if __name__=="__main__":
    app.run()