# AQI--Micro-Tracker-Dashboard-
Developed an interactive web dashboard that fetches real-time and historical Air Quality Index (AQI) data from a public API and visualizes pollution trends across 10+ Indian cities.
# AQI Micro-Tracker Dashboard

An interactive, browser-based dashboard that fetches real-time and historical Air Quality Index (AQI) data for Indian cities and visualizes pollution trends — built without any complex build tools or npm dependencies.

> **Built as a data analytics portfolio project** to demonstrate API data fetching, Python-based preprocessing, and frontend data visualization using Chart.js.

---

## Why I Built This

Air quality is a serious public health concern across Indian cities, but the available tools are either too technical or not mobile-friendly. I wanted to build something that anyone could open in a browser, with clean charts showing real pollution data — and use it as a learning project to practice the full pipeline from raw API data → cleaned dataset → live chart.

---
# 🌍 AQI Micro-Tracker Dashboard

<p align="center">

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-Backend-black?logo=flask)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-red?logo=chartdotjs)
![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?logo=render)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

# 📖 Overview

AQI Micro-Tracker Dashboard is an interactive web application that visualizes Air Quality Index (AQI) data for multiple Indian cities.

The dashboard provides:

- 📊 Interactive charts
- 🌍 City-wise AQI comparison
- 📈 AQI trend analysis
- 🌫 Pollutant distribution
- 🚦 Air quality category indicators
- ⚡ Responsive user interface

The project demonstrates full-stack web development using **Python, Flask, JavaScript, Chart.js, HTML, and CSS**.

---

# ✨ Features

- Live AQI Dashboard
- Multiple Indian Cities
- PM2.5 & PM10 Monitoring
- NO₂ & CO Tracking
- AQI Trend Charts
- Pollutant Distribution Chart
- City Comparison Graph
- Responsive Dashboard
- Flask REST API
- Render Deployment Ready

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js

## Backend

- Python
- Flask

## Data Processing

- Pandas
- NumPy
- Requests

## Deployment

- GitHub
- Render

---

# 📂 Project Structure

```text
AQI-Micro-Tracker-Dashboard/
│
├── dashboard/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── data/
│   └── processed/
│       └── aqi_processed.json
│
├── app.py
├── fetch_aqi_data.py
├── clean_aqi_data.py
│
├── requirements.txt
├── Procfile
├── runtime.txt
├── render.yaml
│
├── README.md
├── API.md
├── DEPLOYMENT.md
├── LICENSE
└── .gitignore
```

---

# 🏗 System Architecture

```
            AQI Data Source
                    │
                    ▼
         fetch_aqi_data.py
                    │
                    ▼
        clean_aqi_data.py
                    │
                    ▼
data/processed/aqi_processed.json
                    │
                    ▼
             Flask Backend
               (app.py)
                    │
          REST API (/api/aqi)
                    │
                    ▼
      HTML + CSS + JavaScript
             (Chart.js)
                    │
                    ▼
      Interactive AQI Dashboard
```

---

# 📸 Dashboard Preview

Add screenshots inside an **images/** folder.

```text
images/
│
├── dashboard.png
├── charts.png
└── architecture.png
```

Example:

```markdown
![Dashboard](images/dashboard.png)

![Charts](images/charts.png)
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/anushkajha1505-bi/AQI--Micro-Tracker-Dashboard-.git
```

Move into the project

```bash
cd AQI--Micro-Tracker-Dashboard-
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the application

```bash
python app.py
```

Open

```
http://localhost:5000
```

---

# 🚀 Deployment (Render)

## Build Command

```bash
pip install -r requirements.txt
```

## Start Command

```bash
gunicorn app:app
```

After deployment, your application will be available at:

```
https://your-render-app.onrender.com
```

---

# 📡 API Endpoint

### Get AQI Data

```
GET /api/aqi
```

Example Response

```json
{
  "Delhi": {
    "latest_aqi": 182,
    "category": "Poor",
    "aqi": [165,170,175,180,182]
  }
}
```

---

# 📈 Future Improvements

- Real-time AQI API Integration
- Historical Data Storage
- User Authentication
- Weather Integration
- AQI Forecasting
- Download Reports
- Dark Mode
- Mobile Application

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👩‍💻 Author

**Anushka Jha**

Computer Science Engineering Student

GitHub:
https://github.com/anushkajha1505-bi

LinkedIn:
https://www.linkedin.com/in/anushka-jha-810319313/

---

# 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project helpful, consider giving it a Star on GitHub!
