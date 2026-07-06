/* pages-workflows.js — Workflows + AI Agents pages */

/* ─── WORKFLOWS PAGE ─── */
function renderWorkflowsPage() {
  const history = WorkflowStore.getAll();
  const stats = WorkflowStore.getStats();
  const successRate = history.length ? Math.round((history.filter(w=>w.status==='completed').length/history.length)*100) : 0;

  document.getElementById('content').innerHTML = `
<div class="pg-workflows animate-in">
  <div class="pg-header">
    <div><h1 class="pg-title">Workflow Management</h1><p class="pg-sub">Orchestrate, monitor, and rerun AI workflows</p></div>
    <button class="btn-primary" onclick="navigateTo('command-center')" id="newWfBtn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> New Workflow
    </button>
  </div>

  <div class="stats-grid" style="margin-bottom:20px">
    <div class="stat-card"><div class="stat-icon stat-icon-blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><div class="stat-info"><p class="stat-label">Total Workflows</p><p class="stat-value">${stats.total}</p><p class="stat-change positive">+3 this week</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div><div class="stat-info"><p class="stat-label">Completed</p><p class="stat-value">${stats.completed}</p><p class="stat-change positive">100% this week</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-purple"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="stat-info"><p class="stat-label">Revenue Generated</p><p class="stat-value">$${(stats.totalRevenue/1000).toFixed(0)}K</p><p class="stat-change positive">+24% MoM</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="stat-info"><p class="stat-label">Success Rate</p><p class="stat-value">${successRate}%</p><p class="stat-change positive">+2% vs last month</p></div></div>
  </div>

  <div class="wf-tabs" id="wfTabs">
    <button class="wf-tab active" data-tab="history">History <span class="tab-count">${history.length}</span></button>
    <button class="wf-tab" data-tab="templates">Templates <span class="tab-count">${WF_TEMPLATES.length}</span></button>
  </div>

  <div id="wfTabContent"></div>
</div>`;

  renderWfTab('history');
  initWorkflowsListeners();
}

function renderWfTab(tab) {
  const el = document.getElementById('wfTabContent');
  if (!el) return;
  if (tab === 'history') {
    const wfs = WorkflowStore.getAll();
    el.innerHTML = `
      <div class="wf-search-row">
        <div class="wf-search-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="wf-search" id="wfSearch" placeholder="Search workflows..." /></div>
        <div class="wf-filter-row">
          <button class="wf-filter-btn active" data-filter="all">All</button>
          <button class="wf-filter-btn" data-filter="completed">Completed</button>
        </div>
      </div>
      <div class="wf-cards-grid" id="wfCardsGrid">${wfs.map(wfCard).join('')}</div>`;
    initWfSearch();
  } else {
    el.innerHTML = `<div class="wf-cards-grid">${WF_TEMPLATES.map(tplCard).join('')}</div>`;
    el.querySelectorAll('.tpl-run-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateTo('command-center');
        setTimeout(() => {
          const input = document.getElementById('ccInput');
          if (input) { input.value = btn.dataset.cmd; input.focus(); }
        }, 300);
      });
    });
  }
}

function wfCard(w) {
  const agentEmojis = (w.agents||[]).slice(0,4).map(a=>`<span class="wf-agent-pill">${(AGENT_DB[a]||{emoji:'🤖'}).emoji}</span>`).join('');
  const ts = new Date(w.completedAt||w.startedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  return `<div class="wf-card" data-wf-id="${w.id}" data-wf-name="${(w.name||'').toLowerCase()}">
    <div class="wf-card-head">
      <span class="wf-status-dot ${w.status}"></span>
      <span class="wf-card-name">${w.name}</span>
    </div>
    <div class="wf-card-agents">${agentEmojis} <span class="wf-agent-count">${w.agents?.length||0} agents</span></div>
    <div class="wf-card-meta">
      <span class="wf-meta-item">⏱ ${w.duration||0}s</span>
      <span class="wf-meta-item">💰 ${w.revenue||'$0'}</span>
      <span class="wf-meta-item">📅 ${ts}</span>
    </div>
    <div class="wf-card-actions">
      <button class="wf-action-btn primary" onclick="rerunWorkflow('${w.name}')">▶ Rerun</button>
      <button class="wf-action-btn" onclick="showWfDetail('${w.id}')">Details</button>
    </div>
  </div>`;
}

function tplCard(t) {
  const agentEmojis = t.agents.map(a=>`<span class="wf-agent-pill">${(AGENT_DB[a]||{emoji:'🤖'}).emoji}</span>`).join('');
  const catColor = CAT_COLORS[t.category]||'#6366f1';
  return `<div class="wf-card">
    <div class="wf-card-head">
      <span style="font-size:1.2rem">${t.emoji}</span>
      <span class="wf-card-name">${t.name}</span>
      <span class="wf-cat-badge" style="background:${catColor}22;color:${catColor}">${t.category}</span>
    </div>
    <p class="wf-desc">${t.desc}</p>
    <div class="wf-card-agents">${agentEmojis}</div>
    <div class="wf-card-meta"><span class="wf-meta-item">🔄 Used ${t.uses} times</span></div>
    <div class="wf-card-actions">
      <button class="wf-action-btn primary tpl-run-btn" data-cmd="${t.name}">▶ Run Template</button>
    </div>
  </div>`;
}

function initWfSearch() {
  const input = document.getElementById('wfSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.wf-card[data-wf-name]').forEach(c => {
      c.style.display = (c.dataset.wfName||'').includes(q) ? '' : 'none';
    });
  });
}

function initWorkflowsListeners() {
  document.querySelectorAll('.wf-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.wf-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderWfTab(btn.dataset.tab);
    });
  });
}

function rerunWorkflow(name) {
  navigateTo('command-center');
  setTimeout(() => {
    const input = document.getElementById('ccInput');
    if (input) { input.value = name; input.focus(); }
  }, 300);
}

function showWfDetail(id) {
  const wf = WorkflowStore.getAll().find(w=>w.id===id);
  if (!wf) return;
  const panel = document.getElementById('agentDetailPanel');
  const overlay = document.getElementById('agentDetailOverlay');
  if (!panel||!overlay) return;
  const items = (wf.summary?.items||[]).map(i=>`<li style="padding:5px 0;font-size:0.82rem;color:var(--text-secondary);display:flex;gap:8px;align-items:flex-start"><span style="color:var(--accent-green);font-weight:700">✓</span>${i}</li>`).join('');
  panel.innerHTML = `
    <div class="adp-header"><div class="adp-agent-info"><span class="adp-emoji">📋</span><span class="adp-name">${wf.name}</span></div><button class="adp-close" id="adpCloseBtn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
    <div class="adp-body">
      <div class="adp-field"><p class="adp-field-label">Status</p><span class="adp-status-badge">Completed</span></div>
      <div class="adp-field"><p class="adp-field-label">CEO Reasoning</p><div class="adp-field-value">${wf.ceoReasoning||'—'}</div></div>
      <div class="adp-field"><p class="adp-field-label">Agents Used</p><div class="adp-field-value">${(wf.agents||[]).map(a=>(AGENT_DB[a]||{name:a,emoji:'🤖'}).emoji+' '+(AGENT_DB[a]||{name:a}).name).join('\n')}</div></div>
      <div class="adp-field"><p class="adp-field-label">Key Outcomes</p><ul style="list-style:none">${items}</ul></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="adp-field"><p class="adp-field-label">Revenue</p><div class="adp-field-value" style="color:var(--accent-green);font-weight:700">${wf.revenue}</div></div>
        <div class="adp-field"><p class="adp-field-label">Profit</p><div class="adp-field-value" style="color:var(--accent-green);font-weight:700">${wf.profit}</div></div>
      </div>
      <div class="adp-field"><p class="adp-field-label">Execution Time</p><div class="adp-field-value">${wf.duration||0}s</div></div>
      <div class="adp-field"><p class="adp-field-label">Next Action</p><div class="adp-field-value">${wf.summary?.nextAction||'—'}</div></div>
      <button class="btn-primary" style="width:100%;margin-top:8px" onclick="rerunWorkflow('${wf.name}')">▶ Rerun This Workflow</button>
    </div>`;
  panel.classList.add('open'); overlay.classList.add('open');
  document.getElementById('adpCloseBtn').addEventListener('click', closeAgentDetail);
  overlay.addEventListener('click', closeAgentDetail);
}

/* ─── AI AGENTS PAGE ─── */
function renderAgentsPage() {
  const agents = Object.values(AGENT_PROFILES);
  const online = agents.filter(a=>a.status!=='offline').length;
  document.getElementById('content').innerHTML = `
<div class="pg-agents animate-in">
  <div class="pg-header">
    <div><h1 class="pg-title">AI Agent Management</h1><p class="pg-sub">Monitor, inspect, and manage your AI agent fleet</p></div>
    <div class="pg-header-badges">
      <span class="agent-fleet-badge online">${online} Online</span>
      <span class="agent-fleet-badge running">${agents.filter(a=>a.status==='running').length} Running</span>
    </div>
  </div>
  <div class="agents-grid">${agents.map(agentCard).join('')}</div>
</div>`;
  initAgentsListeners();
}

function agentCard(a) {
  const statusLabel = {online:'Online',running:'Running',offline:'Offline'}[a.status]||a.status;
  const bar = `<div class="ag-perf-bar"><div class="ag-perf-fill" style="width:${a.performance}%;background:${a.color}"></div></div>`;
  return `<div class="agent-profile-card" data-agent-key="${a.key}">
    <div class="apc-header" style="border-top:3px solid ${a.color}">
      <div class="apc-avatar" style="background:${a.color}22;border-color:${a.color}44">${a.emoji}</div>
      <div class="apc-info">
        <p class="apc-name">${a.name}</p>
        <p class="apc-role">${a.role}</p>
      </div>
      <span class="apc-status ${a.status}">${statusLabel}</span>
    </div>
    <div class="apc-task"><span class="apc-task-label">Current Task</span><p class="apc-task-text">${a.currentTask}</p></div>
    <div class="apc-metrics">
      <div class="apc-metric"><p class="apc-metric-val">${a.performance}%</p><p class="apc-metric-label">Performance</p>${bar}</div>
      <div class="apc-metric"><p class="apc-metric-val">${a.totalTasks}</p><p class="apc-metric-label">Tasks Done</p></div>
      <div class="apc-metric"><p class="apc-metric-val">${a.successRate}%</p><p class="apc-metric-label">Success Rate</p></div>
      <div class="apc-metric"><p class="apc-metric-val">${a.avgTime}</p><p class="apc-metric-label">Avg Time</p></div>
    </div>
    <div class="apc-history">
      ${a.history.map(h=>`<div class="apc-hist-row"><span class="apc-hist-dot ${h.ok?'ok':'fail'}"></span><span class="apc-hist-name">${h.wf}</span><span class="apc-hist-meta">${h.dur} · ${h.time}</span></div>`).join('')}
    </div>
    <button class="wf-action-btn primary" style="width:100%;margin-top:12px" onclick="showAgentProfilePanel('${a.key}')">View Full Details</button>
  </div>`;
}

function showAgentProfilePanel(key) {
  const a = AGENT_PROFILES[key];
  if (!a) return;
  const panel = document.getElementById('agentDetailPanel');
  const overlay = document.getElementById('agentDetailOverlay');
  if (!panel||!overlay) return;
  const histRows = a.history.map(h=>`<div class="apc-hist-row"><span class="apc-hist-dot ${h.ok?'ok':'fail'}"></span><span class="apc-hist-name">${h.wf}</span><span class="apc-hist-meta">${h.dur} · ${h.time}</span></div>`).join('');
  panel.innerHTML = `
    <div class="adp-header" style="border-top:3px solid ${a.color}">
      <div class="adp-agent-info"><span class="adp-emoji">${a.emoji}</span><div><span class="adp-name">${a.name}</span><p style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">${a.role}</p></div></div>
      <button class="adp-close" id="adpCloseBtn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div class="adp-body">
      <div class="adp-field"><p class="adp-field-label">Status</p><span class="adp-status-badge">${a.status==='running'?'Running':'Online'}</span></div>
      <div class="adp-field"><p class="adp-field-label">Description</p><div class="adp-field-value">${a.description}</div></div>
      <div class="adp-field"><p class="adp-field-label">Current Task</p><div class="adp-field-value">${a.currentTask}</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="adp-field"><p class="adp-field-label">Performance</p><div class="adp-field-value" style="color:${a.color};font-weight:700">${a.performance}%</div></div>
        <div class="adp-field"><p class="adp-field-label">Success Rate</p><div class="adp-field-value" style="color:var(--accent-green);font-weight:700">${a.successRate}%</div></div>
        <div class="adp-field"><p class="adp-field-label">Total Tasks</p><div class="adp-field-value">${a.totalTasks}</div></div>
        <div class="adp-field"><p class="adp-field-label">Avg Exec Time</p><div class="adp-field-value">${a.avgTime}</div></div>
      </div>
      <div class="adp-field"><p class="adp-field-label">Recent Executions</p>${histRows}</div>
    </div>`;
  panel.classList.add('open'); overlay.classList.add('open');
  document.getElementById('adpCloseBtn').addEventListener('click', closeAgentDetail);
  overlay.addEventListener('click', closeAgentDetail);
}

function initAgentsListeners() {}
