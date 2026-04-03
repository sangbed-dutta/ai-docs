import React, { useState, useEffect, useRef } from "react";
import { Sparkles, FileText } from "lucide-react";


/**
 * Sequential thinking steps shown while the AI is processing
 * (isStreaming === true AND no text fragments have arrived yet).
 * Each step appears STEP_INTERVAL_MS after the previous one.
 * The component hides itself once text fragments start streaming.
 */

const STEP_INTERVAL_MS = 3000;

function buildSteps(traceSteps) {
  // Derive counts from live trace events
  const sources = traceSteps.length > 0 ? traceSteps.length : 12;
  const platforms = traceSteps.length > 0
    ? new Set(traceSteps.map((s) => s.step?.split(' — ')[0]).filter(Boolean)).size
    : 3;

  return [
    {
      id: 1,
      icon: "audio",
      text: "Understanding Your Request",
    },
    {
      id: 2,
      icon: "file",
      text: `Explore · ${sources} sources · ${platforms} platforms`,
    },
    {
      id: 3,
      icon: "file",
      text: "Course Categories",
      items: [
        "Selecting a design system from Marketplace",
        "Importing into your workspace",
        "Applying styles, components & tokens",
        "Syncing with existing project setup",
      ],
    },
    {
      id: 4,
      icon: "audio",
      text: "Finalizing Recommendations...",
    },
    {
      id: 5,
      icon: "spinner",
      text: "Generating Setup Instructions",
    },
  ];
}

const ThinkingSteps = ({ messages, isStreaming, traceSteps = [], hasFragments = false }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const bottomRef = useRef(null);

  const lastMsg = messages?.[messages.length - 1];
  const isWaiting = isStreaming && !hasFragments && lastMsg?.role === "user";

  const steps = buildSteps(traceSteps);

  /* Show steps while waiting; reset when done */
  useEffect(() => {
    if (!isWaiting) {
      setVisibleCount(0);
      return;
    }

    setVisibleCount(1); // first step immediately

    const timers = steps.slice(1).map((_, idx) =>
      setTimeout(() => setVisibleCount(idx + 2), (idx + 1) * STEP_INTERVAL_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [isWaiting]);

  /* Scroll newest step into view */
  useEffect(() => {
    if (visibleCount > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [visibleCount]);

  if (!isWaiting || visibleCount === 0) return null;

  return (
    <div className="ai-thinking">
      {/* Docs AI Agent header */}
      <div className="aicm-ai-header">
        <img src="/img/icon/doc-ai-agent.svg" alt="ai-agent"/>
        <span className="aicm-ai-name">Docs AI Agent</span>
      </div>

      {/* Steps with left accent border */}
      <div className="aicm-ai-body ai-thinking__body">
        {steps.slice(0, visibleCount).map((step, idx) => {
          const isActive = idx === visibleCount - 1;
          return (
            <div
              key={step.id}
              className={`ai-thinking-step ${isActive ? "ai-thinking-step--active" : ""}`}
            >
              <div className="ai-thinking-step__icon">
                {step.icon === "spinner" ? (
                  <div className="ai-thinking-step__spinner" />
                ) : step.icon === "audio" ? (
                  <img src="/img/icon/thinking-audio-icon.svg" alt="" width={19} height={19} aria-hidden="true" />
                ) : (
                  <FileText size={19} />
                )}
              </div>

              <div className="ai-thinking-step__content">
                <span className="ai-thinking-step__text">{step.text}</span>
                {step.items && (
                  <ul className="ai-thinking-step__items">
                    {step.items.map((item, i) => (
                      <li
                        key={i}
                        className="ai-thinking-step__item"
                        style={{ animationDelay: `${i * 120}ms` }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ThinkingSteps;
