const API_BASE = 'http://localhost:3000/api/audit-trail/insights';

const ACTION_COLORS = {
  INSERT: '#28a745',
  UPDATE: '#ffc107',
  DELETE: '#dc3545',
};

function showLoading(visible) {
  document.getElementById('loading').classList.toggle('hidden', !visible);
}

function showError(msg) {
  const el = document.getElementById('error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

async function fetchAll() {
  showLoading(true);
  try {
    const [topTables, overTime, byAction, byUser] = await Promise.all([
      fetch(`${API_BASE}/top-tables`).then(r => r.json()),
      fetch(`${API_BASE}/over-time`).then(r => r.json()),
      fetch(`${API_BASE}/by-action`).then(r => r.json()),
      fetch(`${API_BASE}/by-user`).then(r => r.json()),
    ]);
    renderTopTables(topTables);
    renderOverTime(overTime);
    renderByAction(byAction);
    renderByUser(byUser);
  } catch (err) {
    showError('Failed to load insights. Make sure the backend is running.');
    console.error(err);
  } finally {
    showLoading(false);
  }
}

function renderTopTables(data) {
  if (!data.length) return;

  // Stat card
  const top = data[0];
  document.getElementById('topTableName').textContent = top.table_name;
  document.getElementById('topTableCount').textContent = `${top.change_count.toLocaleString()} changes`;

  // Bar chart
  new Chart(document.getElementById('topTablesChart'), {
    type: 'bar',
    data: {
      labels: data.map(r => r.table_name),
      datasets: [{
        label: 'Changes',
        data: data.map(r => r.change_count),
        backgroundColor: '#4a6cf7',
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } },
    },
  });
}

function renderOverTime(data) {
  if (!data.length) return;

  new Chart(document.getElementById('overTimeChart'), {
    type: 'line',
    data: {
      labels: data.map(r => r.date),
      datasets: [{
        label: 'Changes',
        data: data.map(r => r.change_count),
        borderColor: '#4a6cf7',
        backgroundColor: 'rgba(74, 108, 247, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

function renderByAction(data) {
  if (!data.length) return;

  new Chart(document.getElementById('byActionChart'), {
    type: 'doughnut',
    data: {
      labels: data.map(r => r.action),
      datasets: [{
        data: data.map(r => r.count),
        backgroundColor: data.map(r => ACTION_COLORS[r.action] || '#aaa'),
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  });
}

function renderByUser(data) {
  if (!data.length) return;

  new Chart(document.getElementById('byUserChart'), {
    type: 'bar',
    data: {
      labels: data.map(r => r.changed_by),
      datasets: [{
        label: 'Changes',
        data: data.map(r => r.change_count),
        backgroundColor: '#6c63ff',
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } },
    },
  });
}

fetchAll();
