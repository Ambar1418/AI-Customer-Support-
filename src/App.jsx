import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  CircleHelp,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ChatWindow from "./components/ChatWindow.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { useChat } from "./hooks/useChat.js";
import { isWebhookConfigured } from "./services/chatService.js";

export default function App() {
  const chat = useChat();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const configured = isWebhookConfigured();
  const sidebarCollapsed = collapsed && !mobileOpen;

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        chat.createConversation();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [chat.createConversation]);

  useEffect(() => {
    const mobileLayout = window.matchMedia("(max-width: 640px)");
    const resetCollapsedSidebar = () => {
      if (mobileLayout.matches) setCollapsed(false);
    };
    resetCollapsedSidebar();
    mobileLayout.addEventListener("change", resetCollapsedSidebar);
    return () => mobileLayout.removeEventListener("change", resetCollapsedSidebar);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Clear all saved conversations? This can't be undone.")) {
      chat.clearConversations();
      setSettingsOpen(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        conversations={chat.conversations}
        activeId={chat.activeId}
        onNewChat={chat.createConversation}
        onSelect={chat.selectConversation}
        onDelete={chat.deleteConversation}
        onClear={handleClearHistory}
        onOpenSettings={() => setSettingsOpen(true)}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        configured={configured}
      />
      <div className={`workspace${sidebarCollapsed ? " workspace--collapsed" : ""}`}>
        <header className="topbar">
          <div className="topbar__leading">
            <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <button className="desktop-collapse-button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <PanelLeftClose size={18} />
            </button>
            <div className="topbar-divider" />
            <div className="breadcrumb">
              <span>Workspace</span><span className="breadcrumb-separator">/</span><strong>Support</strong>
            </div>
          </div>
          <div className="topbar__actions">
            <div className={`connection-status${configured ? "" : " connection-status--setup"}`}>
              <span className="connection-status__dot" />
              {configured ? "Webhook configured" : "Setup required"}
            </div>
            <button className="topbar-help" onClick={() => setSettingsOpen(true)} aria-label="Help and settings" title="Help & settings">
              <CircleHelp size={18} />
            </button>
            <button className="topbar-avatar" aria-label="Support team account" title="Support team">S</button>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <div className="page-heading__overline"><Sparkles size={13} /> SUPPORT ASSISTANT</div>
            <h1>AI Customer Support</h1>
            <p>Intelligent support, powered by your knowledge base.</p>
          </div>
          <div className="page-heading__tools">
            <div className="privacy-badge"><ShieldCheck size={15} /> Private session</div>
            <div className="heading-menu-wrap">
              <button className="header-menu-button" onClick={() => setHeaderMenuOpen((value) => !value)} aria-expanded={headerMenuOpen}>
                <MoreHorizontal size={19} /><ChevronDown size={13} />
              </button>
              {headerMenuOpen && (
                <div className="header-dropdown">
                  <button onClick={() => { chat.createConversation(); setHeaderMenuOpen(false); }}>
                    <Check size={15} /> Start a new chat
                  </button>
                  <button onClick={() => { handleClearHistory(); setHeaderMenuOpen(false); }}>
                    <Check size={15} /> Clear conversation history
                  </button>
                  <button onClick={() => { setSettingsOpen(true); setHeaderMenuOpen(false); }}>
                    <CircleHelp size={15} /> Connection settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {chat.storageError && (
          <div className="storage-warning" role="status">
            Chat history couldn’t be saved to this browser. Check your browser storage settings.
          </div>
        )}

        <ChatWindow
          conversation={chat.activeConversation}
          pendingId={chat.pendingId}
          onSend={chat.submitQuestion}
          onRetry={chat.retryMessage}
          configured={configured}
        />
      </div>

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          configured={configured}
          onClearHistory={handleClearHistory}
        />
      )}
    </div>
  );
}
