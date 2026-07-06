/* pages-other.js — Knowledge Base, Analytics, Settings */

/* ─── KNOWLEDGE BASE ─── */
function renderKnowledgeBasePage() {
  const cats = ['All','Policy','Finance','Analytics','Marketing','Operations','Support','System'];
  document.getElementById('content').innerHTML = `
<div class="pg-kb animate-in">
  <div class="pg-header">
    <div><h1 class="pg-title">Knowledge Base</h1><p class="pg-sub">Documents, business rules, and AI agent memory</p></div>
    <button class="btn-primary" id="kbUploadBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> Upload Document</button>
  </div>
  <div class="stats-grid" style="margin-bottom:20px">
    <div class="stat-card"><div class="stat-icon stat-icon-blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div><div class="stat-info"><p class="stat-label">Documents</p><p class="stat-value">${KB_DOCS.length}</p><p class="stat-change positive">+2 this week</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-purple"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><div class="stat-info"><p class="stat-label">AI Indexed</p><p class="stat-value">${KB_DOCS.filter(d=>d.indexed).length}</p><p class="stat-change positive">Ready for RAG</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><div class="stat-info"><p class="stat-label">Categories</p><p class="stat-value">7</p><p class="stat-change positive">Organized</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><div class="stat-info"><p class="stat-label">Total Storage</p><p class="stat-value">21 MB</p><p class="stat-change positive">of 1 GB</p></div></div>
  </div>
  <div class="panel" style="padding:16px;margin-bottom:16px">
    <div class="kb-search-row">
      <div class="wf-search-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input class="wf-search" id="kbSearch" placeholder="Search documents, rules, policies..." /></div>
    </div>
    <div class="kb-cats" id="kbCats">${cats.map((c,i)=>`<button class="kb-cat-btn${i===0?' active':''}" data-cat="${c}">${c}</button>`).join('')}</div>
  </div>
  <div class="kb-docs-grid" id="kbDocsGrid">${KB_DOCS.map(kbDocCard).join('')}</div>
</div>`;
  initKnowledgeBaseListeners();
}

function kbDocCard(d) {
  const cc = CAT_COLORS[d.cat]||'#6366f1';
  const tags = d.tags.map(t=>`<span class="kb-tag">${t}</span>`).join('');
  return `<div class="kb-doc-card" data-cat="${d.cat}" data-title="${d.title.toLowerCase()}">
    <div class="kb-doc-icon" style="background:${cc}22;color:${cc}">📄</div>
    <div class="kb-doc-info">
      <p class="kb-doc-title">${d.title}</p>
      <div class="kb-doc-meta"><span class="kb-cat-pill" style="background:${cc}22;color:${cc}">${d.cat}</span><span>${d.size}</span><span>${d.date}</span>${d.indexed?'<span class="kb-indexed-badge">🤖 AI Indexed</span>':''}</div>
      <div class="kb-doc-tags">${tags}</div>
    </div>
    <div class="kb-doc-actions"><button class="wf-action-btn" onclick="showToast('Document viewer coming soon — RAG integration ready','info')">View</button></div>
  </div>`;
}

function initKnowledgeBaseListeners() {
  document.getElementById('kbUploadBtn')?.addEventListener('click', () => showToast('Document upload UI — RAG pipeline ready for integration','info'));
  const search = document.getElementById('kbSearch');
  search?.addEventListener('input', () => filterKbDocs());
  document.querySelectorAll('.kb-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.kb-cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); filterKbDocs();
    });
  });
}

function filterKbDocs() {
  const q = (document.getElementById('kbSearch')?.value||'').toLowerCase();
  const cat = document.querySelector('.kb-cat-btn.active')?.dataset.cat||'All';
  document.querySelectorAll('.kb-doc-card').forEach(c => {
    const matchCat = cat==='All'||c.dataset.cat===cat;
    const matchQ = !q||(c.dataset.title||'').includes(q);
    c.style.display = (matchCat&&matchQ)?'':'none';
  });
}

/* ─── ANALYTICS PAGE ─── */
let _analyticsCharts = {};

function renderAnalyticsPage() {
  const stats = WorkflowStore.getStats();
  const all = WorkflowStore.getAll();
  const rows = all.slice(0,6).map(w=>`<tr><td>${w.name}</td><td>${(w.agents||[]).map(a=>(AGENT_DB[a]||{emoji:'🤖'}).emoji).join('')}</td><td><span class="status-chip completed">Completed</span></td><td>${w.duration||0}s</td><td style="color:var(--accent-green)">${w.revenue}</td></tr>`).join('');

  document.getElementById('content').innerHTML = `
<div class="pg-analytics animate-in">
  <div class="pg-header"><div><h1 class="pg-title">Analytics Dashboard</h1><p class="pg-sub">Real-time workflow and agent performance insights</p></div></div>
  <div class="stats-grid" style="margin-bottom:20px">
    <div class="stat-card"><div class="stat-icon stat-icon-green"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="stat-info"><p class="stat-label">Total Revenue</p><p class="stat-value" id="anRevenue">$${(stats.totalRevenue/1000).toFixed(0)}K</p><p class="stat-change positive">+24% MoM</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><div class="stat-info"><p class="stat-label">Workflows Executed</p><p class="stat-value">${stats.total}</p><p class="stat-change positive">+3 this week</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-purple"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div><div class="stat-info"><p class="stat-label">Success Rate</p><p class="stat-value">97%</p><p class="stat-change positive">+2% vs avg</p></div></div>
    <div class="stat-card"><div class="stat-icon stat-icon-amber"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="stat-info"><p class="stat-label">Avg Exec Time</p><p class="stat-value">${stats.avgDuration}s</p><p class="stat-change positive">-2.1s vs last month</p></div></div>
  </div>
  <div class="an-charts-row">
    <div class="panel chart-panel"><div class="panel-header"><h2 class="panel-title">Revenue Trend (7 Days)</h2></div><div class="chart-wrapper"><canvas id="anRevenueChart"></canvas></div></div>
    <div class="panel chart-panel"><div class="panel-header"><h2 class="panel-title">Workflow Volume</h2></div><div class="chart-wrapper"><canvas id="anWfChart"></canvas></div></div>
  </div>
  <div class="an-charts-row" style="margin-top:16px">
    <div class="panel chart-panel"><div class="panel-header"><h2 class="panel-title">Agent Usage Distribution</h2></div><div class="chart-wrapper" style="height:200px"><canvas id="anAgentChart"></canvas></div></div>
    <div class="panel" style="flex:2;padding:16px">
      <div class="panel-header" style="margin-bottom:12px"><h2 class="panel-title">Recent Workflows</h2></div>
      <table class="an-table"><thead><tr><th>Workflow</th><th>Agents</th><th>Status</th><th>Time</th><th>Revenue</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
  </div>
</div>`;
  setTimeout(initAnalyticsCharts, 50);
}

function initAnalyticsCharts() {
  Object.values(_analyticsCharts).forEach(c=>{try{c.destroy()}catch{}});
  _analyticsCharts = {};
  const def = { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#55556a',font:{size:10,family:'Inter'}}}, y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#55556a',font:{size:10,family:'Inter'}}} } };

  const r = document.getElementById('anRevenueChart');
  if (r) { const g=r.getContext('2d').createLinearGradient(0,0,0,180); g.addColorStop(0,'rgba(52,211,153,0.3)'); g.addColorStop(1,'rgba(52,211,153,0)');
    _analyticsCharts.rev = new Chart(r,{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{data:[42,58,51,67,74,68,82],borderColor:'#34d399',backgroundColor:g,borderWidth:2,fill:true,tension:0.4,pointRadius:0,pointHoverRadius:5}]},options:{...def,scales:{...def.scales,y:{...def.scales.y,ticks:{...def.scales.y.ticks,callback:v=>'$'+v+'K'}}}}});
  }
  const w = document.getElementById('anWfChart');
  if (w) _analyticsCharts.wf = new Chart(w,{type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{data:[3,5,4,7,6,4,8],backgroundColor:'rgba(99,102,241,0.6)',borderRadius:6,borderSkipped:false,barThickness:20}]},options:def});

  const ag = document.getElementById('anAgentChart');
  const usage = WorkflowStore.getStats().agentUsage;
  if (ag) _analyticsCharts.ag = new Chart(ag,{type:'doughnut',data:{labels:['Finance','Marketing','Inventory','Support','CEO'],datasets:[{data:[usage.finance||8,usage.marketing||5,usage.inventory||6,usage.support||4,usage.ceo||0],backgroundColor:['#34d399','#fbbf24','#8b5cf6','#22d3ee','#6366f1'],borderWidth:0,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#94a3b8',font:{size:11,family:'Inter'},padding:12}}}}});
}

/* ─── SETTINGS PAGE ─── */
function renderSettingsPage() {
  const s = WorkflowStore.getSettings();
  const apiKey = s.geminiKey || '';
  const masked = apiKey ? apiKey.slice(0,8) + '••••••••••••••••' : '';
  document.getElementById('content').innerHTML = `
<div class="pg-settings animate-in">
  <div class="pg-header"><div><h1 class="pg-title">Settings</h1><p class="pg-sub">Configure your OmniFlow AI platform</p></div></div>

  <div class="settings-grid">
    <div class="panel settings-card">
      <div class="settings-section-title">🔑 Gemini API Configuration</div>
      <div class="settings-field"><label class="settings-label">Gemini API Key</label><div class="settings-input-row"><input class="settings-input" id="settGeminiKey" type="password" placeholder="AIzaSy..." value="${apiKey}" /><button class="wf-action-btn" id="settShowKey">${apiKey?'Show':'Set'}</button></div><p class="settings-hint">Used for CEO Agent reasoning and workflow planning. Stored in backend .env</p></div>
      <div class="settings-field"><label class="settings-label">Backend URL</label><input class="settings-input" id="settBackendUrl" value="${s.backendUrl||'http://127.0.0.1:8000'}" /></div>
      <div class="settings-field"><label class="settings-label">Connection Status</label>
        <div class="conn-status-row"><span class="conn-dot" id="connDot"></span><span id="connLabel" style="font-size:0.82rem">Checking...</span><button class="wf-action-btn" id="testConnBtn">Test</button></div>
      </div>
    </div>

    <div class="panel settings-card">
      <div class="settings-section-title">⚙️ Execution Preferences</div>
      <div class="settings-field"><label class="settings-label">Execution Speed</label>
        <div class="settings-radio-group">
          ${['Fast','Normal','Careful'].map(sp=>`<label class="settings-radio"><input type="radio" name="execSpeed" value="${sp}" ${(s.execSpeed||'Normal')===sp?'checked':''}> ${sp}</label>`).join('')}
        </div><p class="settings-hint">Fast: 800ms delays · Normal: 1.3s · Careful: 2s per agent step</p>
      </div>
      <div class="settings-field settings-toggle-row"><div><label class="settings-label">Auto-save Workflow History</label><p class="settings-hint">Store completed workflows in browser localStorage</p></div><label class="toggle-switch"><input type="checkbox" id="settAutoSave" ${s.autoSave!==false?'checked':''}><span class="toggle-slider"></span></label></div>
      <div class="settings-field settings-toggle-row"><div><label class="settings-label">CEO Planning Panel</label><p class="settings-hint">Show execution plan before agents start</p></div><label class="toggle-switch"><input type="checkbox" id="settPlanPanel" ${s.planPanel!==false?'checked':''}><span class="toggle-slider"></span></label></div>
    </div>

    <div class="panel settings-card">
      <div class="settings-section-title">🔔 Notifications</div>
      <div class="settings-field settings-toggle-row"><div><label class="settings-label">Workflow Completion Toast</label><p class="settings-hint">Show success notification on workflow finish</p></div><label class="toggle-switch"><input type="checkbox" id="settNotifComplete" ${s.notifComplete!==false?'checked':''}><span class="toggle-slider"></span></label></div>
      <div class="settings-field settings-toggle-row"><div><label class="settings-label">Error Notifications</label><p class="settings-hint">Show toast on backend errors</p></div><label class="toggle-switch"><input type="checkbox" id="settNotifError" ${s.notifError!==false?'checked':''}><span class="toggle-slider"></span></label></div>
    </div>

    <div class="panel settings-card">
      <div class="settings-section-title">🗄️ Data Management</div>
      <div class="settings-field"><label class="settings-label">Workflow History</label><p class="settings-hint">${WorkflowStore.getAll().length} workflows stored in browser</p><div style="display:flex;gap:8px;margin-top:8px"><button class="wf-action-btn" id="exportLogsBtn">Export JSON</button><button class="wf-action-btn" style="color:#f87171;border-color:rgba(248,113,113,0.3)" id="clearHistBtn">Clear History</button></div></div>
      <div class="settings-field"><label class="settings-label">Reset Platform</label><p class="settings-hint">Reset all settings to defaults</p><button class="wf-action-btn" style="color:#f87171;border-color:rgba(248,113,113,0.3);margin-top:8px" id="resetBtn">Reset All Settings</button></div>
    </div>
  </div>

  <div style="display:flex;gap:12px;margin-top:8px">
    <button class="btn-primary" id="saveSettingsBtn">Save Settings</button>
    <button class="wf-action-btn" onclick="navigateTo('dashboard')">Cancel</button>
  </div>
</div>`;
  initSettingsListeners();
  testConnection();
}

function testConnection() {
  const dot = document.getElementById('connDot');
  const lbl = document.getElementById('connLabel');
  if (!dot||!lbl) return;
  const url = document.getElementById('settBackendUrl')?.value || 'http://127.0.0.1:8000';
  fetch(`${url}/health`).then(r=>{
    if(r.ok){ dot.style.background='#34d399'; lbl.textContent='Backend Online'; }
    else{ dot.style.background='#f87171'; lbl.textContent='Backend Error ('+r.status+')'; }
  }).catch(()=>{ dot.style.background='#f87171'; lbl.textContent='Backend Unreachable'; });
}

function initSettingsListeners() {
  document.getElementById('testConnBtn')?.addEventListener('click', testConnection);
  document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
    const s = {
      geminiKey: document.getElementById('settGeminiKey')?.value||'',
      backendUrl: document.getElementById('settBackendUrl')?.value||'http://127.0.0.1:8000',
      execSpeed: document.querySelector('input[name="execSpeed"]:checked')?.value||'Normal',
      autoSave: document.getElementById('settAutoSave')?.checked,
      planPanel: document.getElementById('settPlanPanel')?.checked,
      notifComplete: document.getElementById('settNotifComplete')?.checked,
      notifError: document.getElementById('settNotifError')?.checked,
    };
    WorkflowStore.saveSettings(s);
    showToast('Settings saved successfully','success');
  });
  document.getElementById('settShowKey')?.addEventListener('click', () => {
    const inp = document.getElementById('settGeminiKey');
    if(inp) inp.type = inp.type==='password'?'text':'password';
  });
  document.getElementById('exportLogsBtn')?.addEventListener('click', () => {
    const data = JSON.stringify(WorkflowStore.getAll(), null, 2);
    const blob = new Blob([data],{type:'application/json'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='omniflow-workflows.json'; a.click();
    showToast('Workflow history exported','success');
  });
  document.getElementById('clearHistBtn')?.addEventListener('click', () => {
    WorkflowStore.clear();
    showToast('Workflow history cleared','warning');
    renderSettingsPage();
  });
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    WorkflowStore.saveSettings({});
    showToast('Settings reset to defaults','info');
    renderSettingsPage();
  });
}
