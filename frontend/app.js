const API_BASE = 'http://localhost:3000/api/audit-trail';

// State
let currentPage = 1;
let totalPages = 1;
const limit = 50;
let expandedRows = new Set();

// DOM Elements
const tableNameSelect = document.getElementById('tableName');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const filterBtn = document.getElementById('filterBtn');
const clearBtn = document.getElementById('clearBtn');
const auditTableBody = document.getElementById('auditTableBody');
const resultCount = document.getElementById('resultCount');
const pageInfo = document.getElementById('pageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loading = document.getElementById('loading');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadTableNames();
  loadAuditTrail();
  setupEventListeners();
});

function setupEventListeners() {
  filterBtn.addEventListener('click', () => {
    currentPage = 1;
    expandedRows.clear();
    loadAuditTrail();
  });

  clearBtn.addEventListener('click', () => {
    tableNameSelect.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    currentPage = 1;
    expandedRows.clear();
    loadAuditTrail();
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadAuditTrail();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadAuditTrail();
    }
  });
}

async function loadTableNames() {
  try {
    const response = await fetch(`${API_BASE}/tables`);
    const tableNames = await response.json();

    tableNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      tableNameSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load table names:', error);
  }
}

async function loadAuditTrail() {
  showLoading(true);

  try {
    const params = new URLSearchParams();

    if (tableNameSelect.value) {
      params.append('tableName', tableNameSelect.value);
    }
    if (startDateInput.value) {
      params.append('startDate', startDateInput.value);
    }
    if (endDateInput.value) {
      params.append('endDate', endDateInput.value);
    }
    params.append('page', currentPage.toString());
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE}?${params}`);
    const result = await response.json();

    renderTable(result.data);
    updatePagination(result.total, result.page, result.totalPages);
  } catch (error) {
    console.error('Failed to load audit trail:', error);
    auditTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <p>Failed to load data. Please check if the server is running.</p>
        </td>
      </tr>
    `;
  } finally {
    showLoading(false);
  }
}

function renderTable(data) {
  if (!data || data.length === 0) {
    auditTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <p>No audit records found</p>
        </td>
      </tr>
    `;
    return;
  }

  auditTableBody.innerHTML = '';

  data.forEach(record => {
    const isExpanded = expandedRows.has(record.id);

    // Main row
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <button class="expand-btn" data-id="${record.id}">
          ${isExpanded ? '▼' : '▶'}
        </button>
      </td>
      <td>${record.id}</td>
      <td>${escapeHtml(record.table_name)}</td>
      <td>${record.record_id}</td>
      <td><span class="action-badge action-${record.action.toLowerCase()}">${record.action}</span></td>
      <td>${escapeHtml(record.changed_by)}</td>
      <td>${formatDate(record.changed_at)}</td>
    `;
    auditTableBody.appendChild(row);

    // Expanded content row
    if (isExpanded) {
      const expandedRow = createExpandedRow(record);
      auditTableBody.appendChild(expandedRow);
    }

    // Toggle expand on click
    row.querySelector('.expand-btn').addEventListener('click', () => {
      toggleExpand(record.id, record);
    });
  });
}

function createExpandedRow(record) {
  const expandedRow = document.createElement('tr');
  expandedRow.className = 'expanded-row';

  const beforeState = formatJson(record.before_state);
  const afterState = formatJson(record.after_state);
  const diff = formatJson(record.diff);

  expandedRow.innerHTML = `
    <td colspan="7">
      <div class="expanded-content">
        <div class="state-container">
          <div class="state-box">
            <h4>Before State</h4>
            <pre>${beforeState || '<em>N/A</em>'}</pre>
          </div>
          <div class="state-box">
            <h4>After State</h4>
            <pre>${afterState || '<em>N/A</em>'}</pre>
          </div>
          ${diff ? `
          <div class="state-box">
            <h4>Changes (Diff)</h4>
            <pre>${diff}</pre>
          </div>
          ` : ''}
        </div>
      </div>
    </td>
  `;

  return expandedRow;
}

function toggleExpand(id, record) {
  if (expandedRows.has(id)) {
    expandedRows.delete(id);
  } else {
    expandedRows.add(id);
  }

  // Re-render to update expanded state
  loadAuditTrail();
}

function updatePagination(total, page, pages) {
  totalPages = pages;
  currentPage = page;

  resultCount.textContent = `${total} record${total !== 1 ? 's' : ''} found`;
  pageInfo.textContent = `Page ${page} of ${pages || 1}`;

  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= pages;
}

function showLoading(show) {
  loading.classList.toggle('hidden', !show);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function formatJson(jsonStr) {
  if (!jsonStr) return null;

  try {
    const obj = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    return escapeHtml(JSON.stringify(obj, null, 2));
  } catch {
    return escapeHtml(jsonStr);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
