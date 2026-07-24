"""
fetch_aqi_data.py
=================
Project: AQI Micro-Tracker Dashboard
Author: Anushka Jha

Fetches hourly air quality data for Indian cities from the Open-Meteo API.
Free to use, no API key required.

Run this first, then run clean_aqi_data.py
"""

import requests
import json
import os
from datetime import datetime, timedelta

# ─── City Configuration ───────────────────────────────────────────────────────

CITIES = {
    "Delhi":      {"lat": 28.6139, "lon": 77.2090},
    "Mumbai":     {"lat": 19.0760, "lon": 72.8777},
    "Kolkata":    {"lat": 22.5726, "lon": 88.3639},
    "Bengaluru":  {"lat": 12.9716, "lon": 77.5946},
    "Hyderabad":  {"lat": 17.3850, "lon": 78.4867},
    "Chennai":    {"lat": 13.0827, "lon": 80.2707},
    "Patna":      {"lat": 25.5941, "lon": 85.1376},
    "Lucknow":    {"lat": 26.8467, "lon": 80.9462},
    "Jaipur":     {"lat": 26.9124, "lon": 75.7873},
    "Ahmedabad":  {"lat": 23.0225, "lon": 72.5714},
}

# Open-Meteo Air Quality API endpoint
API_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality"

# Fetch last 7 days
end_date   = datetime.today().strftime("%Y-%m-%d")
start_date = (datetime.today() - timedelta(days=7)).strftime("%Y-%m-%d")

PARAMS = {
    "hourly": "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi",
    "start_date": start_date,
    "end_date":   end_date,
}

# ─── Fetch & Save ─────────────────────────────────────────────────────────────

os.makedirs("data/raw", exist_ok=True)

all_data = {}

for city, coords in CITIES.items():
    print(f"Fetching data for {city}...", end=" ")
    params = {**PARAMS, "latitude": coords["lat"], "longitude": coords["lon"]}
    
    try:
        response = requests.get(API_BASE, params=params, timeout=15)
        response.raise_for_status()
        city_data = response.json()
        all_data[city] = city_data
        
        # Save individual city file too
        with open(f"data/raw/{city.lower()}_raw.json", "w") as f:
            json.dump(city_data, f, indent=2)
        print("✅")
    
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed — {e}")
        all_data[city] = None

# Save combined raw file
with open("data/raw/all_cities_raw.json", "w") as f:
    json.dump(all_data, f, indent=2)

print(f"\n✅ Done! Raw data saved to data/raw/")
print(f"   Date range: {start_date} to {end_date}")
print(f"   Cities fetched: {sum(1 for v in all_data.values() if v is not None)}/{len(CITIES)}")
