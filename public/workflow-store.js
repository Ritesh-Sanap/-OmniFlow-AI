/* ===== workflow-store.js — Persistent Workflow State ===== */

const WorkflowStore = {
  KEY: 'omniflow_wf_history',
  SETTINGS_KEY: 'omniflow_settings',

  _seed: [
    { id:'WF-1000', name:'Product Launch — Summer Luxe Collection', agents:['marketing','inventory','finance'], startedAt: new Date(Date.now()-7200000).toISOString(), completedAt: new Date(Date.now()-7168000).toISOString(), status:'completed', duration:32, revenue:'$178,000', profit:'$119,260', summary:{ title:'Product Launch Plan Ready', items:['Multi-channel marketing campaign created','2,000 units reserved across 3 warehouses','Price set at $89/unit with 67% margin'], revenue:'$178,000', profit:'$119,260', nextAction:'Approve campaign launch and begin production run' }, ceoReasoning:'Product launch requires coordinated Marketing, Inventory, and Finance execution.' },
    { id:'WF-1001', name:'Order Fulfillment — ABC Company (500 units)', agents:['inventory','finance','support'], startedAt: new Date(Date.now()-18000000).toISOString(), completedAt: new Date(Date.now()-17960000).toISOString(), status:'completed', duration:28, revenue:'$40,940', profit:'$27,430', summary:{ title:'Order Fulfillment Complete', items:['Shipment #SHP-7842 prepared','Invoice #INV-2024-0912 generated','Customer tracking notification sent'], revenue:'$40,940', profit:'$27,430', nextAction:'Monitor delivery and follow up on Net 30 payment' }, ceoReasoning:'Fulfillment requires Inventory pick, Finance invoice, and Support communication.' },
    { id:'WF-1002', name:'Monthly Sales Report — June 2024', agents:['finance'], startedAt: new Date(Date.now()-86400000).toISOString(), completedAt: new Date(Date.now()-86370000).toISOString(), status:'completed', duration:18, revenue:'$482,000', profit:'$312,000', summary:{ title:'Monthly Sales Report Ready', items:['Total revenue: $482,000 (+24% MoM)','Online channel leading at 42% share','847 orders processed across 4 channels'], revenue:'$482,000', profit:'$312,000', nextAction:'Schedule board presentation and review report' }, ceoReasoning:'Analytics request — Finance Agent compiles all data and generates comprehensive report.' },
    { id:'WF-1003', name:'Q3 Marketing Campaign Launch', agents:['marketing','finance'], startedAt: new Date(Date.now()-172800000).toISOString(), completedAt: new Date(Date.now()-172770000).toISOString(), status:'completed', duration:24, revenue:'$105,000', profit:'$80,000', summary:{ title:'Marketing Campaign Created', items:['3-channel campaign: Meta, Google, Email','$25,000 budget allocated — ROAS 4.2x','15 creative assets generated'], revenue:'$105,000', profit:'$80,000', nextAction:'Approve creatives and launch campaign' }, ceoReasoning:'Campaign strategy requires Marketing design and Finance budget approval.' },
    { id:'WF-1004', name:'Inventory Audit — Q2 2024', agents:['inventory','finance'], startedAt: new Date(Date.now()-259200000).toISOString(), completedAt: new Date(Date.now()-259170000).toISOString(), status:'completed', duration:21, revenue:'$0', profit:'$0', summary:{ title:'Inventory Audit Complete', items:['1,247 SKUs verified across 3 warehouses','$8,400 in write-offs identified','Reorder triggers set for 12 low-stock items'], revenue:'$0', profit:'$0', nextAction:'Approve write-offs and place reorder requests' }, ceoReasoning:'Audit needs Inventory verification and Finance reconciliation.' },
    { id:'WF-1005', name:'Customer Onboarding — TechCorp Enterprise', agents:['support','finance'], startedAt: new Date(Date.now()-345600000).toISOString(), completedAt: new Date(Date.now()-345570000).toISOString(), status:'completed', duration:19, revenue:'$24,000', profit:'$18,000', summary:{ title:'Onboarding Complete', items:['Enterprise contract executed','Support playbook activated','Payment schedule configured'], revenue:'$24,000', profit:'$18,000', nextAction:'Schedule 30-day check-in call' }, ceoReasoning:'Onboarding needs Support communication and Finance contract setup.' },
  ],

  getAll() {
    try {
      const stored = localStorage.getItem(this.KEY);
      const userAdded = stored ? JSON.parse(stored) : [];
      const seedIds = new Set(this._seed.map(s => s.id));
      const fresh = userAdded.filter(w => !seedIds.has(w.id));
      return [...fresh, ...this._seed];
    } catch { return [...this._seed]; }
  },

  add(wf) {
    try {
      const stored = localStorage.getItem(this.KEY);
      const userAdded = stored ? JSON.parse(stored) : [];
      const entry = {
        id: `WF-${Date.now()}`,
        name: wf.name || 'Business Workflow',
        agents: wf.agents || [],
        startedAt: wf.startedAt || new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: 'completed', duration: wf.duration || 0,
        revenue: wf.summary?.revenue || '$0',
        profit:  wf.summary?.profit  || '$0',
        summary: wf.summary || {},
        ceoReasoning: wf.ceoReasoning || '',
      };
      userAdded.unshift(entry);
      if (userAdded.length > 50) userAdded.pop();
      localStorage.setItem(this.KEY, JSON.stringify(userAdded));
      return entry;
    } catch { return null; }
  },

  clear() { localStorage.removeItem(this.KEY); },

  // Settings helpers
  getSettings() {
    try { return JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}'); }
    catch { return {}; }
  },
  saveSettings(s) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(s));
  },

  // Analytics helpers
  getStats() {
    const all = this.getAll();
    const completed = all.filter(w => w.status === 'completed');
    const totalRevenue = completed.reduce((sum, w) => {
      const n = parseFloat((w.revenue || '$0').replace(/[^0-9.]/g,'')) || 0;
      return sum + n;
    }, 0);
    const avgDuration = completed.length
      ? (completed.reduce((s,w) => s + (w.duration||0), 0) / completed.length).toFixed(1)
      : 0;
    const agentUsage = {};
    all.forEach(w => (w.agents||[]).forEach(a => { agentUsage[a] = (agentUsage[a]||0)+1; }));
    return { total: all.length, completed: completed.length, totalRevenue, avgDuration, agentUsage };
  }
};
