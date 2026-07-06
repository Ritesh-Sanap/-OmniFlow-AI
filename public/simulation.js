/* ===== simulation.js — AI Workflow Orchestration Engine v2 ===== */

/* ------------------------------------------------------------------ *
 * AGENT REGISTRY
 * Add new agents here — all other code adapts automatically.
 * ------------------------------------------------------------------ */
const AGENT_DB = {
  ceo:       { name: 'CEO Agent',             emoji: '👔', color: '#6366f1' },
  marketing: { name: 'Marketing Agent',       emoji: '📢', color: '#fbbf24' },
  inventory: { name: 'Inventory Agent',       emoji: '📦', color: '#8b5cf6' },
  finance:   { name: 'Finance Agent',         emoji: '💰', color: '#34d399' },
  support:   { name: 'Customer Support Agent',emoji: '🎧', color: '#22d3ee' },
};

/* ------------------------------------------------------------------ *
 * CEO THINKING STEPS
 * Displayed sequentially while Gemini call is in-flight.
 * ------------------------------------------------------------------ */
const CEO_THINKING_STEPS = [
  'Analyzing business objective...',
  'Understanding company goals...',
  'Selecting departments...',
  'Assigning responsibilities...',
  'Building execution strategy...',
  'Workflow approved.',
];

/* ------------------------------------------------------------------ *
 * WORKFLOW ENGINE
 *
 * Key design: the engine does NOT call /plan.
 * app.js calls /plan ONCE, then passes the workflow object to run(wf).
 * ------------------------------------------------------------------ */
class WorkflowEngine {
  constructor() {
    this.isRunning    = false;
    this.currentWf    = null;

    // Callbacks — set by app.js before calling run()
    this.onCeoThinking  = null; // (stepText: string) => void
    this.onPlanReady    = null; // (wf: object) => void          — called after CEO thinking, before agents start
    this.onAgentState   = null; // (agentKey: string, state: 'waiting'|'thinking'|'running'|'completed') => void
    this.onLog          = null; // (text: string, agentKey: string) => void
    this.onSummary      = null; // (summary: object) => void
    this.onComplete     = null; // () => void
    this.onError        = null; // (message: string) => void
  }

  /* ---- Public API ---- */

  /**
   * Run a workflow.
   * @param {object} wf  — pre-fetched plan from /plan endpoint
   */
  async run(wf) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.currentWf = wf;

    try {
      await this._ceoPlanningPhase(wf);
      await this._agentExecutionPhase(wf);
      await this._summaryPhase(wf);
    } catch (err) {
      console.error('WorkflowEngine error:', err);
      if (this.onError) this.onError('Workflow encountered an unexpected error. Please try again.');
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Returns detail object for agent detail panel.
   * Safe — never throws.
   */
  getAgentDetail(agentKey) {
    if (!this.currentWf) return null;
    const agentMeta = AGENT_DB[agentKey] || { name: agentKey, emoji: '🤖', color: '#666' };

    if (agentKey === 'ceo') {
      return {
        agent:         agentMeta,
        task:          'Orchestrate workflow execution',
        reasoning:     this.currentWf.ceoReasoning || 'CEO analyzed the request and built the execution plan.',
        input:         this.currentWf.name || 'Business command',
        output:        `Activated agents: ${(this.currentWf.agents || []).map(k => (AGENT_DB[k] || {name: k}).name).join(', ')}`,
        executionTime: `${(CEO_THINKING_STEPS.length * 0.9).toFixed(1)}s`,
        status:        'Completed',
      };
    }

    const td = (this.currentWf.agentTasks || {})[agentKey];
    if (!td) return null;

    return {
      agent:         agentMeta,
      task:          td.task      || agentKey + ' task',
      reasoning:     td.reasoning || '',
      input:         td.input     || '',
      output:        td.output    || '',
      executionTime: `${((td.logs || []).length * 1.4).toFixed(1)}s`,
      status:        'Completed',
    };
  }

  /* ---- Private phases ---- */

  async _ceoPlanningPhase(wf) {
    if (this.onAgentState) this.onAgentState('ceo', 'thinking');

    for (const step of CEO_THINKING_STEPS) {
      if (this.onCeoThinking) this.onCeoThinking(step);
      if (this.onLog) this.onLog(`CEO Agent: ${step}`, 'ceo');
      await this._delay(900);
    }

    if (this.onAgentState) this.onAgentState('ceo', 'completed');
    if (this.onLog) this.onLog(
      `CEO Agent: Execution plan ready — activating ${(wf.agents || []).length} agent(s) for "${wf.name || 'workflow'}".`,
      'ceo'
    );

    // Notify that plan is ready (UI can render planning panel)
    if (this.onPlanReady) this.onPlanReady(wf);
    await this._delay(600);
  }

  async _agentExecutionPhase(wf) {
    const agents     = wf.agents     || [];
    const agentTasks = wf.agentTasks || {};

    for (const agentKey of agents) {
      const td = agentTasks[agentKey];
      if (!td) continue; // skip unknown agent

      if (this.onAgentState) this.onAgentState(agentKey, 'thinking');
      await this._delay(700);

      if (this.onAgentState) this.onAgentState(agentKey, 'running');

      const logs = Array.isArray(td.logs) ? td.logs : ['Processing...', 'Working...', 'Done.'];
      for (const logLine of logs) {
        const agentName = (AGENT_DB[agentKey] || {name: agentKey}).name;
        if (this.onLog) this.onLog(`${agentName}: ${logLine}`, agentKey);
        await this._delay(1300);
      }

      if (this.onAgentState) this.onAgentState(agentKey, 'completed');
      await this._delay(500);
    }
  }

  async _summaryPhase(wf) {
    if (this.onLog) this.onLog('✅ All agents completed. Generating executive summary...', 'system');
    await this._delay(600);
    if (!wf.summary) {
      wf.summary = {
        title: wf.name || 'Workflow Complete',
        items: ['All agents executed successfully'],
        revenue: '$0',
        profit:  '$0',
        nextAction: 'Review results.',
      };
    }
    if (this.onSummary) this.onSummary(wf);
    await this._delay(100); // ensure rendering completes
    if (this.onComplete) this.onComplete();
  }

  _delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}

// ---- Single global instance ----
const workflowEngine = new WorkflowEngine();
