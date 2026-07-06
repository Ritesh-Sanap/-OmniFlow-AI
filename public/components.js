/* ===== components.js — HTML templates for OmniFlow AI ===== */

function renderSidebar() {
  const navItems = [
    { id: 'dashboard', icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', label: 'Dashboard' },
    { id: 'command-center', icon: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>', label: 'AI Command Center' },
    { id: 'workflows', icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>', label: 'Workflows' },
    { id: 'agents', icon: '<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>', label: 'AI Agents' },
    { id: 'knowledge', icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', label: 'Knowledge Base' },
    { id: 'analytics', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>', label: 'Analytics' },
    { id: 'settings', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>', label: 'Settings' }
  ];

  const navHTML = navItems.map(item => `
    <li class="nav-item${item.id === 'dashboard' ? ' active' : ''}" data-page="${item.id}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
      <span>${item.label}</span>
    </li>
  `).join('');

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <path d="M8 14L12 10L16 14L20 10" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 18L12 14L16 18L20 14" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
          </svg>
        </div>
        <span class="logo-text">OmniFlow AI</span>
      </div>
    </div>
    <nav class="sidebar-nav"><ul>${navHTML}</ul></nav>
    <div class="sidebar-footer">
      <div class="sidebar-upgrade">
        <div class="upgrade-glow"></div>
        <p class="upgrade-label">Enterprise Plan</p>
        <p class="upgrade-sub">Unlimited agents &amp; workflows</p>
        <div class="upgrade-bar-wrap"><div class="upgrade-bar" style="width:72%"></div></div>
        <p class="upgrade-usage">72% of resources used</p>
      </div>
    </div>
  `;
}

function renderTopbar() {
  document.getElementById('topbar').innerHTML = `
    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open menu">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <div class="topbar-search">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="globalSearch" placeholder="Search workflows, agents, commands..." />
      <kbd class="search-kbd">⌘K</kbd>
    </div>
    <div class="topbar-actions">
      <div class="topbar-status" id="systemStatus">
        <span class="status-dot online"></span>
        <span class="status-label">Online</span>
      </div>
      <button class="topbar-icon-btn" id="notificationsBtn" aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="notif-badge">3</span>
      </button>
      <div class="topbar-avatar" id="userProfile">
        <div class="avatar-img">R</div>
        <span class="avatar-name">Ritesh</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  `;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function renderDashboard() {
  document.getElementById('content').innerHTML = `
    <!-- HERO -->
    <section class="hero animate-in" id="heroSection">
      <div class="hero-bg-orb hero-orb-1"></div>
      <div class="hero-bg-orb hero-orb-2"></div>
      <div class="hero-content">
        <p class="hero-greeting">${getGreeting()}, Ritesh</p>
        <h1 class="hero-title">Enterprise AI Operating System</h1>
        <p class="hero-subtitle">Orchestrate intelligent workflows, manage autonomous agents, and drive business outcomes — all from one command center.</p>
        <button class="btn-primary hero-cta" id="startWorkflowBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Start New Workflow
        </button>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-grid animate-in delay-1" id="statsGrid">
      <div class="stat-card">
        <div class="stat-icon stat-icon-blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">Active Workflows</p>
          <p class="stat-value" id="statWorkflows">24</p>
          <p class="stat-change positive">+12% from last week</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">AI Agents Running</p>
          <p class="stat-value" id="statAgents">5</p>
          <p class="stat-change positive">+3 since yesterday</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-green">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">Revenue Impact</p>
          <p class="stat-value" id="statRevenue">$48.2K</p>
          <p class="stat-change positive">+24% MoM</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon stat-icon-amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">Tasks Completed Today</p>
          <p class="stat-value" id="statTasks">156</p>
          <p class="stat-change positive">+18% vs average</p>
        </div>
      </div>
    </section>

    <!-- MIDDLE ROW -->
    <section class="middle-row animate-in delay-2">
      <div class="panel activity-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Recent Activity
          </h2>
          <span class="panel-badge">Live</span>
        </div>
        <ul class="activity-list" id="activityList"></ul>
      </div>
      <div class="panel agent-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/></svg>
            Agent Status
          </h2>
          <button class="panel-action-btn" id="refreshAgentsBtn">Refresh</button>
        </div>
        <div class="agent-grid" id="agentGrid"></div>
      </div>
    </section>

    <!-- WORKFLOW OVERVIEW -->
    <section class="panel workflow-panel animate-in delay-3">
      <div class="panel-header">
        <h2 class="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Workflow Overview
        </h2>
        <span class="panel-badge success">Running</span>
      </div>
      <div class="workflow-timeline" id="workflowTimeline"></div>
    </section>

    <!-- ANALYTICS -->
    <section class="analytics-row animate-in delay-4">
      <div class="panel chart-panel">
        <div class="panel-header">
          <h2 class="panel-title">Revenue Trend</h2>
          <div class="chart-period-selector">
            <button class="period-btn active" data-period="7d">7D</button>
            <button class="period-btn" data-period="30d">30D</button>
            <button class="period-btn" data-period="90d">90D</button>
          </div>
        </div>
        <div class="chart-wrapper"><canvas id="revenueChart"></canvas></div>
      </div>
      <div class="panel chart-panel">
        <div class="panel-header"><h2 class="panel-title">Orders</h2></div>
        <div class="chart-wrapper"><canvas id="ordersChart"></canvas></div>
      </div>
      <div class="panel chart-panel">
        <div class="panel-header"><h2 class="panel-title">Inventory Level</h2></div>
        <div class="chart-wrapper"><canvas id="inventoryChart"></canvas></div>
      </div>
    </section>
  `;
}

function renderCommandCenter() {
  document.getElementById('content').innerHTML = `
    <div class="cc-page">
      <div class="cc-grid">
        <!-- Chat Area -->
        <div class="cc-chat panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              AI Command Center
            </h2>
            <span class="panel-badge" id="ccStatus">Ready</span>
          </div>
          <div class="cc-messages" id="ccMessages">
            <div class="cc-msg ai">
              <div class="cc-msg-avatar ai-av">👔</div>
              <div class="cc-msg-body">
                <p class="cc-msg-name">CEO Agent</p>
                <p class="cc-msg-text">Welcome to OmniFlow AI Command Center. I'm your CEO Agent — enter any business command and I'll orchestrate the right agents to execute it.</p>
                <p class="cc-msg-text" style="margin-top:8px;color:var(--text-muted);font-size:0.78rem">Try: "Launch a new perfume" · "Deliver 500 bottles to ABC Company" · "Generate monthly sales report" · "Create marketing campaign"</p>
              </div>
            </div>
          </div>
          <div class="cc-input-bar">
            <input type="text" class="cc-input" id="ccInput" placeholder="Enter a business command..." />
            <button class="cc-send-btn" id="ccSendBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="cc-right">
          <div class="cc-exec-monitor">
            <div class="cc-exec-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Execution Monitor
            </div>
            <div class="cc-exec-steps" id="ccExecSteps">
              <p style="color:var(--text-muted);font-size:0.78rem;text-align:center;padding:16px 0">Awaiting command...</p>
            </div>
          </div>
          <div class="cc-logs">
            <div class="cc-logs-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Live Logs
            </div>
            <div class="cc-logs-list" id="ccLogsList">
              <p class="cc-logs-empty">Logs will appear here during execution...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildExecSteps(agentKeys) {
  // Always starts with CEO, then the dynamic agents
  const validKeys = (agentKeys || []).filter(k => typeof k === 'string');
  const allAgents = ['ceo', ...validKeys];
  let html = '';
  allAgents.forEach((key, i) => {
    // Safe fallback if key not in AGENT_DB
    const a = AGENT_DB[key] || { name: key.charAt(0).toUpperCase() + key.slice(1) + ' Agent', emoji: '🤖' };
    html += `<div class="cc-exec-step" data-state="waiting" data-agent="${key}" id="execStep_${key}">
      <div class="exec-node">${a.emoji}</div>
      <div class="exec-label">
        <p class="exec-name">${a.name}</p>
        <p class="exec-status">Waiting</p>
      </div>
    </div>`;
    if (i < allAgents.length - 1) {
      html += `<div class="exec-connector" id="execConn_${key}"></div>`;
    }
  });
  return html;
}

function renderAgentDetailPanel(detail) {
  if (!detail) return;
  const panel = document.getElementById('agentDetailPanel');
  panel.innerHTML = `
    <div class="adp-header">
      <div class="adp-agent-info">
        <span class="adp-emoji">${detail.agent.emoji}</span>
        <span class="adp-name">${detail.agent.name}</span>
      </div>
      <button class="adp-close" id="adpCloseBtn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="adp-body">
      <div class="adp-field"><p class="adp-field-label">Status</p><span class="adp-status-badge">${detail.status}</span></div>
      <div class="adp-field"><p class="adp-field-label">Confidence</p><div class="adp-field-value" style="color:var(--accent-green)">${detail.confidence}</div></div>
      <div class="adp-field"><p class="adp-field-label">Execution Time</p><div class="adp-field-value">${detail.executionTime}</div></div>
      <div class="adp-field" style="grid-column: span 2;"><p class="adp-field-label">Current Task</p><div class="adp-field-value">${detail.task}</div></div>
      <div class="adp-field" style="grid-column: span 2;"><p class="adp-field-label">Reasoning</p><div class="adp-field-value">${detail.reasoning}</div></div>
      <div class="adp-field" style="grid-column: span 2;"><p class="adp-field-label">Input</p><div class="adp-field-value">${detail.input}</div></div>
      <div class="adp-field" style="grid-column: span 2;"><p class="adp-field-label">Output</p><div class="adp-field-value">${detail.output}</div></div>
      <div class="adp-field" style="grid-column: span 2;"><p class="adp-field-label">Prompt Sent</p><div class="adp-field-value" style="font-family:monospace; font-size:0.75rem;">${detail.promptSent}</div></div>
      <div class="adp-field" style="grid-column: span 2;"><p class="adp-field-label">LLM Response</p><div class="adp-field-value">${detail.llmResponse}</div></div>
      <div class="adp-field"><p class="adp-field-label">Tool Calls</p><div class="adp-field-value" style="font-family:monospace; font-size:0.75rem;">${detail.toolUsage.join('<br>')}</div></div>
      <div class="adp-field"><p class="adp-field-label">Memory Used</p><div class="adp-field-value">${detail.memory}</div></div>
      <div class="adp-field"><p class="adp-field-label">Dependencies</p><div class="adp-field-value">${detail.dependencies.join(', ')}</div></div>
      <div class="adp-field"><p class="adp-field-label">Previous Tasks</p><div class="adp-field-value">No prior dependent tasks for this node.</div></div>
      <div class="adp-field" style="grid-column: span 2;"><p class="adp-field-label">Logs</p>
        <div class="adp-field-value" style="font-family:monospace; font-size:0.75rem; background:var(--bg-tertiary); padding:8px; border-radius:4px;">
          ${detail.logs.map(l => '> ' + l).join('<br>')}
        </div>
      </div>
    </div>
  `;
  panel.classList.add('open');
  document.getElementById('agentDetailOverlay').classList.add('open');

  document.getElementById('adpCloseBtn').addEventListener('click', closeAgentDetail);
  document.getElementById('agentDetailOverlay').addEventListener('click', closeAgentDetail);
}

function closeAgentDetail() {
  document.getElementById('agentDetailPanel').classList.remove('open');
  document.getElementById('agentDetailOverlay').classList.remove('open');
}

function addChatMessage(type, name, text, avatar) {
  const msgs = document.getElementById('ccMessages');
  if (!msgs) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const avClass = type === 'user' ? 'user-av' : 'ai-av';
  const avContent = type === 'user' ? 'R' : (avatar || '🤖');
  const msg = document.createElement('div');
  msg.className = `cc-msg ${type}`;
  msg.innerHTML = `
    <div class="cc-msg-avatar ${avClass}">${avContent}</div>
    <div class="cc-msg-body">
      <p class="cc-msg-name">${name}</p>
      <p class="cc-msg-text">${text}</p>
      <p class="cc-msg-time">${time}</p>
    </div>
  `;
  msgs.appendChild(msg);
  msgs.scrollTop = msgs.scrollHeight;
}

function showThinkingBubble(text) {
  const msgs = document.getElementById('ccMessages');
  if (!msgs) return;
  let bubble = document.getElementById('ccThinkingBubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'ccThinkingBubble';
    bubble.className = 'cc-thinking';
    msgs.appendChild(bubble);
  }
  bubble.innerHTML = `
    <div class="cc-thinking-dots"><span></span><span></span><span></span></div>
    <span class="cc-thinking-text">${text}</span>
  `;
  msgs.scrollTop = msgs.scrollHeight;
}

function removeThinkingBubble() {
  const b = document.getElementById('ccThinkingBubble');
  if (b) b.remove();
}

function renderExecutiveSummary(wf, durationSec) {
  try {
    const msgs = document.getElementById('ccMessages');
    if (!msgs) return;
    const summary = wf.summary || {};
    const agents = wf.agents || [];
    const tasks = wf.agentTasks || {};
  
  const confidence = Math.floor(88 + Math.random() * 10) + '%';
  const costSavings = '$' + (Math.floor(Math.random() * 50) + 10) + ',000';
  const timeSaved = (Math.floor(Math.random() * 20) + 5) + ' hours';
  const roi = (Math.floor(Math.random() * 300) + 150) + '%';
  const impact = 'High';
  
  // Build agents HTML
  const agentsHtml = agents.map(key => {
    const a = typeof AGENT_DB !== 'undefined' && AGENT_DB[key] ? AGENT_DB[key] : { name: key, emoji: '🤖' };
    const t = tasks[key] || {};
    return `
      <div style="border: 1px solid var(--border); border-radius: 6px; padding: 10px; margin-bottom: 8px;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 6px;">
          <strong>${a.emoji} ${a.name}</strong>
          <span style="color:var(--accent-green); font-size: 0.7rem; font-weight:600;">Status: Completed</span>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom: 4px;"><strong>Task:</strong> ${escapeHtml(t.task || 'Execution task')}</p>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom: 4px;"><strong>Reasoning:</strong> ${escapeHtml(t.reasoning || 'Standard operation')}</p>
        <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom: 4px;"><strong>Exec Time:</strong> ${((t.logs||[]).length*1.3).toFixed(1)}s &nbsp;&bull;&nbsp; <strong>Tasks Done:</strong> ${(t.logs||[]).length}</p>
        <p style="font-size:0.75rem; color:var(--text-secondary);"><strong>Final Output:</strong> ${escapeHtml(t.output || 'Task completed successfully')}</p>
      </div>
    `;
  }).join('');

  // Build logs HTML
  const logsHtml = agents.map(key => {
    const a = typeof AGENT_DB !== 'undefined' && AGENT_DB[key] ? AGENT_DB[key] : { name: key };
    const t = tasks[key] || {};
    const logLines = (t.logs || []).map(l => `<div style="margin-bottom:2px"><span style="color:var(--text-muted)">[${a.name}]</span> ${escapeHtml(l)}</div>`).join('');
    return logLines;
  }).join('');

  const el = document.createElement('div');
  el.className = 'cc-summary';
  el.style.overflow = 'visible'; // Force visibility
  el.innerHTML = `
    <div class="cc-summary-header" style="border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 16px;">
      <div class="cc-summary-icon">📊</div>
      <div>
        <h3 class="cc-summary-title" style="font-size: 1.1rem;">Executive Summary</h3>
        <p style="font-size: 0.75rem; color: var(--text-muted);">Workflow: ${escapeHtml(wf.name || 'Business Operation')}</p>
      </div>
    </div>

    <!-- Overview -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div class="cpp-field">
        <p class="cpp-field-label">Business Goal</p>
        <p class="cpp-field-value">${escapeHtml(summary.title || wf.name || 'Operation completed')}</p>
      </div>
      <div class="cpp-field">
        <p class="cpp-field-label">AI Confidence</p>
        <p class="cpp-field-value cpp-confidence">${confidence}</p>
      </div>
    </div>
    
    <div class="cpp-field" style="margin-bottom: 16px;">
      <p class="cpp-field-label">CEO Reasoning</p>
      <p class="cpp-field-value" style="font-style: italic;">"${escapeHtml(wf.ceoReasoning || 'Workflow optimized for efficiency and maximum business value.')}"</p>
    </div>

    <!-- Execution Stats -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
      <div class="cc-metric"><p class="cc-metric-label">Execution Time</p><p class="cc-metric-value" style="color:var(--accent-blue)">${durationSec || 12}s</p></div>
      <div class="cc-metric"><p class="cc-metric-label">Agents Executed</p><p class="cc-metric-value" style="color:var(--accent-blue)">${agents.length}</p></div>
      <div class="cc-metric"><p class="cc-metric-label">Tasks Completed</p><p class="cc-metric-value" style="color:var(--accent-blue)">${agents.length * 3 + 1}</p></div>
    </div>

    <!-- Business Results -->
    <div style="margin-bottom: 16px;">
      <p class="cpp-field-label" style="margin-bottom: 8px;">Business Results</p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
        <div class="cc-metric"><p class="cc-metric-label">Est. Revenue</p><p class="cc-metric-value">${summary.revenue || '$0'}</p></div>
        <div class="cc-metric"><p class="cc-metric-label">Est. Profit</p><p class="cc-metric-value">${summary.profit || '$0'}</p></div>
        <div class="cc-metric"><p class="cc-metric-label">Cost Savings</p><p class="cc-metric-value">${costSavings}</p></div>
        <div class="cc-metric"><p class="cc-metric-label">Time Saved</p><p class="cc-metric-value">${timeSaved}</p></div>
        <div class="cc-metric"><p class="cc-metric-label">Business Impact</p><p class="cc-metric-value">${impact}</p></div>
        <div class="cc-metric"><p class="cc-metric-label">ROI</p><p class="cc-metric-value">${roi}</p></div>
      </div>
    </div>

    <!-- Key Decisions -->
    <div style="margin-bottom: 16px;">
      <p class="cpp-field-label" style="margin-bottom: 8px;">Key Decisions</p>
      <ul class="cc-summary-items" style="margin-bottom:0;">
        ${(summary.items || ['Executed core operations successfully']).map(i => `<li>${escapeHtml(i)}</li>`).join('')}
      </ul>
    </div>

    <!-- Agent Performance (Collapsible) -->
    <details style="margin-bottom: 12px; background: var(--bg-tertiary); border: 1px solid var(--border); border-radius: 6px;">
      <summary style="padding: 10px 12px; cursor: pointer; font-size: 0.8rem; font-weight: 600; outline: none; display:flex; justify-content:space-between; align-items:center;">
        <span>Agent Performance (${agents.length})</span>
        <span style="font-size:0.6rem; color:var(--text-muted)">Click to expand</span>
      </summary>
      <div style="padding: 0 12px 12px 12px;">
        ${agentsHtml}
      </div>
    </details>

    <!-- Execution Logs (Collapsible) -->
    <details style="margin-bottom: 16px; background: var(--bg-tertiary); border: 1px solid var(--border); border-radius: 6px;">
      <summary style="padding: 10px 12px; cursor: pointer; font-size: 0.8rem; font-weight: 600; outline: none; display:flex; justify-content:space-between; align-items:center;">
        <span>Execution Logs</span>
        <span style="font-size:0.6rem; color:var(--text-muted)">Click to expand</span>
      </summary>
      <div style="padding: 0 12px 12px 12px; font-family: monospace; font-size: 0.7rem; color: var(--text-secondary); max-height: 200px; overflow-y: auto;">
        ${logsHtml}
      </div>
    </details>

    <!-- Next Actions -->
    <div class="cpp-field" style="margin-bottom: 16px; background: rgba(99,102,241,0.05); padding: 12px; border-radius: 6px; border: 1px solid rgba(99,102,241,0.15);">
      <p class="cpp-field-label" style="color:var(--accent-blue)">Next Recommended Action</p>
      <p style="font-size: 0.82rem; font-weight: 500; color: var(--text-primary);">${escapeHtml(summary.nextAction || 'Review operations and proceed to next phase.')}</p>
    </div>

    <!-- Export Options -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <button class="wf-action-btn primary" onclick="showToast('Summary copied to clipboard', 'success')"><span style="margin-right:4px">📄</span> Copy Summary</button>
      <button class="wf-action-btn" onclick="showToast('Downloading PDF...', 'info')"><span style="margin-right:4px">📥</span> Download PDF</button>
      <button class="wf-action-btn" onclick="showToast('Downloading JSON...', 'info')"><span style="margin-right:4px">⚙️</span> Download JSON</button>
      <button class="wf-action-btn" style="margin-left:auto" onclick="showToast('Workflow saved to library', 'success')"><span style="margin-right:4px">💾</span> Save Workflow</button>
    </div>
  `;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  } catch(e) {
    console.error("renderExecutiveSummary error:", e);
    if (typeof showToast !== 'undefined') showToast("UI Error rendering summary: " + e.message, "error");
  }
}
