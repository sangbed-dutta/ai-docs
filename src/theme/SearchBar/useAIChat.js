import { useState, useCallback, useRef, useEffect } from 'react';

const SESSION_KEY_PREFIX = 'wm-search-session-';

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function getSessionId() {
  const existing = sessionStorage.getItem('wm-search-session-id');
  if (existing) return existing;
  const id = generateId();
  sessionStorage.setItem('wm-search-session-id', id);
  return id;
}

const SOURCE_ORDER = {
  docs: 1,
  academy: 2,
  storybook: 3,
  marketplace: 4,
};

const sortSourceCards = (cards) => {
  return [...cards].sort((a, b) => {
    const orderA = SOURCE_ORDER[a.source] || 99;
    const orderB = SOURCE_ORDER[b.source] || 99;
    return orderA - orderB;
  });
};

function loadMessages() {
  try {
    const raw = localStorage.getItem(SESSION_KEY_PREFIX + 'messages');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(
      SESSION_KEY_PREFIX + 'messages',
      JSON.stringify(messages),
    );
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

export function useAIChat(pageContext, apiUrl) {
  const [messages, setMessages] = useState(loadMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentTraceSteps, setCurrentTraceSteps] = useState([]);
  const [currentFragments, setCurrentFragments] = useState([]);
  const [currentSourceCards, setCurrentSourceCards] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [activeActions, setActiveActions] = useState([]);
  const [activeMessageId, setActiveMessageId] = useState(() => {
    const saved = loadMessages();
    const lastAssistant = [...saved].reverse().find((m) => m.role === 'assistant');
    return lastAssistant?.id ?? null;
  });
  const abortRef = useRef(null);

  const updateMessage = useCallback((messageId, updater) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId) return message;
        return typeof updater === 'function'
          ? updater(message)
          : { ...message, ...updater };
      }),
    );
  }, []);

  // Persist messages on change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isStreaming) return;

      const userMsg = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsStreaming(true);
      setActiveMessageId('__streaming__');
      setCurrentTraceSteps([]);
      setCurrentFragments([]);
      setCurrentSourceCards([]);
      setFollowups([]);
      setActiveActions([]);

      const controller = new AbortController();
      abortRef.current = controller;

      // Hoisted so the catch block can read partial data on abort
      const fragments = [];
      const traceSteps = [];
      const sourceCards = [];
      let followupSuggestions = [];
      let actions = [];
      let responseMeta = null;

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content:
            m.role === 'user'
              ? m.content
              : (m.fragments || [])
                  .filter((f) => f.kind === 'text')
                  .map((f) => f.content)
                  .join(''),
        }));

        const res = await fetch(`${apiUrl}/api/v1/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            sessionId: getSessionId(),
            context: pageContext,
            history,
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            let event;
            try {
              event = JSON.parse(line);
            } catch {
              continue;
            }

            switch (event.type) {
              case 'text':
                fragments.push({ kind: 'text', content: event.content });
                setCurrentFragments([...fragments]);
                break;
              case 'source_ref':
                fragments.push({
                  kind: 'source_ref',
                  source: event.source,
                  label: event.label,
                });
                setCurrentFragments([...fragments]);
                break;
              case 'trace': {
                const existingIdx = traceSteps.findIndex(
                  (t) => t.step === event.step,
                );
                if (existingIdx >= 0) {
                  traceSteps[existingIdx] = {
                    step: event.step,
                    status: event.status,
                  };
                } else {
                  traceSteps.push({ step: event.step, status: event.status });
                }
                setCurrentTraceSteps([...traceSteps]);
                break;
              }
              case 'source_card':
                sourceCards.push({
                  source: event.source,
                  title: event.title,
                  excerpt: event.excerpt,
                  url: event.url,
                  meta: event.meta,
                });
                setCurrentSourceCards(sortSourceCards(sourceCards));
                break;
              case 'followups':
                followupSuggestions = event.suggestions;
                setFollowups(event.suggestions);
                break;
              case 'actions':
                actions = event.actions;
                setActiveActions(event.actions);
                break;
              case 'metadata':
                responseMeta = event.data || null;
                break;
              case 'error':
                fragments.push({
                  kind: 'text',
                  content:
                    '\n\nSomething went wrong while generating a response. Please try again.',
                });
                setCurrentFragments([...fragments]);
                break;
            }
          }
        }

        // Build the final assistant message
        const assistantMsg = {
          id: generateId(),
          role: 'assistant',
          content: fragments
            .filter((f) => f.kind === 'text')
            .map((f) => f.content)
            .join(''),
          fragments: [...fragments],
          traceSteps: [...traceSteps],
          sourceCards: sortSourceCards(sourceCards),
          followups: followupSuggestions,
          actions,
          traceId: responseMeta?.trace_id || null,
          feedbackStatus: 'idle',
          feedbackHelpful: null,
          feedbackReason: null,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setActiveMessageId(assistantMsg.id);
      } catch (err) {
        if (err.name === 'AbortError') {
          // User stopped generation — commit whatever partial content arrived
          if (fragments.length > 0) {
            const partialMsg = {
              id: generateId(),
              role: 'assistant',
              content: fragments
                .filter((f) => f.kind === 'text')
                .map((f) => f.content)
                .join(''),
              fragments: [...fragments],
              traceSteps: [...traceSteps],
              sourceCards: sortSourceCards([...sourceCards]),
              followups: [],
              actions: [],
              traceId: null,
              feedbackStatus: 'idle',
              feedbackHelpful: null,
              feedbackReason: null,
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, partialMsg]);
            setActiveMessageId(partialMsg.id);
          }
        } else {
          const errorMsg = {
            id: generateId(),
            role: 'assistant',
            content: 'Something went wrong. Please try again.',
            fragments: [
              {
                kind: 'text',
                content:
                  'Something went wrong while generating a response. Please try again.',
              },
            ],
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, messages, pageContext, apiUrl],
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    setFollowups([]);
    setActiveActions([]);
    setCurrentFragments([]);
    setCurrentTraceSteps([]);
    setCurrentSourceCards([]);
    setActiveMessageId(null);
    localStorage.removeItem(SESSION_KEY_PREFIX + 'messages');
  }, []);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const submitFeedback = useCallback(
    async (messageId, { helpful, reason = null, comment = null } = {}) => {
      const message = messages.find((item) => item.id === messageId);
      if (!message?.traceId || message.feedbackStatus === 'submitting') {
        return false;
      }

      updateMessage(messageId, {
        feedbackStatus: 'submitting',
        feedbackHelpful: helpful,
        feedbackReason: reason,
      });

      try {
        const response = await fetch(`${apiUrl}/api/v1/chat/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            traceId: message.traceId,
            helpful,
            reason,
            comment,
            sessionId: getSessionId(),
            pageSlug: pageContext?.pageSlug || '',
          }),
        });

        if (!response.ok) {
          throw new Error(`Feedback API error: ${response.status}`);
        }

        updateMessage(messageId, {
          feedbackStatus: 'submitted',
          feedbackHelpful: helpful,
          feedbackReason: reason,
        });
        return true;
      } catch {
        updateMessage(messageId, {
          feedbackStatus: 'failed',
          feedbackHelpful: helpful,
          feedbackReason: reason,
        });
        return false;
      }
    },
    [apiUrl, messages, pageContext?.pageSlug, updateMessage],
  );

  return {
    messages,
    isStreaming,
    currentTraceSteps,
    currentFragments,
    currentSourceCards,
    followups,
    activeActions,
    activeMessageId,
    setActiveMessageId,
    sendMessage,
    submitFeedback,
    clearHistory,
    cancelStream,
  };
}
