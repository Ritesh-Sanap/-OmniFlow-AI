const { JSDOM } = require("jsdom");
const fs = require("fs");

const pagesData = fs.readFileSync("pages-data.js", "utf8");
const appJs = fs.readFileSync("app.js", "utf8");
const componentsJs = fs.readFileSync("components.js", "utf8");

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="ccMessages"></div></body></html>`, { runScripts: "dangerously" });

// Load globals
dom.window.eval(pagesData);
dom.window.eval(appJs);
dom.window.eval(componentsJs);

// Mock wf
const wf = {
  name: "Test",
  ceoReasoning: "Some reasoning",
  agents: ["marketing", "finance"],
  agentTasks: {
    marketing: { task: "M", reasoning: "R", logs: ["1", "2"], output: "O" },
    finance: { task: "F", reasoning: "R", logs: ["1", "2", "3"], output: "O" }
  },
  summary: {
    title: "Test summary",
    items: ["item 1", "item 2"],
    revenue: "$100",
    profit: "$50",
    nextAction: "Go"
  }
};

try {
  dom.window.renderExecutiveSummary(wf, 12);
  console.log("SUCCESS!");
  console.log(dom.window.document.getElementById("ccMessages").innerHTML);
} catch (e) {
  console.error("FAIL:", e);
}
