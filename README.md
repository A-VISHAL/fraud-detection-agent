AIAG08: Real-Time Spending Anomaly Detection & Fraud Prevention Engine
📌 Problem Statement

In India, users lose ₹2,000–₹5,000 annually due to unrecognized or fraudulent card transactions. Most existing fraud detection systems rely on static rules and detect anomalies 24–48 hours after the transaction, which is often too late. There is a need for a real-time, behavior-driven fraud detection system that can prevent losses at the moment of payment.

💡 Solution Description

We present a Real-Time Spending Anomaly Detection & Fraud Prevention Engine powered by Agentic AI.

The system uses an OpenAI Assistant as an autonomous fraud detection agent that evaluates each transaction by comparing it with the user’s historical spending behavior. Based on this analysis, the agent classifies transactions as:

NORMAL – Expected behavior, transaction approved

SUSPICIOUS – Partial deviation, verification recommended

FRAUD – High-risk anomaly, transaction blocked (simulated)

The solution is orchestrated using n8n, which acts as a lightweight backend to trigger the AI agent and execute actions based on its decision. A demo web application simulates real-time payment events.

This approach enables sub-second fraud detection and reduces financial losses caused by delayed fraud identification.

🤖 Agent Workflow

User initiates a payment in the demo web application.
Transaction data is sent to an n8n webhook.
n8n enriches the request with historical spending behavior.
The OpenAI Assistant (AI agent) analyzes the transaction contextually.
The agent returns a structured decision with confidence and reasoning.
n8n routes the decision using a Switch node.
The user receives an immediate response:

✅ Transaction approved
⚠️ Suspicious – verification required
🚫 Fraud detected – transaction blocked (simulated)
📌 The AI agent performs intelligent decision-making, while n8n manages orchestration and execution.
🛠️ Tech Stack Used

Frontend
HTML
CSS
JavaScript
Backend / Orchestration
n8n (Webhook, Switch, Respond to Webhook)
Agentic AI
OpenAI Assistants API

⚙️ Setup and Execution Steps
Clone the repository and open index.html in a browser.
Configure and activate the n8n workflow with a webhook trigger.
Set up the OpenAI Assistant with structured JSON output.
Trigger a payment from the web app to view real-time fraud detection results.

🔗 Prototype Links

GitHub Repository: Add link here
Demo Video (1–2 minutes): Add link here
Hosted Prototype (Optional): Add link here
