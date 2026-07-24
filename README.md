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

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-black?style=for-the-badge&logo=flask)
![HTML5](https://img.shields.io/badge/HTML-5-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS-3-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript)
![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-red?style=for-the-badge&logo=chartdotjs)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A real-time Air Quality Index (AQI) dashboard that fetches air quality data, processes pollutant information, and visualizes environmental trends through interactive charts.**

**Developed by Anushka Jha**

</div>

---

# 📌 Overview

AQI Micro-Tracker Dashboard is a data visualization project that enables users to monitor air quality across multiple Indian cities.

The application collects AQI data from a public API, processes pollutant measurements using Python, and presents them through an interactive dashboard built with HTML, CSS, JavaScript, Flask, and Chart.js.

This project demonstrates the integration of data engineering, backend development, and frontend visualization into a single analytics application.

---

# ✨ Features

- 🌍 Monitor AQI across multiple Indian cities
- 📊 Interactive dashboards powered by Chart.js
- 📈 PM2.5 historical trend visualization
- 🏙 City-wise AQI comparison
- 🥧 Pollutant distribution chart
- ⚡ Flask REST API backend
- 📱 Fully responsive interface
- ☁ Ready for Render deployment

---

# 🖼 Dashboard Preview

## Home Dashboard

> Add your screenshot here

```
images/dashboard.png
```

Example:

```markdown
![Dashboard](images/dashboard.png)
```

---

## Charts

- PM2.5 Trend
- AQI Comparison
- Pollutant Distribution

(Add screenshots after deployment.)

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Chart.js

## Backend

- Flask
- Python

## Data Processing

- Pandas
- NumPy
- Requests

## Deployment

- Render
- GitHub

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

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AQI-Micro-Tracker-Dashboard.git
```

Move into the project directory

```bash
cd AQI-Micro-Tracker-Dashboard
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the Flask application

```bash
python app.py
```

Open your browser

```
http://localhost:5000
```

---

# 🚀 Deployment (Render)

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
gunicorn app:app
```

---

# 🌐 API Endpoint

## Get AQI Data

```
GET /api/aqi
```

### Sample Response

```json
{
  "city": "Delhi",
  "aqi": 142,
  "category": "Moderate",
  "pm25": 48.2,
  "pm10": 76.5,
  "co": 0.8,
  "no2": 22.4
}
```

---

# 🏗 System Architecture

```text
            Public AQI API
                    │
                    ▼
        fetch_aqi_data.py
                    │
                    ▼
       clean_aqi_data.py
                    │
                    ▼
        Processed AQI Dataset
                    │
                    ▼
              Flask Backend
              (app.py)
                    │
         REST API (/api/aqi)
                    │
                    ▼
HTML + CSS + JavaScript + Chart.js
                    │
                    ▼
      Interactive AQI Dashboard
```

---

# 📊 Visualizations

- AQI Status Card
- PM2.5 Trend Line Chart
- City Comparison Bar Chart
- Pollutant Distribution Doughnut Chart

---

# 📈 Future Improvements

- User authentication
- Live AQI updates
- Weather integration
- Interactive maps
- AQI forecasting using Machine Learning
- Dark mode
- Download reports as PDF

---

# 👩‍💻 Developer

**Anushka Jha**

Computer Science Engineering Student

- GitHub: https://github.com/anushkajha1505-bi
- LinkedIn: https://www.linkedin.com/in/anushka-jha-810319313/

---

# 📄 License

This project is licensed under the MIT License.

See the LICENSE file for more information.

---

# ⭐ Support

If you found this project helpful:

⭐ Star the repository

🍴 Fork the project

🛠 Contribute through Pull Requests

---

<div align="center">

Made with ❤️ using Python, Flask, JavaScript and Chart.js

</div>
