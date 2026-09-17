# Integrations

This document describes the external services used by the current prototype. Secrets and credential identifiers are intentionally not stored in the repository.

## n8n Webhook

**Purpose:** Receive teacher files and assessment configuration and orchestrate quiz generation.

**Input:** Multipart form data containing uploaded files, file names/count, question configuration, instructions, question types, and deadline.

**Output:** Either generated Google artifact URLs or an accepted/processing response with a job identifier, depending on the workflow execution path.

**Configuration:** Import `workflows/quizai-studio.json`, configure the production webhook path, and enter the production URL in the application Settings page.

**Authentication:** The current frontend does not add application authentication. Secure the n8n endpoint at the deployment/network layer before sharing it beyond a controlled prototype.

**Limitations:** The browser calls the webhook directly, CORS is permissive in the exported workflow, and there is no durable job-status endpoint.

## Google Gemini

**Purpose:** Generate source-grounded assessment questions and evaluate student answers.

**Input:** Aggregated extracted course material plus normalized quiz configuration for generation; student and answer context for evaluation.

**Output:** JSON quiz structure for generation and JSON containing graded answers plus an HTML report for evaluation.

**Configuration:** Attach a Google Gemini credential to both Gemini model nodes after importing the workflow.

**Authentication:** n8n-managed Google Gemini credential.

**Limitations:** The workflow relies on prompt instructions and runtime parsing/validation. It does not provide a formal factuality benchmark or guarantee human-level grading accuracy.

## Google Apps Script

**Purpose:** Provide the Google Workspace integration boundary used by n8n.

**Input:** `createQuiz`, `getPendingSubmissions`, and `markEvaluated` actions with quiz or submission data.

**Output:** Form, answer-key, response-sheet, deadline, pending-submission, and evaluation-status data expected by n8n.

**Configuration:** Deploy the Apps Script as a web app, then replace the three `YOUR-GOOGLE-APPS-SCRIPT-DEPLOYMENT` placeholders in the imported workflow with its `/exec` URL.

**Authentication:** Determined by the Apps Script deployment settings and the Google account/services used by that script.

**Limitations:** The Apps Script source is not included in this repository, so its internal authorization, validation, and Google API behavior cannot be audited here.

## Google Forms

**Purpose:** Host the generated student assessment.

**Input:** Validated quiz title, description, configuration, and questions through Apps Script.

**Output:** A student-facing form URL and identifiers returned through Apps Script.

**Configuration:** Managed by the Apps Script implementation and Google account it uses.

**Authentication:** Google account/service authorization in Apps Script.

**Limitations:** Form deadline enforcement is external to the Next.js application.

## Google Sheets

**Purpose:** Store the answer key and student responses.

**Input:** Validated questions and generated form response configuration through Apps Script.

**Output:** Answer-key and response-sheet URLs/identifiers; pending responses for scheduled processing.

**Configuration:** Managed by Apps Script and its Google authorization.

**Authentication:** Google account/service authorization in Apps Script.

**Limitations:** The Next.js app does not query Sheets directly. It depends on the response contract returned by Apps Script.

## Gmail

**Purpose:** Send personalized performance reports to students.

**Input:** Student email, quiz title, and finalized HTML report from n8n.

**Output:** Email delivery handled by the n8n Gmail node.

**Configuration:** Attach an OAuth2 Gmail credential to the Gmail node after workflow import.

**Authentication:** n8n-managed Gmail OAuth2 credential.

**Limitations:** Delivery status and bounce handling are not represented in the Next.js application.
