import { useEffect, useRef } from "react";
import { MessageSquareText } from "lucide-react";
import ChatInput from "./ChatInput.jsx";
import ChatMessage from "./ChatMessage.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";

export default function ChatWindow({
  conversation,
  pendingId,
  onSend,
  onRetry,
  configured,
}) {
  const messagesEndRef = useRef(null);
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pendingId, conversation?.id]);

  return (
    <main className="chat-main">
      {messages.length === 0 ? (
        <div className="chat-empty">
          <WelcomeScreen
            onSelect={onSend}
            disabled={Boolean(pendingId)}
            configured={configured}
          />
        </div>
      ) : (
        <div className="conversation-scroll">
          <div className="conversation-content">
            <div className="conversation-date">
              <span><MessageSquareText size={13} /> {conversation?.title}</span>
            </div>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isPending={pendingId === message.id}
                requestPending={Boolean(pendingId)}
                onRetry={onRetry}
              />
            ))}
            {pendingId && !messages.some((message) => message.id === pendingId) && (
              <ChatMessage
                key={pendingId}
                message={{ id: pendingId, role: "assistant", createdAt: new Date().toISOString() }}
                isPending
                requestPending
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      <footer className="chat-footer">
        <ChatInput
          onSend={onSend}
          disabled={Boolean(pendingId)}
        />
        <p className="footer-note">SupportAI can make mistakes. Please verify important information.</p>
      </footer>
    </main>
  );
}
