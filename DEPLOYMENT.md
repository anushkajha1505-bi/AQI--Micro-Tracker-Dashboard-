# Deployment Guide

## Install
pip install -r requirements.txt

## Run locally
python app.py

## Deploy on Render
1. Push project to GitHub.
2. Create a new Web Service on Render.
3. Connect your repository.
4. Build Command:
```
pip install -r requirements.txt
```
5. Start Command:
```
gunicorn app:app
```
6. Deploy.
