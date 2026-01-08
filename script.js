const LANG = {
  en: {
    title: "Typing Analytics",
    addResult: "Add Result",
    history: "History",
    headers: ["Date", "WPM", "Keystrokes", "Accuracy", "Correct", "Wrong"],
    chartLabels: ["WPM", "Accuracy"],
    wpmText: "WPM",
    chartWpm: "Speed (WPM)",
  },
  th: {
    title: "แดชบอร์ดสถิติการพิมพ์",
    addResult: "เพิ่มผลลัพธ์",
    history: "ประวัติ",
    headers: ["วันที่", "ความเร็วต่อคำ/นาที", "การกดแป้น", "ความแม่นยำ", "ถูก", "ผิด"],
    chartLabels: ["ความเร็ว", "ความแม่นยำ"],
    wpmText: "ความเร็ว",
    chartWpm: "ความเร็ว (คำ/นาที)",
  }
};

let currentLang = "en";
let stats = JSON.parse(localStorage.getItem("typingStats")) || [];
let chart;

function addStat() {
  const stat = {
    date: new Date().toLocaleString(),
    wpm: +wpm.value,
    keystrokes: +keystrokes.value,
    accuracy: +accuracy.value,
    correct: +correct.value,
    wrong: +wrong.value
  };

  stats.push(stat);
  localStorage.setItem("typingStats", JSON.stringify(stats));
  render();
}

function render() {
  const L = LANG[currentLang];

  // แก้ชื่อ title และ section h2
  document.querySelector("h1").innerText = L.title;
  const h2s = document.querySelectorAll("h2");
  if(h2s.length >= 2) {
    h2s[0].innerText = L.addResult;
    h2s[1].innerText = L.history;
  }

  // render table header
  const thead = document.querySelector("thead tr");
  if (thead) {
    thead.innerHTML = "";
    L.headers.forEach(header => {
      thead.innerHTML += `<th>${header}</th>`;
    });
  }

  // render table body
  const body = document.getElementById("history");
  body.innerHTML = "";

  stats.forEach(s => {
    body.innerHTML += `
      <tr>
        <td>${s.date}</td>
        <td>${s.wpm} ${L.wpmText}</td>
        <td>${s.keystrokes}</td>
        <td>${s.accuracy}%</td>
        <td>${s.correct}</td>
        <td>${s.wrong}</td>
      </tr>
    `;
  });

  renderChart();
}

function renderChart() {
  if (chart) chart.destroy();

  const L = LANG[currentLang];

  chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: stats.map(s => s.date),
      datasets: [
        {
          label: L.chartWpm,
          data: stats.map(s => s.wpm),
          borderColor: "#38bdf8",
          tension: 0.4
        },
        {
          label: L.chartLabels[1],
          data: stats.map(s => s.accuracy),
          borderColor: "#4ade80",
          tension: 0.4
        }
      ]
    },
    options: {
      animation: {
        duration: 1200,
        easing: "easeOutQuart"
      }
    }
  });
}

function exportCSV() {
  let csv = LANG[currentLang].headers.join(",") + "\n";
  stats.forEach(s => {
    csv += `${s.date},${s.wpm},${s.keystrokes},${s.accuracy},${s.correct},${s.wrong}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "typing_analytics.csv";
  a.click();
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "th" : "en";
  render();
}

// เรียก render ครั้งแรกตอนโหลดหน้า
render();
