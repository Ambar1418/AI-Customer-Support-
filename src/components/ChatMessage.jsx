import ReactMarkdown from "react-markdown";
import { Bot, RotateCw } from "lucide-react";
import SourceReferences from "./SourceReferences.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

function formatTime(date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function ChatMessage({ message, isPending, onRetry, requestPending }) {
  const isUser = message.role === "user";
  return (
    <article className={`message message--${message.role}`}>
      {!isUser && (
        <div className="message__avatar" aria-hidden="true">
          <Bot size={17} strokeWidth={1.8} />
        </div>
      )}
      <div className="message__body">
        {isUser ? (
          <div className="message__bubble message__bubble--user">{message.content}</div>
        ) : (
          <div className="message__content">
            {isPending ? (
              <TypingIndicator />
            ) : message.error ? (
              <div className="message-error">
                <p>{message.error}</p>
                <button
                  className="retry-button"
                  onClick={() => onRetry(message)}
                  disabled={requestPending}
                >
                  <RotateCw size={14} />
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="markdown-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <SourceReferences sources={message.sources} />
              </>
            )}
          </div>
        )}
        {!isPending && (
          <time className={`message__time${isUser ? " message__time--user" : ""}`}>
            {formatTime(message.createdAt)}
          </time>
        )}
      </div>
    </article>
  );
}
