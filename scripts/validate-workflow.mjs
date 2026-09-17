import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const workflowPath = resolve("workflows/quizai-studio.json");
const workflow = JSON.parse(await readFile(workflowPath, "utf8"));
const nodeNames = new Set(workflow.nodes?.map((node) => node.name));
const requiredNodes = [
  "Webhook",
  "Extract from File",
  "AI Agent",
  "Validate Quiz",
  "Format Response",
  "Schedule Trigger1",
  "Get Pending Submissions",
  "Finalize Report",
  "Send a message",
];

for (const name of requiredNodes) {
  if (!nodeNames.has(name)) throw new Error(`Missing required workflow node: ${name}`);
}

if (!workflow.connections || Object.keys(workflow.connections).length < 1) {
  throw new Error("Workflow has no connections.");
}

const credentialNodes = workflow.nodes.filter((node) => node.credentials);
if (credentialNodes.length > 0) {
  throw new Error("Workflow export contains credential metadata.");
}

const workflowText = JSON.stringify(workflow);
if (workflowText.includes("AKfy")) {
  throw new Error("Workflow export contains a live Apps Script deployment identifier.");
}

const placeholderCount = (workflowText.match(/YOUR-GOOGLE-APPS-SCRIPT-DEPLOYMENT/g) || []).length;
if (placeholderCount !== 3) {
  throw new Error(`Expected three Apps Script placeholders, found ${placeholderCount}.`);
}

console.log(`Validated ${workflow.nodes.length} nodes and ${Object.keys(workflow.connections).length} connection groups.`);
console.log("Credential metadata: none");
console.log("Apps Script endpoints: placeholders only");
