import { useEffect } from "react";
import { CheckCircle2, CircleHelp, PlugZap, ShieldCheck, X } from "lucide-react";

export default function SettingsModal({
  onClose,
  configured,
  onClearHistory,
}) {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <header className="settings-modal__header">
          <div>
            <span className="eyebrow">PREFERENCES</span>
            <h2 id="settings-title">Settings</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close settings">
            <X size={19} />
          </button>
        </header>

        <div className="settings-section">
          <h3>Connection</h3>
          <div className="settings-status-card">
            <span className={`settings-status-icon${configured ? " is-connected" : ""}`}>
              <PlugZap size={19} />
            </span>
            <div className="settings-status-copy">
              <strong>n8n webhook</strong>
              <span>{configured ? "Webhook URL is configured" : "Webhook URL is not configured"}</span>
            </div>
            <span className={`status-pill${configured ? " status-pill--connected" : " status-pill--offline"}`}>
              <span />{configured ? "Ready" : "Not set up"}
            </span>
          </div>
          {!configured && (
            <p className="settings-help">
              Add <code>VITE_N8N_WEBHOOK_URL</code> to your <code>.env</code> file, then restart the development server. The URL stays in your local environment and is never shown here.
            </p>
          )}
          {configured && (
            <p className="settings-help">
              Configuration is present. The connection is verified when you send a message.
            </p>
          )}
        </div>

        <div className="settings-section">
          <h3>Application</h3>
          <div className="about-row">
            <span className="about-row__icon"><CircleHelp size={17} /></span>
            <span><strong>About SupportAI</strong><small>AI-powered customer support with grounded answers.</small></span>
            <span className="version-tag">v1.0</span>
          </div>
          <div className="about-row">
            <span className="about-row__icon"><ShieldCheck size={17} /></span>
            <span><strong>Your conversations</strong><small>Stored in this browser only.</small></span>
            <CheckCircle2 size={16} className="local-check" />
          </div>
        </div>

        <div className="settings-section settings-section--last">
          <h3>Data</h3>
          <button className="clear-data-button" onClick={onClearHistory}>
            Clear local chat history
            <span>This removes saved conversations from this browser.</span>
          </button>
        </div>
      </section>
    </div>
  );
}
