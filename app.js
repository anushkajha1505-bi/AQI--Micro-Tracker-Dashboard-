// app.js — AQI Micro-Tracker Dashboard

const AQI_COLORS = {
  "Good":           "#2ecc71",
  "Fair":           "#a8d08d",
  "Moderate":       "#f39c12",
  "Poor":           "#e67e22",
  "Very Poor":      "#e74c3c",
  "Extremely Poor": "#8e44ad",
  "Unknown":        "#95a5a6",
};

let aqi_data = {};
let charts = {};

// ─── Load Data ────────────────────────────────────────────────────────────────
async function loadData() {
  try {
    const res = await fetch("../data/processed/aqi_processed.json");
    aqi_data = await res.json();
    init();
  } catch (err) {
    document.querySelector("main").innerHTML =
      `<div class="error">⚠️ Could not load data. Make sure you ran the Python scripts first.<br><code>${err.message}</code></div>`;
  }
}

// ─── Initialize ───────────────────────────────────────────────────────────────
function init() {
  const cities = Object.keys(aqi_data);
  const citySelect = document.getElementById("citySelect");

  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  citySelect.addEventListener("change", () => updateCharts(citySelect.value));
  updateCharts(cities[0]);
  drawCityComparison(cities);
}

// ─── Update City Charts ───────────────────────────────────────────────────────
function updateCharts(city) {
  const d = aqi_data[city];
  const color = AQI_COLORS[d.category] || "#3498db";

  // AQI Banner
  const banner = document.getElementById("aqiBanner");
  banner.textContent = `${city} — AQI: ${d.latest_aqi} (${d.category})`;
  banner.style.background = color;

  // PM2.5 Trend
  renderLine("pm25Chart", d.dates, d.pm25, "PM2.5 (μg/m³)", "#e74c3c");

  // AQI Trend
  renderLine("aqiChart", d.dates, d.aqi, "AQI", color);

  // Pollutant Breakdown (doughnut)
  const lastIdx = d.pm25.length - 1;
  renderDoughnut("pollutantChart",
    ["PM2.5", "PM10", "NO₂", "Ozone"],
    [d.pm25[lastIdx], d.pm10[lastIdx], d.no2[lastIdx], d.ozone[lastIdx]]
  );
}

// ─── City Comparison Bar ──────────────────────────────────────────────────────
function drawCityComparison(cities) {
  const labels = cities;
  const values = cities.map(c => aqi_data[c].latest_aqi);
  const colors = cities.map(c => AQI_COLORS[aqi_data[c].category] || "#3498db");

  if (charts["cityCompareChart"]) charts["cityCompareChart"].destroy();
  charts["cityCompareChart"] = new Chart(
    document.getElementById("cityCompareChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "AQI (today)",
          data: values,
          backgroundColor: colors,
          borderRadius: 6,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, title: { display: true, text: "AQI" } } }
      }
    }
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderLine(id, labels, data, label, color) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label, data,
        borderColor: color,
        backgroundColor: color + "22",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      }]
    },
    options: {
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: false } }
    }
  });
}

function renderDoughnut(id, labels, data) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#e74c3c", "#e67e22", "#3498db", "#2ecc71"],
        borderWidth: 2,
      }]
    },
    options: {
      plugins: {
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed.toFixed(1)} μg/m³`
          }
        }
      }
    }
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────
loadData();
