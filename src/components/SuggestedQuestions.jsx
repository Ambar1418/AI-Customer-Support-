import { ArrowUpRight, Clock3, KeyRound, RefreshCw, WalletCards } from "lucide-react";

const suggestions = [
  { text: "What are your customer support hours?", icon: Clock3 },
  { text: "How can I reset my password?", icon: KeyRound },
  { text: "What is your refund policy?", icon: WalletCards },
  { text: "How long does a refund take?", icon: RefreshCw },
];

export default function SuggestedQuestions({ onSelect, disabled }) {
  return (
    <section className="suggestions" aria-label="Suggested questions">
      <p className="eyebrow">POPULAR QUESTIONS</p>
      <div className="suggestion-grid">
        {suggestions.map(({ text, icon: Icon }) => (
          <button
            className="suggestion-card"
            key={text}
            onClick={() => onSelect(text)}
            disabled={disabled}
          >
            <span className="suggestion-card__icon"><Icon size={17} strokeWidth={1.8} /></span>
            <span>{text}</span>
            <ArrowUpRight className="suggestion-card__arrow" size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}
