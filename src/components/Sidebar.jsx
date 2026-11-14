import { useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  MessageSquarePlus,
  MoreHorizontal,
  PanelLeftClose,
  Settings2,
  Trash2,
  X,
} from "lucide-react";

function groupedConversations(conversations) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const groups = [
    { title: "Today", conversations: [] },
    { title: "Yesterday", conversations: [] },
    { title: "Previous", conversations: [] },
  ];
  conversations.forEach((conversation) => {
    const timestamp = new Date(conversation.updatedAt ?? 0);
    const groupIndex = timestamp >= startOfToday ? 0 : timestamp >= startOfYesterday ? 1 : 2;
    groups[groupIndex].conversations.push(conversation);
  });
  return groups.filter((group) => group.conversations.length);
}

export default function Sidebar({
  conversations,
  activeId,
  onNewChat,
  onSelect,
  onDelete,
  onClear,
  onOpenSettings,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  configured,
}) {
  const [menuId, setMenuId] = useState(null);

  return (
    <>
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onCloseMobile} />}
      <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}${mobileOpen ? " sidebar--mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><Bot size={21} strokeWidth={1.8} /></div>
          {!collapsed && <span className="brand-name">Support<span>AI</span></span>}
          <button
            className="sidebar-toggle"
            onClick={collapsed ? onToggleCollapsed : onCloseMobile}
            aria-label={collapsed ? "Expand sidebar" : "Close sidebar"}
            title={collapsed ? "Expand sidebar" : "Close sidebar"}
          >
            {collapsed ? <ChevronsRight size={17} /> : <PanelLeftClose size={17} />}
          </button>
          <button className="mobile-close" onClick={onCloseMobile} aria-label="Close navigation">
            <X size={19} />
          </button>
        </div>

        <button className="new-chat-button" onClick={() => { onNewChat(); onCloseMobile(); }} title="New chat">
          <MessageSquarePlus size={17} strokeWidth={1.8} />
          {!collapsed && <><span>New chat</span><span className="new-chat-shortcut">⌘ K</span></>}
        </button>

        <div className="history-heading">
          {!collapsed && <><span>YOUR CHATS</span><span className="history-count">{conversations.length}</span></>}
          {collapsed && <Clock3 size={17} />}
        </div>

        {!collapsed && (
          <div className="history-list">
            {conversations.length ? (
              groupedConversations(conversations).map((group) => (
                <section className="history-group" key={group.title}>
                  <h3>{group.title}</h3>
                  {group.conversations.map((conversation) => (
                    <div className="history-item-wrap" key={conversation.id}>
                      <button
                        className={`history-item${activeId === conversation.id ? " history-item--active" : ""}`}
                        onClick={() => { onSelect(conversation.id); onCloseMobile(); }}
                        title={conversation.title}
                      >
                        <span className="history-item__dot" />
                        <span className="history-item__title">{conversation.title}</span>
                      </button>
                      <button
                        className="history-item-menu"
                        aria-label={`Conversation actions for ${conversation.title}`}
                        onClick={() => setMenuId(menuId === conversation.id ? null : conversation.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {menuId === conversation.id && (
                        <div className="history-context-menu">
                          <button onClick={() => { onDelete(conversation.id); setMenuId(null); }}>
                            <Trash2 size={14} /> Delete conversation
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              ))
            ) : (
              <div className="history-empty">Your conversations will appear here.</div>
            )}
          </div>
        )}
        {collapsed && (
          <div className="collapsed-history" title={`${conversations.length} saved conversations`}>
            {conversations.slice(0, 4).map((conversation) => (
              <button
                className={`collapsed-history__item${activeId === conversation.id ? " is-active" : ""}`}
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                aria-label={conversation.title}
              >
                <span />
              </button>
            ))}
          </div>
        )}

        <div className="sidebar-bottom">
          {conversations.length > 0 && (
            <button className="sidebar-clear" onClick={onClear} title="Clear conversation history">
              <Trash2 size={15} />
              {!collapsed && <span>Clear history</span>}
            </button>
          )}
          <div className={`sidebar-system${configured ? "" : " sidebar-system--setup"}`}>
            <span className="system-indicator"><span /></span>
            {!collapsed && <><span className="system-copy">{configured ? "Webhook URL configured" : "Webhook not configured"}</span><ChevronDown size={14} className="system-chevron" /></>}
          </div>
          <button className="settings-link" onClick={() => { onOpenSettings(); onCloseMobile(); }} title="Settings">
            <Settings2 size={17} />
            {!collapsed && <span>Settings</span>}
          </button>
          <div className="sidebar-user">
            <div className="user-avatar">S</div>
            {!collapsed && <><span className="user-name">Support team</span><MoreHorizontal size={17} /></>}
          </div>
        </div>
      </aside>
      {collapsed && (
        <button className="collapsed-expand" onClick={onToggleCollapsed} aria-label="Expand sidebar">
          <ChevronsLeft size={16} />
        </button>
      )}
    </>
  );
}
