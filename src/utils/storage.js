const STORAGE_KEY = "supportai.conversations.v1";

export function readConversations() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new TypeError("Saved conversations are not a list.");
    }
    return parsed.filter(
      (conversation) =>
        conversation &&
        typeof conversation.id === "string" &&
        typeof conversation.title === "string" &&
        Array.isArray(conversation.messages),
    );
  } catch (error) {
    console.error("Could not read saved SupportAI conversations.", error);
    return [];
  }
}

export function saveConversations(conversations) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}
