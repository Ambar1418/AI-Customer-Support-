# SupportAI customer support UI

A responsive React and Vite frontend for the AI customer support project. It sends questions to an n8n webhook and displays the returned answer and any RAG source references. The UI does not simulate answers or depend on the internal n8n workflow.

## Requirements

- Node.js 18 or newer
- npm
- An n8n webhook that accepts a JSON `POST` request and returns JSON

## Run locally

```bash
npm install
cp .env.example .env
```

Set the webhook URL in `.env`:

```dotenv
VITE_N8N_WEBHOOK_URL=https://your-n8n-host/webhook/your-webhook-id
```

Then start the development server:

```bash
npm run dev
```

Vite reads environment variables at startup. Restart the server after changing `.env`. The webhook URL is used by the browser and must be safe to expose as a public endpoint; do not put API keys or other secrets in frontend environment variables. Configure authentication, access controls, and CORS on the webhook/backend as appropriate.

## Webhook contract

The app sends:

```json
{
  "question": "What are your customer support hours?",
  "sessionId": "unique-conversation-id"
}
```

The expected response is:

```json
{
  "answer": "Our customer support is available Monday to Saturday, 9 AM to 6 PM.",
  "sources": [
    {
      "title": "Customer Support Policy",
      "content": "Support is available Monday to Saturday, 9 AM to 6 PM."
    }
  ]
}
```

`sources` is optional. Only sources returned by the webhook are displayed. A non-2xx response, unreachable endpoint, timeout, malformed JSON, or missing answer is shown as an actionable error in the chat. The Settings panel indicates whether a URL is configured; it does not claim that a configured endpoint is reachable until a message is sent.

## Features

- Create, switch between, and delete conversations; clear all history with confirmation.
- Conversation history and message sources persisted in browser local storage.
- Retry failed responses and inspect returned RAG references.
- Responsive navigation, a settings panel, and keyboard-accessible chat input.
- Markdown rendering for assistant responses.

Chat history is stored only in the current browser profile. Clearing browser storage removes it.

## Production build

```bash
npm run build
npm run preview
```
