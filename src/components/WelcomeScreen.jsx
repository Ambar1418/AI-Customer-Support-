import { Bot, Sparkles } from "lucide-react";
import SuggestedQuestions from "./SuggestedQuestions.jsx";

export default function WelcomeScreen({ onSelect, disabled, configured }) {
  return (
    <div className="welcome">
      <div className="welcome__intro">
        <div className="welcome__avatar">
          <Bot size={28} strokeWidth={1.6} />
          <span className="welcome__sparkle"><Sparkles size={13} /></span>
        </div>
        <span className="welcome__kicker">YOUR SUPPORT, SIMPLIFIED</span>
        <h2>How can we help you today?</h2>
        <p>Ask anything about our products, policies, refunds, or support services.</p>
        {!configured && (
          <div className="config-notice" role="status">
            The support connection isn’t configured yet. Add your webhook URL in <code>.env</code> to start chatting.
          </div>
        )}
      </div>
      <SuggestedQuestions onSelect={onSelect}       disabled={disabled} />
    </div>
  );
}
