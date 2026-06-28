# AQI--Micro-Tracker-Dashboard-
Developed an interactive web dashboard that fetches real-time and historical Air Quality Index (AQI) data from a public API and visualizes pollution trends across 10+ Indian cities.
# AQI Micro-Tracker Dashboard

An interactive, browser-based dashboard that fetches real-time and historical Air Quality Index (AQI) data for Indian cities and visualizes pollution trends — built without any complex build tools or npm dependencies.

> **Built as a data analytics portfolio project** to demonstrate API data fetching, Python-based preprocessing, and frontend data visualization using Chart.js.

---

## Why I Built This

Air quality is a serious public health concern across Indian cities, but the available tools are either too technical or not mobile-friendly. I wanted to build something that anyone could open in a browser, with clean charts showing real pollution data — and use it as a learning project to practice the full pipeline from raw API data → cleaned dataset → live chart.

---

## Project Structure

```
aqi-micro-tracker/
│
├── data_prep/
│   ├── fetch_aqi_data.py          # Pulls data from Open-Meteo API for multiple cities
│   ├── clean_aqi_data.py          # Cleans, normalizes, fills missing values
│   └── cities_config.json         # City names, lat/lon coordinates
│
├── data/
│   ├── raw/                       # Raw API responses (JSON)
│   └── processed/
│       └── aqi_processed.json     # Cleaned data fed into the dashboard
│
├── dashboard/
│   ├── index.html                 # Main dashboard (all-in-one HTML file)
│   ├── style.css                  # Dashboard styling
│   └── app.js                     # Chart.js visualizations + data loading
│
├── requirements.txt               # Python deps for data prep only
└── README.md
```

---

## Data Source

**API:** [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)  
**Free, no API key required.**  
**Pollutants tracked:** PM2.5, PM10, CO, NO2, Ozone

**Cities included:**
Delhi, Mumbai, Kolkata, Bengaluru, Hyderabad, Chennai, Patna, Lucknow, Jaipur, Ahmedabad

---

## Setup & Running

### Step 1 — Fetch & Clean Data (Python)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Fetch data for all cities (saves to data/raw/)
python data_prep/fetch_aqi_data.py

# Clean and normalize (saves to data/processed/aqi_processed.json)
python data_prep/clean_aqi_data.py
```

### Step 2 — Open Dashboard

Just open `dashboard/index.html` in any browser. No server needed.

```bash
# On Mac/Linux
open dashboard/index.html

# Or simply double-click index.html in your file explorer
```

> The dashboard reads from `../data/processed/aqi_processed.json` by default.

---

## Requirements (Python only)

```
requests==2.31.0
pandas==2.1.4
numpy==1.26.3
```

No npm, no Webpack, no build step.

---

## What the Dashboard Shows

| Chart | Description |
|-------|-------------|
| **Line Chart** | PM2.5 trend over last 7 days for a selected city |
| **Bar Chart** | City-wise AQI comparison (today's snapshot) |
| **Doughnut Chart** | Pollutant contribution breakdown |
| **AQI Category Banner** | Good / Moderate / Unhealthy / Hazardous label with color |

---

## Data Cleaning Steps (clean_aqi_data.py)

- **Missing values:** Forward-fill gaps (API sometimes returns null for certain hours)
- **Normalization:** AQI is computed from raw pollutant values using India's CPCB formula
- **Outlier handling:** Values beyond 3σ flagged and capped — common in API glitches
- **Format:** Output JSON structure is `{ city: { dates: [...], pm25: [...], aqi: [...] } }`

---

## Sample Output

```json
{
  "Delhi": {
    "dates": ["2026-05-01", "2026-05-02", "..."],
    "pm25": [87.3, 91.1, 76.4, "..."],
    "aqi": [162, 170, 144, "..."],
    "category": "Unhealthy"
  },
  "Bengaluru": {
    "dates": ["2026-05-01", "..."],
    "pm25": [23.1, 19.8, "..."],
    "aqi": [76, 68, "..."],
    "category": "Moderate"
  }
}
```

---

## Known Limitations

- Data is not live in the browser — you need to re-run the Python scripts to refresh
- Historical data limited to 7 days on the free API tier
- AQI calculation is approximate (using CPCB breakpoints, not official real-time government data)

---

## Possible Extensions

- Add a Python Flask/FastAPI backend to serve live data
- Add Leaflet.js India map with color-coded AQI dots
- Export chart as PNG button
- Auto-refresh every 6 hours using a cron job

---

## 📬 Contact

**Anushka Jha** — [anushkajha1505@gmail.com](mailto:anushkajha1505@gmail.com) | [LinkedIn](https://linkedin.com/in/anushka-jha-810319313)
