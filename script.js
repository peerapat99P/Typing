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
  const body = document.getElementById("history");
  body.innerHTML = "";

  stats.forEach(s => {
    body.innerHTML += `
      <tr>
        <td>${s.date}</td>
        <td>${s.wpm}</td>
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

  chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: stats.map(s => s.date),
      datasets: [
        {
          label: "WPM",
          data: stats.map(s => s.wpm),
          borderColor: "#38bdf8",
          tension: 0.4
        },
        {
          label: "Accuracy",
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
  let csv = "Date,WPM,Keystrokes,Accuracy,Correct,Wrong\n";
  stats.forEach(s => {
    csv += `${s.date},${s.wpm},${s.keystrokes},${s.accuracy},${s.correct},${s.wrong}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "typing_analytics.csv";
  a.click();
}

render();
