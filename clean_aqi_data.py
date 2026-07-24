"""
clean_aqi_data.py
=================
Project: AQI Micro-Tracker Dashboard


Reads raw JSON from data/raw/all_cities_raw.json
Cleans, normalizes, and outputs data/processed/aqi_processed.json
which is directly consumed by the dashboard frontend.
"""

import json
import pandas as pd
import numpy as np
import os

os.makedirs("data/processed", exist_ok=True)

# AQI category labels based on European AQI scale (0-500)
def get_aqi_category(aqi_value):
    if aqi_value is None or np.isnan(aqi_value):
        return "Unknown"
    if aqi_value <= 20:  return "Good"
    if aqi_value <= 40:  return "Fair"
    if aqi_value <= 60:  return "Moderate"
    if aqi_value <= 80:  return "Poor"
    if aqi_value <= 100: return "Very Poor"
    return "Extremely Poor"

# Load raw data
with open("data/raw/all_cities_raw.json", "r") as f:
    raw = json.load(f)

processed = {}

for city, data in raw.items():
    if data is None:
        print(f"  Skipping {city} — no data available")
        continue

    hourly = data.get("hourly", {})
    times  = hourly.get("time", [])

    # Build a DataFrame from hourly readings
    df = pd.DataFrame({
        "datetime":  pd.to_datetime(times),
        "pm25":      hourly.get("pm2_5", [None]*len(times)),
        "pm10":      hourly.get("pm10",  [None]*len(times)),
        "co":        hourly.get("carbon_monoxide", [None]*len(times)),
        "no2":       hourly.get("nitrogen_dioxide", [None]*len(times)),
        "ozone":     hourly.get("ozone", [None]*len(times)),
        "aqi":       hourly.get("european_aqi", [None]*len(times)),
    })

    # ── Cleaning ──────────────────────────────────────────────────────────────

    # Forward fill gaps (API sometimes misses certain hours)
    df.fillna(method="ffill", inplace=True)
    df.fillna(method="bfill", inplace=True)  # Handle leading NaNs

    # Cap outliers: values beyond mean + 3*std are likely sensor glitches
    for col in ["pm25", "pm10", "aqi"]:
        mean, std = df[col].mean(), df[col].std()
        df[col] = df[col].clip(lower=0, upper=mean + 3*std)

    # Round to 1 decimal
    for col in ["pm25", "pm10", "co", "no2", "ozone", "aqi"]:
        df[col] = df[col].round(1)

    # ── Aggregate to Daily ────────────────────────────────────────────────────
    df["date"] = df["datetime"].dt.strftime("%Y-%m-%d")
    daily = df.groupby("date").agg({
        "pm25":  "mean",
        "pm10":  "mean",
        "co":    "mean",
        "no2":   "mean",
        "ozone": "mean",
        "aqi":   "mean",
    }).round(1).reset_index()

    latest_aqi = daily["aqi"].iloc[-1] if not daily.empty else None

    processed[city] = {
        "dates":    daily["date"].tolist(),
        "pm25":     daily["pm25"].tolist(),
        "pm10":     daily["pm10"].tolist(),
        "co":       daily["co"].tolist(),
        "no2":      daily["no2"].tolist(),
        "ozone":    daily["ozone"].tolist(),
        "aqi":      daily["aqi"].tolist(),
        "latest_aqi": latest_aqi,
        "category": get_aqi_category(latest_aqi),
    }
    print(f"\ {city}: {len(daily)} days | Latest AQI: {latest_aqi} ({processed[city]['category']})")

# Save
with open("data/processed/aqi_processed.json", "w") as f:
    json.dump(processed, f, indent=2)

print(f"\n Processed data saved → data/processed/aqi_processed.json")
print(f"   Cities processed: {len(processed)}")
