# 🚀 Render Deployment Guide — AQI Micro-Tracker Dashboard

This guide provides step-by-step instructions to deploy your Flask web application on **Render.com** (Free Web Service).

---

## 📋 Step 1: Commit and Push Your Changes to GitHub

Make sure all your latest files (`dashboard/`, `data/processed/aqi_processed.json`, `app.py`, `requirements.txt`, `Procfile`) are committed and pushed to your GitHub repository.

In your terminal / Git command line:
```bash
git add .
git commit -m "Fix dashboard UI, sync app.js with index.html, populate statistics, reports, about panels"
git push origin main
```

---

## 🌐 Step 2: Create a Web Service on Render

1. Log into your **[Render Dashboard](https://dashboard.render.com)** (sign in with GitHub).
2. Click the **"New +"** button at the top right and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and click **Next**.
4. Search for your repository **`AQI--Micro-Tracker-Dashboard-`** and click **Connect**.

---

## ⚙️ Step 3: Configure Service Settings

Fill in the following details on the setup screen:

| Setting Field | Value to Enter |
| :--- | :--- |
| **Name** | `aqi-micro-tracker` *(or any preferred name)* |
| **Region** | Select nearest region *(e.g., Singapore or Oregon)* |
| **Branch** | `main` |
| **Root Directory** | *(Leave blank)* |
| **Runtime / Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | `Free` |

> [!TIP]
> **Optional (Auto-Fetch Fresh Data on Build)**: If you want Render to automatically pull fresh live API data every time you deploy, set the **Build Command** to:
> ```bash
> pip install -r requirements.txt && python fetch_aqi_data.py && python clean_aqi_data.py
> ```

---

## 🚀 Step 4: Deploy & Access

1. Scroll to the bottom and click **"Create Web Service"**.
2. Render will automatically build the service, install dependencies, and launch `gunicorn`.
3. Once the build log shows **"Your service is live 🎉"**, click the public URL (e.g., `https://aqi-micro-tracker.onrender.com`) at the top of the screen.

Your AQI Micro-Tracker Dashboard is now live on the internet! 🍃
