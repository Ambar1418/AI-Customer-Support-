const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL?.trim() ?? "";

export function isWebhookConfigured() {
  return WEBHOOK_URL.length > 0;
}

export async function sendChatMessage(question, sessionId) {
  if (!isWebhookConfigured()) {
    throw new Error(
      "The support webhook is not configured. Add VITE_N8N_WEBHOOK_URL to your .env file and restart the app.",
    );
  }

  let response;
  try {
    response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, sessionId }),
      signal: AbortSignal.timeout(45_000),
    });
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error("The support service took too long to respond. Please try again.");
    }
    throw new Error(
      "We couldn't reach the support service. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `The support service returned an error (${response.status}). Please try again shortly.`,
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The support service returned an unreadable response. Please try again.");
  }

  if (!data || typeof data.answer !== "string" || !data.answer.trim()) {
    throw new Error("The support service response did not include a valid answer.");
  }

  let sources = [];
  if (data.sources !== undefined) {
    if (
      !Array.isArray(data.sources) ||
      data.sources.some(
        (source) =>
          !source ||
          typeof source.title !== "string" ||
          typeof source.content !== "string",
      )
    ) {
      throw new Error("The support service returned invalid source references.");
    }
    sources = data.sources.map((source) => ({
        title: source.title,
        content: source.content,
      }));
  }

  return { answer: data.answer.trim(), sources };
}
