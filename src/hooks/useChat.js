import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../services/chatService.js";
import { readConversations, saveConversations } from "../utils/storage.js";

const makeId = () => crypto.randomUUID();

function makeTitle(question) {
  const title = question.trim().replace(/\s+/g, " ");
  return title.length > 38 ? `${title.slice(0, 38).trimEnd()}…` : title;
}

export function useChat() {
  const [conversations, setConversations] = useState(readConversations);
  const [activeId, setActiveId] = useState(() => {
    return conversations[0]?.id ?? null;
  });
  const [pendingId, setPendingId] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      saveConversations(conversations);
      setStorageError(false);
    } catch (error) {
      console.error("Could not save SupportAI conversations.", error);
      setStorageError(true);
    }
  }, [conversations]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? null;

  const createConversation = useCallback(() => {
    const conversation = {
      id: makeId(),
      title: "New conversation",
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setConversations((current) => [conversation, ...current]);
    setActiveId(conversation.id);
    return conversation.id;
  }, []);

  const selectConversation = useCallback((id) => {
    setActiveId(id);
  }, []);

  const deleteConversation = useCallback(
    (id) => {
      const remaining = conversations.filter((conversation) => conversation.id !== id);
      setConversations(remaining);
      if (activeId === id) setActiveId(remaining[0]?.id ?? null);
    },
    [activeId, conversations],
  );

  const clearConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
  }, []);

  const submitQuestion = useCallback(
    async (rawQuestion, retryMessageId = null) => {
      const question = rawQuestion.trim();
      if (!question || pendingId) return;

      let conversationId = activeId;
      if (!conversationId) {
        conversationId = makeId();
        setActiveId(conversationId);
      }

      const userMessage = {
        id: makeId(),
        role: "user",
        content: question,
        createdAt: new Date().toISOString(),
      };
      const assistantId = retryMessageId ?? makeId();

      setConversations((current) => {
        let conversation = current.find((item) => item.id === conversationId);
        if (!conversation) {
          conversation = {
            id: conversationId,
            title: makeTitle(question),
            messages: [],
            updatedAt: new Date().toISOString(),
          };
          current = [conversation, ...current];
        }
        const messages = retryMessageId
          ? conversation.messages.map((message) =>
              message.id === retryMessageId
                ? { ...message, error: null, content: "", sources: [] }
                : message,
            )
          : [...conversation.messages, userMessage];
        return current.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                title:
                  item.messages.length === 0 && !retryMessageId
                    ? makeTitle(question)
                    : item.title,
                messages,
                updatedAt: new Date().toISOString(),
              }
            : item,
        );
      });

      setPendingId(assistantId);
      try {
        const result = await sendChatMessage(question, conversationId);
        if (!mountedRef.current) return;
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: retryMessageId
                    ? conversation.messages.map((message) =>
                        message.id === assistantId
                          ? { ...message, content: result.answer, sources: result.sources, error: null }
                          : message,
                      )
                    : [
                        ...conversation.messages,
                        {
                          id: assistantId,
                          role: "assistant",
                          content: result.answer,
                          sources: result.sources,
                          createdAt: new Date().toISOString(),
                        },
                      ],
                  updatedAt: new Date().toISOString(),
                }
              : conversation,
          ),
        );
      } catch (error) {
        if (!mountedRef.current) return;
        const errorMessage = error instanceof Error ? error.message : "Something went wrong.";
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: retryMessageId
                    ? conversation.messages.map((message) =>
                        message.id === assistantId
                          ? { ...message, error: errorMessage }
                          : message,
                      )
                    : [
                        ...conversation.messages,
                        {
                          id: assistantId,
                          role: "assistant",
                          content: "",
                          sources: [],
                          error: errorMessage,
                          retryQuestion: question,
                          createdAt: new Date().toISOString(),
                        },
                      ],
                }
              : conversation,
          ),
        );
      } finally {
        if (mountedRef.current) setPendingId(null);
      }
    },
    [activeId, pendingId],
  );

  const retryMessage = useCallback(
    (message) => submitQuestion(message.retryQuestion, message.id),
    [submitQuestion],
  );

  return {
    conversations,
    activeConversation,
    activeId,
    pendingId,
    storageError,
    createConversation,
    selectConversation,
    deleteConversation,
    clearConversations,
    submitQuestion,
    retryMessage,
  };
}
