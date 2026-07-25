// app.js — AQI Micro-Tracker Dashboard
// Author: Anushka Jha

const AQI_COLORS = {
  "Good":           "#22c55e",
  "Moderate":       "#eab308",
  "Poor":           "#f97316",
  "Very Poor":      "#ef4444",
  "Extremely Poor": "#a855f7",
  "Unknown":        "#64748b"
};

const AQI_DESCRIPTIONS = {
  "Good": "Air quality is satisfactory, posing little or no health risk. Outdoor activities are safe for all age groups.",
  "Moderate": "Air quality is acceptable. Sensitive individuals (asthma, heart condition) may experience slight respiratory discomfort upon prolonged exposure.",
  "Poor": "Unhealthy air quality! Children, elderly, and individuals with lung issues should limit prolonged outdoor exertion.",
  "Very Poor": "Health alert! Increased likelihood of adverse respiratory impacts for everyone. Wearing N95 masks and using air purifiers is strongly recommended.",
  "Extremely Poor": "Emergency conditions! High risk of severe respiratory distress for the entire population. Avoid all outdoor activities and keep windows closed."
};

let aqi_data = {};
let charts = {};

// ─── Load Data ────────────────────────────────────────────────────────────────
async function loadData() {
  try {
    let res;
    try {
      res = await fetch("/api/aqi");
      if (!res.ok) throw new Error("API route unavailable");
    } catch (e) {
      // Fallback to static relative file path
      res = await fetch("./data/processed/aqi_processed.json");
    }
    if (!res.ok) throw new Error("HTTP error loading dataset");
    aqi_data = await res.json();
    init();
  } catch (err) {
    document.querySelector(".main-content").innerHTML =
      `<div class="error-banner">
         ⚠️ <h3>Could not load AQI Data</h3>
         <p>Please run <code>clean_aqi_data.py</code> or verify data files exist.<br>Details: <code>${err.message}</code></p>
       </div>`;
  }
}

// ─── Initialize Dashboard ─────────────────────────────────────────────────────
function init() {
  const cities = Object.keys(aqi_data);
  const citySelect = document.getElementById("citySelect");
  citySelect.innerHTML = "";

  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  citySelect.addEventListener("change", (e) => {
    const selectedCity = e.target.value;
    updateCityDashboard(selectedCity);
    updateCityReport(selectedCity);
  });

  setupNavigation();

  const initialCity = cities[0] || "Delhi";
  updateCityDashboard(initialCity);
  drawCityComparison(cities);
  renderStatisticsView();
  updateCityReport(initialCity);
}

// ─── Tab Navigation Setup ─────────────────────────────────────────────────────
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(nav => nav.classList.remove("active"));
      item.classList.add("active");

      const targetTab = item.getAttribute("data-tab");
      document.querySelectorAll(".tab-view").forEach(tab => tab.classList.remove("active"));
      const activeTab = document.getElementById(targetTab);
      if (activeTab) activeTab.classList.add("active");

      const titles = {
        "dashboard-view": { title: "Air Quality Index Dashboard", sub: "Real-Time & Historical Air Quality Monitoring Across Major Cities" },
        "statistics-view": { title: "Environmental Statistics & Analytics", sub: "Cross-city rankings, national averages, and detailed pollutant breakdowns" },
        "reports-view": { title: "City Diagnostic & Health Impact Reports", sub: "Tailored health advisories, exposure warnings, and safety recommendations" },
        "about-view": { title: "About AQI Micro-Tracker", sub: "Project background, technology stack, AQI standards, and data source details" }
      };

      if (titles[targetTab]) {
        document.getElementById("pageTitle").textContent = titles[targetTab].title;
        document.getElementById("pageSubTitle").textContent = titles[targetTab].sub;
      }

      if (targetTab === "statistics-view") {
        setTimeout(renderStatsRankingChart, 100);
      }
    });
  });
}

// ─── Update City Dashboard ────────────────────────────────────────────────────
function updateCityDashboard(city) {
  const d = aqi_data[city];
  if (!d) return;

  const color = AQI_COLORS[d.category] || "#2563eb";

  // Banner Update
  const banner = document.getElementById("aqiBanner");
  banner.style.background = `linear-gradient(135deg, ${color}, ${color}cc)`;

  document.getElementById("aqiValue").textContent = d.latest_aqi;
  const badge = document.getElementById("aqiBadge");
  badge.textContent = d.category;
  badge.style.background = "rgba(255, 255, 255, 0.25)";
  badge.style.color = "#ffffff";

  document.getElementById("aqiCategory").textContent = `${city} — ${d.category} Air Quality`;
  document.getElementById("aqiDescription").textContent = AQI_DESCRIPTIONS[d.category] || "Live environmental sensors tracking airborne pollutants.";
  document.getElementById("bannerCityName").textContent = `${city} Sensor Station`;

  // Pollutant Stat Cards
  const pm25Val = d.latest_pm25 ?? d.pm25[d.pm25.length - 1];
  const pm10Val = d.latest_pm10 ?? d.pm10[d.pm10.length - 1];
  const coVal = d.latest_co ?? (d.co ? d.co[d.co.length - 1] : 500);
  const no2Val = d.latest_no2 ?? d.no2[d.no2.length - 1];

  document.getElementById("pm25Value").textContent = pm25Val;
  document.getElementById("pm10Value").textContent = pm10Val;
  document.getElementById("coValue").textContent = coVal;
  document.getElementById("no2Value").textContent = no2Val;

  setStatTag("pm25Status", pm25Val, 30, 60);
  setStatTag("pm10Status", pm10Val, 50, 100);
  setStatTag("coStatus", coVal, 400, 800);
  setStatTag("no2Status", no2Val, 25, 50);

  // Render Charts
  renderTrendChart(d.dates, d.pm25, d.aqi);
  renderPollutantDoughnut(d);
}

function setStatTag(elemId, value, moderateThreshold, highThreshold) {
  const elem = document.getElementById(elemId);
  if (!elem) return;
  if (value > highThreshold) {
    elem.textContent = "High Concentration";
    elem.className = "stat-tag tag-danger";
  } else if (value > moderateThreshold) {
    elem.textContent = "Moderate Level";
    elem.className = "stat-tag tag-warning";
  } else {
    elem.textContent = "Safe Limit";
    elem.className = "stat-tag tag-success";
  }
}

// ─── Visual Charts ────────────────────────────────────────────────────────────

// 1. Trend Chart (Line)
function renderTrendChart(dates, pm25Data, aqiData) {
  const ctx = document.getElementById("pm25Chart");
  if (!ctx) return;
  if (charts["pm25Chart"]) charts["pm25Chart"].destroy();

  charts["pm25Chart"] = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "AQI Index",
          data: aqiData,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: "#2563eb"
        },
        {
          label: "PM2.5 (µg/m³)",
          data: pm25Data,
          borderColor: "#ef4444",
          borderDash: [5, 5],
          backgroundColor: "transparent",
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#ef4444"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true }
      }
    }
  });
}

// 2. City Comparison Chart (Bar)
function drawCityComparison(cities) {
  const ctx = document.getElementById("cityCompareChart");
  if (!ctx) return;
  if (charts["cityCompareChart"]) charts["cityCompareChart"].destroy();

  const labels = cities;
  const values = cities.map(c => aqi_data[c].latest_aqi);
  const colors = cities.map(c => AQI_COLORS[aqi_data[c].category] || "#2563eb");

  charts["cityCompareChart"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "AQI Level",
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
        barThickness: 24
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` AQI: ${ctx.parsed.y} (${aqi_data[cities[ctx.dataIndex]].category})`
          }
        }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Air Quality Index" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// 3. Pollutant Breakdown (Doughnut)
function renderPollutantDoughnut(d) {
  const ctx = document.getElementById("pollutantChart");
  if (!ctx) return;
  if (charts["pollutantChart"]) charts["pollutantChart"].destroy();

  const pm25 = d.latest_pm25 ?? d.pm25[d.pm25.length - 1];
  const pm10 = d.latest_pm10 ?? d.pm10[d.pm10.length - 1];
  const co = (d.latest_co ?? (d.co ? d.co[d.co.length - 1] : 500)) / 10; // scaled for comparative doughnut visibility
  const no2 = d.latest_no2 ?? d.no2[d.no2.length - 1];
  const ozone = d.latest_ozone ?? (d.ozone ? d.ozone[d.ozone.length - 1] : 30);

  charts["pollutantChart"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["PM2.5", "PM10", "CO (÷10)", "NO₂", "Ozone"],
      datasets: [{
        data: [pm25, pm10, co, no2, ozone],
        backgroundColor: ["#ef4444", "#f97316", "#3b82f6", "#a855f7", "#22c55e"],
        borderWidth: 3,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed} µg/m³`
          }
        }
      }
    }
  });
}

// ─── Statistics View Logic ────────────────────────────────────────────────────
function renderStatisticsView() {
  const cities = Object.keys(aqi_data);
  if (!cities.length) return;

  // Calculate overview metrics
  let highest = cities[0];
  let cleanest = cities[0];
  let sumAQI = 0;

  cities.forEach(c => {
    const aqi = aqi_data[c].latest_aqi;
    sumAQI += aqi;
    if (aqi > aqi_data[highest].latest_aqi) highest = c;
    if (aqi < aqi_data[cleanest].latest_aqi) cleanest = c;
  });

  const avgAQI = Math.round(sumAQI / cities.length);

  document.getElementById("statHighestCity").textContent = highest;
  document.getElementById("statHighestVal").textContent = `AQI: ${aqi_data[highest].latest_aqi} (${aqi_data[highest].category})`;
  document.getElementById("statCleanestCity").textContent = cleanest;
  document.getElementById("statCleanestVal").textContent = `AQI: ${aqi_data[cleanest].latest_aqi} (${aqi_data[cleanest].category})`;
  document.getElementById("statNationalAvg").textContent = `${avgAQI} AQI`;

  // Render Table
  const tbody = document.getElementById("statsTableBody");
  tbody.innerHTML = "";

  cities.forEach(city => {
    const d = aqi_data[city];
    const color = AQI_COLORS[d.category] || "#64748b";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${city}</strong></td>
      <td><span class="aqi-num-badge" style="background: ${color}">${d.latest_aqi}</span></td>
      <td><span class="badge" style="background: ${color}20; color: ${color}; border: 1px solid ${color}">${d.category}</span></td>
      <td>${d.latest_pm25 ?? d.pm25[d.pm25.length - 1]}</td>
      <td>${d.latest_pm10 ?? d.pm10[d.pm10.length - 1]}</td>
      <td>${d.latest_co ?? (d.co ? d.co[d.co.length - 1] : "--")}</td>
      <td>${d.latest_no2 ?? d.no2[d.no2.length - 1]}</td>
      <td>${getHealthRatingText(d.category)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function getHealthRatingText(category) {
  switch (category) {
    case "Good": return "🟢 Excellent / Safe Air";
    case "Moderate": return "🟡 Acceptable Air";
    case "Poor": return "🟠 Caution for Sensitive Groups";
    case "Very Poor": return "🔴 Respiratory Alert";
    case "Extremely Poor": return "🟣 Hazardous / Emergency";
    default: return "⚪ Monitoring";
  }
}

function renderStatsRankingChart() {
  const ctx = document.getElementById("statsRankingChart");
  if (!ctx) return;
  if (charts["statsRankingChart"]) charts["statsRankingChart"].destroy();

  const cities = Object.keys(aqi_data).sort((a, b) => aqi_data[a].latest_aqi - aqi_data[b].latest_aqi);
  const values = cities.map(c => aqi_data[c].latest_aqi);
  const colors = cities.map(c => AQI_COLORS[aqi_data[c].category] || "#2563eb");

  charts["statsRankingChart"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: cities,
      datasets: [{
        label: "AQI Score",
        data: values,
        backgroundColor: colors,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } }
    }
  });
}

// ─── Reports View Logic ───────────────────────────────────────────────────────
function updateCityReport(city) {
  const d = aqi_data[city];
  if (!d) return;

  document.getElementById("reportCityName").textContent = `${city} Environmental Diagnostic Report`;
  document.getElementById("reportDateRange").textContent = `Assessment Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

  // Health Risk Content
  const healthBox = document.getElementById("reportHealthContent");
  healthBox.innerHTML = `
    <div class="report-status-banner" style="border-left: 5px solid ${AQI_COLORS[d.category]}">
      <h4>Status: ${d.category} (AQI ${d.latest_aqi})</h4>
      <p>${AQI_DESCRIPTIONS[d.category]}</p>
    </div>
    <ul class="report-list">
      <li><strong>General Population Impact:</strong> ${d.latest_aqi > 150 ? "High risk of irritation to throat, eyes, and lungs upon outdoor exposure." : "Low to moderate impact for healthy adults."}</li>
      <li><strong>Sensitive Groups Exposure:</strong> Children, pregnant women, and elderly citizens should limit outdoor activities.</li>
      <li><strong>Predominant Airborne Threat:</strong> Fine particulate matter PM2.5 (${d.latest_pm25 ?? d.pm25[d.pm25.length-1]} µg/m³) exceeding WHO guidelines.</li>
    </ul>
  `;

  // Action Guidelines Content
  const actionBox = document.getElementById("reportActionContent");
  actionBox.innerHTML = `
    <div class="action-grid">
      <div class="action-item">
        <span class="action-icon">😷</span>
        <div>
          <h5>Mask Protection</h5>
          <p>${d.latest_aqi > 100 ? "Wear N95/FFP2 respirators when stepping outdoors." : "Standard cloth mask optional."}</p>
        </div>
      </div>
      <div class="action-item">
        <span class="action-icon">🏡</span>
        <div>
          <h5>Indoor Ventilation</h5>
          <p>${d.latest_aqi > 150 ? "Keep windows closed during morning/evening peak pollution hours." : "Open windows for natural airflow."}</p>
        </div>
      </div>
      <div class="action-item">
        <span class="action-icon">💨</span>
        <div>
          <h5>Air Purifiers</h5>
          <p>${d.latest_aqi > 120 ? "HEPA air purifiers strongly recommended in living and sleeping rooms." : "Optional based on sensitivity."}</p>
        </div>
      </div>
    </div>
  `;

  // Pollutant Safety Breakdown Table
  const pm25Val = d.latest_pm25 ?? d.pm25[d.pm25.length - 1];
  const pm10Val = d.latest_pm10 ?? d.pm10[d.pm10.length - 1];
  const coVal = d.latest_co ?? (d.co ? d.co[d.co.length - 1] : 500);
  const no2Val = d.latest_no2 ?? d.no2[d.no2.length - 1];

  const body = document.getElementById("reportPollutantBody");
  body.innerHTML = `
    <tr>
      <td><strong>PM 2.5</strong></td>
      <td>${pm25Val} µg/m³</td>
      <td>15 µg/m³ (24-hr)</td>
      <td>60 µg/m³</td>
      <td>${pm25Val > 60 ? "<span class='badge tag-danger'>Exceeded</span>" : "<span class='badge tag-success'>Within Limit</span>"}</td>
    </tr>
    <tr>
      <td><strong>PM 10</strong></td>
      <td>${pm10Val} µg/m³</td>
      <td>45 µg/m³ (24-hr)</td>
      <td>100 µg/m³</td>
      <td>${pm10Val > 100 ? "<span class='badge tag-danger'>Exceeded</span>" : "<span class='badge tag-success'>Within Limit</span>"}</td>
    </tr>
    <tr>
      <td><strong>CO (Carbon Monoxide)</strong></td>
      <td>${coVal} µg/m³</td>
      <td>4000 µg/m³</td>
      <td>2000 µg/m³</td>
      <td>${coVal > 2000 ? "<span class='badge tag-danger'>Exceeded</span>" : "<span class='badge tag-success'>Within Safe Limit</span>"}</td>
    </tr>
    <tr>
      <td><strong>NO₂ (Nitrogen Dioxide)</strong></td>
      <td>${no2Val} µg/m³</td>
      <td>25 µg/m³</td>
      <td>80 µg/m³</td>
      <td>${no2Val > 40 ? "<span class='badge tag-warning'>Moderate</span>" : "<span class='badge tag-success'>Within Safe Limit</span>"}</td>
    </tr>
  `;
}

// ─── Kickoff ──────────────────────────────────────────────────────────────────
loadData();
