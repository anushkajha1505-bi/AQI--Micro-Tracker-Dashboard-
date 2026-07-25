from flask import Flask, jsonify, send_from_directory
import json
from pathlib import Path

app=Flask(__name__, static_folder="dashboard", static_url_path="")

DATA=Path("data/processed/aqi_processed.json")

@app.route("/")
def index():
    return send_from_directory(app.static_folder,"index.html")

@app.route("/api/aqi")
def aqi():
    if DATA.exists():
        with open(DATA,"r",encoding="utf-8") as f:
            return jsonify(json.load(f))
    return jsonify({"error":"AQI data not found. Generate data first."}),404

@app.route("/data/processed/<path:filename>")
def send_data(filename):
    return send_from_directory("data/processed", filename)

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder,path)

if __name__=="__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)
