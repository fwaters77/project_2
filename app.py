import pandas as pd
from flask import Flask, jsonify, render_template
import json

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

app = Flask(__name__)

@app.route('/')
def home():
    '''Homescreen, i frame test'''
    return render_template('itest.html')

@app.route('/get_map_data')
def get_map_data():
    '''Pull map data from db'''
    map_data = pd.read_json('static/data/custom.geo.json')
    map_data_dict = map_data.to_dict()
    # new_dict = {}
    # for item in map_data_dict.keys():
    #     new_dict[str(item)] = map_data_dict[item]
    features = map_data_dict['features']
    types = map_data_dict['type']
    new_features = {}
    new_types = {}
    for item in features:
        new_features[str(item)] = features[item]
    for item in types:
        new_types[str(item)] = types[item]
    map_data_dict['features'] = new_features
    map_data_dict['type'] = new_types

    return jsonify(map_data_dict)

@app.route('/get_immigration_data')
def get_immigration_data():
    '''Pull immigration data from db'''
    imm_data = pd.read_json('static/data/immigration_by_country.JSON')
    imm_data_dict = imm_data.to_dict()
    new_dict = {}
    for item in imm_data_dict:
        new_dict[str(item)] = imm_data_dict[item]
    return jsonify(new_dict)

if __name__=='__main__':
    app.run(debug=True)