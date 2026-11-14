import { useEffect, useRef, useState } from "react";
import { ArrowUp, CornerDownLeft, LoaderCircle } from "lucide-react";

const MAX_LENGTH = 2000;

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [value]);

  const submit = () => {
    const question = value.trim();
    if (!question || disabled) return;
    onSend(question);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  return (
    <div className="composer-wrap">
      <form
        className={`composer${disabled ? " composer--loading" : ""}`}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          maxLength={MAX_LENGTH}
          rows={1}
          placeholder="Ask your customer support question..."
          aria-label="Your message"
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
        />
        <button
          className="send-button"
          type="submit"
          disabled={!value.trim() || disabled}
          aria-label={disabled ? "Waiting for a response" : "Send message"}
        >
          {disabled ? <LoaderCircle size={18} className="spin" /> : <ArrowUp size={19} />}
        </button>
      </form>
      <div className="composer-meta">
        <span><CornerDownLeft size={13} /> Enter to send <span className="meta-divider">·</span> Shift + Enter for a new line</span>
        <span className={value.length > 1800 ? "character-count character-count--near-limit" : "character-count"}>
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
