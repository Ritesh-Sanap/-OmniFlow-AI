/* ===== app.js — OmniFlow AI Application Logic v2 ===== */

// If deployed together, use the current origin. If local, fallback to localhost.
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://127.0.0.1:8000' 
  : window.location.origin;

// ===== MOCK DATA =====
const ACTIVITIES = [
  { title: 'Inventory Checked',        sub: 'Inventory Agent verified 1,247 items across 3 warehouses',                   time: '2 min ago',  color: 'blue'   },
  { title: 'Invoice Generated',        sub: 'Finance Agent created invoice #INV-2024-0847 for $12,450',                   time: '8 min ago',  color: 'green'  },
  { title: 'Customer Email Prepared',  sub: 'Support Agent drafted response to ticket #CS-3291',                          time: '15 min ago', color: 'purple' },
  { title: 'Marketing Campaign',       sub: 'Marketing Agent launched Q3 email sequence targeting 8.2K leads',            time: '32 min ago', color: 'amber'  },
  { title: 'Revenue Report Compiled',  sub: 'Finance Agent aggregated $48.2K monthly revenue data',                       time: '1 hr ago',   color: 'green'  },
  { title: 'New Lead Qualified',       sub: 'Sales Agent scored lead from Acme Corp at 92% conversion probability',       time: '1.5 hr ago', color: 'blue'   },
  { title: 'Supplier Order Placed',    sub: 'Inventory Agent ordered 500 units from GlobalTech Supply',                   time: '2 hr ago',   color: 'purple' },
  { title: 'Weekly Analytics',         sub: 'CEO Agent compiled executive summary with KPI dashboard',                    time: '3 hr ago',   color: 'amber'  },
];

const AGENTS = [
  { name: 'CEO Agent',             emoji: '👔', status: 'Analyzing quarterly reports',   health: 'healthy', progress: 88, lastActivity: '2 min ago'  },
  { name: 'Inventory Agent',       emoji: '📦', status: 'Monitoring stock levels',       health: 'healthy', progress: 95, lastActivity: '5 min ago'  },
  { name: 'Finance Agent',         emoji: '💰', status: 'Processing invoices',           health: 'healthy', progress: 72, lastActivity: '8 min ago'  },
  { name: 'Marketing Agent',       emoji: '📢', status: 'Running A/B tests',             health: 'warning', progress: 61, lastActivity: '15 min ago' },
  { name: 'Customer Support Agent',emoji: '🎧', status: 'Handling 3 active tickets',    health: 'healthy', progress: 84, lastActivity: '1 min ago'  },
];

const WORKFLOW_STEPS = [
  { label: 'CEO Agent', emoji: '👔', state: 'completed' },
  { label: 'Inventory', emoji: '📦', state: 'completed' },
  { label: 'Finance',   emoji: '💰', state: 'completed' },
  { label: 'Marketing', emoji: '📢', state: 'active'    },
  { label: 'Support',   emoji: '🎧', state: 'pending'   },
  { label: 'Completed', emoji: '✅', state: 'pending'   },
];

let currentPage = 'dashboard';

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderTopbar();
  navigateTo('dashboard');
  initGlobalListeners();
});

// ===== NAVIGATION =====
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });

  if (page === 'dashboard') {
    renderDashboard();
    populateActivityList();
    populateAgentGrid();
    populateWorkflowTimeline();
    initCharts();
    animateCounters();
    initDashboardListeners();
  } else if (page === 'command-center') {
    renderCommandCenter();
    initCommandCenterListeners();
  } else if (page === 'workflows') {
    renderWorkflowsPage();
  } else if (page === 'agents') {
    renderAgentsPage();
  } else if (page === 'knowledge') {
    renderKnowledgeBasePage();
  } else if (page === 'analytics') {
    renderAnalyticsPage();
  } else if (page === 'settings') {
    renderSettingsPage();
  }
}

// (placeholder page removed — all pages now have real implementations)

// ===== GLOBAL LISTENERS =====
function initGlobalListeners() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  document.addEventListener('click', (e) => {
    if (e.target.closest('#mobileMenuBtn') || e.target.closest('.mobile-menu-btn')) {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    }
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  sidebar.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    const page = item.dataset.page;
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    navigateTo(page);
  });
}

// ===== DASHBOARD LISTENERS =====
function initDashboardListeners() {
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  const startBtn = document.getElementById('startWorkflowBtn');
  if (startBtn) startBtn.addEventListener('click', () => navigateTo('command-center'));
}

// ===== COMMAND CENTER LISTENERS =====
function initCommandCenterListeners() {
  const input   = document.getElementById('ccInput');
  const sendBtn = document.getElementById('ccSendBtn');
  if (!input || !sendBtn) return;

  const handleSend = () => {
    const text = input.value.trim();
    if (!text || workflowEngine.isRunning) return;
    input.value = '';
    executeCommand(text);
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
  // Remove existing toast
  const existing = document.getElementById('omniToast');
  if (existing) existing.remove();

  const colors = {
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: '❌' },
    success: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', icon: '✅' },
    info:    { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', icon: 'ℹ️' },
    warning: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', icon: '⚠️' },
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.id = 'omniToast';
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:${c.bg}; border:1px solid ${c.border};
    backdrop-filter:blur(16px); border-radius:12px;
    padding:14px 20px; display:flex; align-items:center; gap:10px;
    font-family:Inter,sans-serif; font-size:0.84rem; color:#e2e8f0;
    max-width:360px; box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation:fadeInUp 0.3s ease forwards;
  `;
  toast.innerHTML = `<span style="font-size:1rem">${c.icon}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4500);
}

// ===== PLANNING PANEL (shown in chat before execution starts) =====
function renderPlanningPanel(wf, command) {
  const msgs = document.getElementById('ccMessages');
  if (!msgs) return;

  const agentList = (wf.agents || []).map((k, i) => {
    const a = AGENT_DB[k] || { name: k, emoji: '🤖' };
    return `<div class="plan-agent-row">
      <span class="plan-agent-num">${i + 1}</span>
      <span class="plan-agent-emoji">${a.emoji}</span>
      <span class="plan-agent-name">${a.name}</span>
    </div>`;
  }).join('');

  const estTime = ((wf.agents || []).length * 8 + 10) + ' seconds';
  const confidence = Math.floor(88 + Math.random() * 10) + '%';

  const el = document.createElement('div');
  el.className = 'cc-planning-panel';
  el.id = 'ccPlanningPanel';
  el.innerHTML = `
    <div class="cpp-header">
      <span class="cpp-icon">🧠</span>
      <div>
        <p class="cpp-label">CEO Agent — Execution Plan</p>
        <p class="cpp-reasoning">${escapeHtml(wf.ceoReasoning || '')}</p>
      </div>
    </div>
    <div class="cpp-grid">
      <div class="cpp-field">
        <p class="cpp-field-label">User Request</p>
        <p class="cpp-field-value">${escapeHtml(command)}</p>
      </div>
      <div class="cpp-field">
        <p class="cpp-field-label">Business Goal</p>
        <p class="cpp-field-value">${escapeHtml(wf.name || 'Workflow')}</p>
      </div>
      <div class="cpp-field">
        <p class="cpp-field-label">Est. Completion</p>
        <p class="cpp-field-value">${estTime}</p>
      </div>
      <div class="cpp-field">
        <p class="cpp-field-label">Confidence</p>
        <p class="cpp-field-value cpp-confidence">${confidence}</p>
      </div>
    </div>
    <div class="cpp-field" style="margin-top:10px">
      <p class="cpp-field-label">Execution Order</p>
      <div class="cpp-agents">${agentList}</div>
    </div>
  `;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}

// ===== CORE: EXECUTE A COMMAND =====
let _wfStartTime = 0;
async function executeCommand(command) {
  _wfStartTime = Date.now();
  const sendBtn     = document.getElementById('ccSendBtn');
  const statusBadge = document.getElementById('ccStatus');
  const logsList    = document.getElementById('ccLogsList');
  const execSteps   = document.getElementById('ccExecSteps');

  // Guard
  if (!sendBtn) return;
  sendBtn.disabled = true;
  if (statusBadge) { statusBadge.textContent = 'Thinking...'; statusBadge.className = 'panel-badge thinking'; }

  // 1. Show user message
  addChatMessage('user', 'You', escapeHtml(command));

  // 2. Show CEO thinking animation in chat
  showThinkingBubble('CEO Agent is thinking...');

  // 3. Call /plan ONCE
  let wf = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/plan`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ command }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Server error');
      throw new Error(`Backend returned ${res.status}: ${errText}`);
    }

    wf = await res.json();
    if (!wf || !Array.isArray(wf.agents)) throw new Error('Invalid plan structure returned from backend.');

  } catch (err) {
    console.error('Plan fetch error:', err);
    removeThinkingBubble();
    addChatMessage('ai', 'CEO Agent', '⚠️ I encountered an error connecting to the AI backend. Please check if the API is running or if the API key is configured correctly.', '👔');
    showToast('Backend connection failed.', 'error');
    sendBtn.disabled = false;
    if (statusBadge) { statusBadge.textContent = 'Error'; statusBadge.className = 'panel-badge error'; }
    return;
  }

  // 4. Build execution monitor (with the agents we now know)
  if (execSteps) execSteps.innerHTML = buildExecSteps(wf.agents || []);
  if (logsList)  logsList.innerHTML  = '';
  attachExecStepListeners();

  // 5. Wire engine callbacks
  const stateLabels = { waiting: 'Waiting', thinking: 'Thinking...', running: 'Running...', completed: 'Completed ✓' };

  workflowEngine.onCeoThinking = (stepText) => {
    showThinkingBubble(`CEO Agent: ${stepText}`);
    if (logsList) {
      const time  = _logTime();
      const entry = document.createElement('div');
      entry.className = 'cc-log-entry agent-ceo';
      entry.innerHTML = `<span class="cc-log-time">${time}</span>CEO Agent: ${escapeHtml(stepText)}`;
      logsList.appendChild(entry);
      logsList.scrollTop = logsList.scrollHeight;
    }
  };

  workflowEngine.onAgentState = (agentKey, state) => {
    const step = document.getElementById(`execStep_${agentKey}`);
    if (step) {
      step.dataset.state = state;
      const statusEl = step.querySelector('.exec-status');
      if (statusEl) statusEl.textContent = stateLabels[state] || state;
    }
    if (state === 'completed') {
      const conn = document.getElementById(`execConn_${agentKey}`);
      if (conn) { conn.classList.remove('active'); conn.classList.add('done'); }
    }
    if (state === 'running') {
      const conn = document.getElementById(`execConn_${agentKey}`);
      if (conn) conn.classList.add('active');
    }
    if (agentKey === 'ceo' && state === 'completed') {
      removeThinkingBubble();
      const agentNames = (wf.agents || []).map(k => (AGENT_DB[k] || { name: k }).name).join(', ');
      addChatMessage('ai', 'CEO Agent',
        `Execution plan ready for <strong>"${escapeHtml(wf.name || 'Workflow')}"</strong>.<br>
         <span style="color:var(--text-muted);font-size:0.8rem">${escapeHtml(wf.ceoReasoning || '')}</span><br><br>
         Activating agents: <strong>${agentNames}</strong>`,
        '👔');
      if (statusBadge) { statusBadge.textContent = 'Executing'; statusBadge.className = 'panel-badge'; }
    }
  };

  workflowEngine.onPlanReady = (planWf) => {
    renderPlanningPanel(planWf, command);
  };

  workflowEngine.onLog = (logText, agentKey) => {
    if (!logsList) return;
    const entry = document.createElement('div');
    entry.className = `cc-log-entry agent-${agentKey}`;
    entry.innerHTML = `<span class="cc-log-time">${_logTime()}</span>${escapeHtml(logText)}`;
    logsList.appendChild(entry);
    logsList.scrollTop = logsList.scrollHeight;
  };

  workflowEngine.onSummary = (wf) => {
    const durationSec = Math.round((Date.now() - _wfStartTime) / 1000);
    renderExecutiveSummary(wf, durationSec);
  };

  workflowEngine.onError = (msg) => {
    removeThinkingBubble();
    showToast(msg, 'error');
    sendBtn.disabled = false;
    if (statusBadge) { statusBadge.textContent = 'Error'; statusBadge.className = 'panel-badge error'; }
  };

  workflowEngine.onComplete = () => {
    sendBtn.disabled = false;
    if (statusBadge) { statusBadge.textContent = 'Ready'; statusBadge.className = 'panel-badge success'; }
    const settings = WorkflowStore.getSettings();
    if (settings.notifComplete !== false) showToast('Workflow completed successfully!', 'success');
    // Save to workflow history
    if (settings.autoSave !== false) {
      WorkflowStore.add({ ...wf, startedAt: new Date(_wfStartTime).toISOString(), duration: Math.round((Date.now()-_wfStartTime)/1000) });
    }
    attachExecStepListeners();
  };

  // 6. Hand the fetched wf directly to the engine — NO second API call
  await workflowEngine.run(wf);
}

// ===== EXEC STEP CLICK LISTENERS =====
function attachExecStepListeners() {
  document.querySelectorAll('.cc-exec-step').forEach(step => {
    // Clone to remove old listeners
    const clone = step.cloneNode(true);
    step.parentNode.replaceChild(clone, step);
    clone.addEventListener('click', () => {
      const agentKey = clone.dataset.agent;
      const detail   = workflowEngine.getAgentDetail(agentKey);
      if (detail) renderAgentDetailPanel(detail);
    });
  });
}

// ===== HELPERS =====
function _logTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== DASHBOARD: POPULATE SECTIONS =====
function populateActivityList() {
  const list = document.getElementById('activityList');
  if (!list) return;
  list.innerHTML = ACTIVITIES.map(a => `
    <li class="activity-item">
      <span class="activity-dot ${a.color}"></span>
      <div class="activity-info">
        <p class="activity-title">${a.title}</p>
        <p class="activity-sub">${a.sub}</p>
      </div>
      <span class="activity-time">${a.time}</span>
    </li>
  `).join('');
}

function populateAgentGrid() {
  const grid = document.getElementById('agentGrid');
  if (!grid) return;
  grid.innerHTML = AGENTS.map(a => `
    <div class="agent-card">
      <div class="agent-avatar">${a.emoji}</div>
      <div class="agent-details">
        <p class="agent-name">${a.name}</p>
        <p class="agent-status-text">${a.status} · ${a.lastActivity}</p>
      </div>
      <div class="agent-meta">
        <span class="agent-health ${a.health}"></span>
        <div class="agent-progress-wrap">
          <div class="agent-progress" style="width:${a.progress}%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function populateWorkflowTimeline() {
  const tl = document.getElementById('workflowTimeline');
  if (!tl) return;
  tl.innerHTML = WORKFLOW_STEPS.map((step, i) => {
    const node = `<div class="wf-step ${step.state}"><div class="wf-node">${step.emoji}</div><span class="wf-label">${step.label}</span></div>`;
    if (i < WORKFLOW_STEPS.length - 1) {
      const connState = step.state === 'completed' ? 'done' : step.state === 'active' ? 'active' : '';
      return node + `<div class="wf-connector ${connState}"></div>`;
    }
    return node;
  }).join('');
}

// ===== CHARTS =====
function initCharts() {
  const def = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#55556a', font: { size: 10, family: 'Inter' } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#55556a', font: { size: 10, family: 'Inter' } } }
    }
  };

  const revCtx = document.getElementById('revenueChart');
  if (revCtx) {
    const g = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, 'rgba(99,102,241,0.3)');
    g.addColorStop(1, 'rgba(99,102,241,0)');
    new Chart(revCtx, {
      type: 'line',
      data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ data: [32,38,35,42,48,45,52], borderColor:'#6366f1', backgroundColor:g, borderWidth:2, fill:true, tension:0.4, pointRadius:0, pointHoverRadius:5 }] },
      options: { ...def, scales: { ...def.scales, y: { ...def.scales.y, ticks: { ...def.scales.y.ticks, callback: v => '$'+v+'K' } } } }
    });
  }

  const ordCtx = document.getElementById('ordersChart');
  if (ordCtx) {
    new Chart(ordCtx, {
      type: 'bar',
      data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ data: [120,145,132,168,189,142,175], backgroundColor:'rgba(139,92,246,0.6)', borderRadius:6, borderSkipped:false, barThickness:18 }] },
      options: def
    });
  }

  const invCtx = document.getElementById('inventoryChart');
  if (invCtx) {
    const g2 = invCtx.getContext('2d').createLinearGradient(0, 0, 0, 200);
    g2.addColorStop(0, 'rgba(52,211,153,0.25)');
    g2.addColorStop(1, 'rgba(52,211,153,0)');
    new Chart(invCtx, {
      type: 'line',
      data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ data: [1200,1180,1150,1220,1190,1250,1280], borderColor:'#34d399', backgroundColor:g2, borderWidth:2, fill:true, tension:0.4, pointRadius:0, pointHoverRadius:5 }] },
      options: def
    });
  }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  [
    { id: 'statWorkflows', target: 24 },
    { id: 'statAgents',    target: 5  },
    { id: 'statRevenue',   target: 48.2, prefix: '$', suffix: 'K' },
    { id: 'statTasks',     target: 156 },
  ].forEach(c => {
    const el = document.getElementById(c.id);
    if (!el) return;
    let cur = 0;
    const step    = c.target / 40;
    const isFloat = c.target % 1 !== 0;
    const timer   = setInterval(() => {
      cur += step;
      if (cur >= c.target) { cur = c.target; clearInterval(timer); }
      el.textContent = (c.prefix||'') + (isFloat ? cur.toFixed(1) : Math.round(cur)) + (c.suffix||'');
    }, 30);
  });
}
