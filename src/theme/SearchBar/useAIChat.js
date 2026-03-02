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

function loadMessages() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_PREFIX + 'messages');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  try {
    sessionStorage.setItem(
      SESSION_KEY_PREFIX + 'messages',
      JSON.stringify(messages),
    );
  } catch {
    // sessionStorage quota exceeded — silently ignore
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
  const [activeMessageId, setActiveMessageId] = useState(null);
  const abortRef = useRef(null);

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

        const fragments = [];
        const traceSteps = [];
        const sourceCards = [];
        let followupSuggestions = [];
        let actions = [];

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
                setCurrentSourceCards([...sourceCards]);
                break;
              case 'followups':
                followupSuggestions = event.suggestions;
                setFollowups(event.suggestions);
                break;
              case 'actions':
                actions = event.actions;
                setActiveActions(event.actions);
                break;
              case 'error':
                fragments.push({
                  kind: 'text',
                  content: `\n\n⚠️ Error: ${event.error}`,
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
          sourceCards: [...sourceCards],
          followups: followupSuggestions,
          actions,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setActiveMessageId(assistantMsg.id);
      } catch (err) {
        if (err.name !== 'AbortError') {
          const errorMsg = {
            id: generateId(),
            role: 'assistant',
            content: `Error: ${err.message}`,
            fragments: [{ kind: 'text', content: `⚠️ ${err.message}` }],
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
    sessionStorage.removeItem(SESSION_KEY_PREFIX + 'messages');
  }, []);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

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
    clearHistory,
    cancelStream,
  };
}
