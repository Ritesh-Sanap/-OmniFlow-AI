/* pages-data.js — Static data for all pages */
const AGENT_PROFILES = {
  ceo:       { key:'ceo',       name:'CEO Agent',              emoji:'👔', role:'Chief Orchestrator',   color:'#6366f1', status:'online',   currentTask:'Analyzing Q4 business strategy',         performance:96, totalTasks:284, avgTime:'4.2s', successRate:98, lastActive:'Just now',   description:'Primary orchestrator — analyzes objectives, selects departments, directs agents.', history:[{wf:'Product Launch',time:'2hr ago',dur:'32s',ok:true},{wf:'Sales Report',time:'5hr ago',dur:'18s',ok:true},{wf:'Marketing Campaign',time:'Yesterday',dur:'28s',ok:true}] },
  marketing: { key:'marketing', name:'Marketing Agent',        emoji:'📢', role:'Marketing Specialist', color:'#fbbf24', status:'running',  currentTask:'Running A/B test analysis for Q3',        performance:91, totalTasks:156, avgTime:'7.4s', successRate:94, lastActive:'12 min ago', description:'Builds campaigns, segments audiences, generates creatives, runs multi-channel marketing.', history:[{wf:'Marketing Campaign',time:'12min ago',dur:'24s',ok:true},{wf:'Product Launch',time:'2hr ago',dur:'19s',ok:true},{wf:'Brand Campaign',time:'2 days ago',dur:'22s',ok:true}] },
  finance:   { key:'finance',   name:'Finance Agent',          emoji:'💰', role:'Financial Analyst',    color:'#34d399', status:'online',   currentTask:'Processing Q2 invoice batch',            performance:98, totalTasks:312, avgTime:'5.1s', successRate:99, lastActive:'3 min ago',  description:'Handles pricing, invoicing, revenue forecasting, budget allocation, and P&L.', history:[{wf:'Sales Report',time:'3min ago',dur:'18s',ok:true},{wf:'Order Fulfillment',time:'5hr ago',dur:'14s',ok:true},{wf:'Product Launch',time:'2hr ago',dur:'15s',ok:true}] },
  inventory: { key:'inventory', name:'Inventory Agent',        emoji:'📦', role:'Logistics Manager',    color:'#8b5cf6', status:'online',   currentTask:'Monitoring warehouse stock levels',       performance:94, totalTasks:198, avgTime:'6.8s', successRate:96, lastActive:'5 min ago',  description:'Manages stock, warehousing, supplier coordination, procurement, and logistics.', history:[{wf:'Inventory Audit',time:'5min ago',dur:'21s',ok:true},{wf:'Order Fulfillment',time:'5hr ago',dur:'22s',ok:true},{wf:'Product Launch',time:'2hr ago',dur:'16s',ok:true}] },
  support:   { key:'support',   name:'Customer Support Agent', emoji:'🎧', role:'Support Specialist',   color:'#22d3ee', status:'online',   currentTask:'Handling 3 active customer tickets',     performance:89, totalTasks:124, avgTime:'5.6s', successRate:92, lastActive:'1 min ago',  description:'Manages customer comms, ticket resolution, FAQ creation, and chatbot training.', history:[{wf:'Onboarding — TechCorp',time:'1hr ago',dur:'19s',ok:true},{wf:'Order Fulfillment',time:'5hr ago',dur:'13s',ok:true},{wf:'Support Refresh',time:'3 days ago',dur:'17s',ok:true}] },
};

const WF_TEMPLATES = [
  { id:'TPL-001', name:'Product Launch',        category:'Launch',     emoji:'🚀', agents:['marketing','inventory','finance'],         uses:24, desc:'Full product launch — campaign, stock allocation, and pricing.' },
  { id:'TPL-002', name:'Order Fulfillment',      category:'Operations', emoji:'📦', agents:['inventory','finance','support'],           uses:156,desc:'End-to-end order processing, invoicing, and customer notification.' },
  { id:'TPL-003', name:'Monthly Sales Report',   category:'Analytics',  emoji:'📊', agents:['finance'],                                uses:18, desc:'Aggregate sales data, compute KPIs, and generate executive report.' },
  { id:'TPL-004', name:'Marketing Campaign',     category:'Marketing',  emoji:'📢', agents:['marketing','finance'],                    uses:31, desc:'Multi-channel campaign strategy with budget allocation.' },
  { id:'TPL-005', name:'Customer Onboarding',    category:'Support',    emoji:'🎧', agents:['support','finance'],                      uses:89, desc:'Enterprise onboarding, contract setup, and support activation.' },
  { id:'TPL-006', name:'Inventory Audit',        category:'Operations', emoji:'🔍', agents:['inventory','finance'],                    uses:12, desc:'Full stock verification, write-offs, and reorder planning.' },
];

const KB_DOCS = [
  { id:'DOC-001', title:'Business Operations Manual v3.2',     cat:'Policy',    size:'2.4 MB', date:'Jun 15, 2024', indexed:true,  tags:['operations','policy','SOP'] },
  { id:'DOC-002', title:'Product Pricing Guidelines 2024',     cat:'Finance',   size:'840 KB', date:'Jun 10, 2024', indexed:true,  tags:['pricing','finance','margins'] },
  { id:'DOC-003', title:'Q2 2024 Sales Data Export',           cat:'Analytics', size:'5.1 MB', date:'Jul 1, 2024',  indexed:true,  tags:['sales','data','Q2'] },
  { id:'DOC-004', title:'Customer Support Playbook',           cat:'Support',   size:'1.2 MB', date:'May 28, 2024', indexed:true,  tags:['support','FAQ','escalation'] },
  { id:'DOC-005', title:'Marketing Brand Guidelines',          cat:'Marketing', size:'8.7 MB', date:'Apr 12, 2024', indexed:true,  tags:['brand','marketing','design'] },
  { id:'DOC-006', title:'Warehouse Inventory Procedures',      cat:'Operations',size:'1.8 MB', date:'Jun 20, 2024', indexed:true,  tags:['warehouse','inventory','SOP'] },
  { id:'DOC-007', title:'Enterprise Client Contracts Template',cat:'Finance',   size:'320 KB', date:'Jun 5, 2024',  indexed:false, tags:['contracts','legal','enterprise'] },
  { id:'DOC-008', title:'AI Agent Configuration Reference',    cat:'System',    size:'560 KB', date:'Jul 3, 2024',  indexed:true,  tags:['agents','config','AI'] },
];

const CAT_COLORS = { Launch:'#6366f1', Operations:'#8b5cf6', Analytics:'#34d399', Marketing:'#fbbf24', Support:'#22d3ee', Finance:'#34d399', Policy:'#6366f1', System:'#64748b' };
