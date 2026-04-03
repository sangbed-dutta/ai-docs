import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import ThinkingSteps from './ThinkingSteps';
import remarkGfm from 'remark-gfm';
import DocusaurusCodeBlock from '@theme/CodeBlock';
import { useHistory } from '@docusaurus/router';

import {
  SOURCE_ICONS,
  DocsIcon,
  MarketplaceIcon,
  StorybookIcon,
  AcademyIcon,
} from './SourceIcons';
import styles from './AIConverstion.module.css';

const BADGE_ICONS = {
  docs: '●',
  storybook: '◈',
  marketplace: '⬡',
  academy: '✦',
};

const FEEDBACK_REASONS = [
  { value: 'incorrect', label: 'Incorrect' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'not_relevant', label: 'Not relevant' },
  { value: 'outdated', label: 'Outdated' },
  { value: 'unclear', label: 'Unclear' },
];

function getBadgeClass(source) {
  switch (source) {
    case 'docs':
      return styles.sbadgeDocs;
    case 'storybook':
      return styles.sbadgeStorybook;
    case 'marketplace':
      return styles.sbadgeMarketplace;
    case 'academy':
      return styles.sbadgeAcademy;
    default:
      return styles.sbadgeDocs;
  }
}

function buildMarkdownComponents(navigate) {
  return {
    code({ node: _node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match) {
        return (
          <DocusaurusCodeBlock language={match[1]} className={className}>
            {String(children).replace(/\n$/, '')}
          </DocusaurusCodeBlock>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a({ node: _node, children, href, ...props }) {
      const isInternal =
        href &&
        (href.startsWith('/') ||
          (typeof window !== 'undefined' &&
            href.includes(window.location.host)));
      return (
        <a
          href={href}
          onClick={
            isInternal
              ? (e) => {
                  e.preventDefault();
                  navigate(href);
                }
              : undefined
          }
          target={isInternal ? undefined : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          {...props}
        >
          {children}
        </a>
      );
    },
    table({ node: _node, children, ...props }) {
      return <table {...props}>{children}</table>;
    },
  };
}

function renderFragments(fragments, mdComponents) {
  const rendered = [];
  let textBuffer = '';

  const flushText = (key) => {
    if (textBuffer) {
      rendered.push(
        <ReactMarkdown
          key={key}
          remarkPlugins={[remarkGfm]}
          components={mdComponents}
        >
          {textBuffer}
        </ReactMarkdown>,
      );
      textBuffer = '';
    }
  };

  fragments.forEach((f, i) => {
    if (f.kind === 'text') {
      textBuffer += f.content;
    } else if (f.kind === 'source_ref') {
      flushText(`text-before-${i}`);
      rendered.push(
        <span
          key={`badge-${i}`}
          className={`${styles.sbadge} ${getBadgeClass(f.source)}`}
        >
          {BADGE_ICONS[f.source]} {f.label}
        </span>,
      );
    }
  });

  flushText('text-final');
  return rendered;
}

// Same logic as SourceCards — docs URLs are relative, others are absolute.
const resolveUrl = (url, source) => {
  if (!url) return '#';
  if (source !== 'docs') return url;
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/docs/${url}`;
};

/** Inline mini source card for mobile */
function MiniSourceCard({ card }) {
  const getIconClass = (source) => {
    switch (source) {
      case 'docs':
        return styles.srcCardIconDocs;
      case 'storybook':
        return styles.srcCardIconStorybook;
      case 'marketplace':
        return styles.srcCardIconMarketplace;
      case 'academy':
        return styles.srcCardIconAcademy;
      default:
        return styles.srcCardIconDocs;
    }
  };
  const IconComponent = SOURCE_ICONS[card.source] || DocsIcon;

  return (
    <a
      className={styles.srcCard}
      href={resolveUrl(card.url, card.source)}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize: '11px' }}
    >
      <div className={styles.srcCardHeader}>
        <div className={`${styles.srcCardIcon} ${getIconClass(card.source)}`}>
          <IconComponent width="16" height="16" />
        </div>
        <div className={styles.srcCardMeta}>
          <div className={styles.srcCardSource}>
            {card.source.charAt(0).toUpperCase() + card.source.slice(1)}
          </div>
          <div className={styles.srcCardTitle}>{card.title}</div>
        </div>
      </div>
      {card.excerpt && <div className={styles.srcCardBody}>{card.excerpt}</div>}
    </a>
  );
}

export default function AIConversation({
  messages,
  isStreaming,
  currentFragments,
  currentTraceSteps,
  activeMessageId,
  onSelectMessage,
  onFollowup,
  onAction,
  onFeedback,
}) {
  const history = useHistory();
  const mdComponents = useMemo(
    () => buildMarkdownComponents((url) => history.push(url)),
    [history],
  );
  const scrollRef = useRef(null);
  // Mobile: only one message's sources can be expanded at a time
  const [expandedMobileId, setExpandedMobileId] = useState(null);
  const [feedbackPromptId, setFeedbackPromptId] = useState(null);
  const [feedbackReasonByMessage, setFeedbackReasonByMessage] = useState({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentFragments, currentTraceSteps]);

  const toggleMobileSources = (msgId) => {
    setExpandedMobileId((prev) => (prev === msgId ? null : msgId));
  };

  const selectFeedbackReason = (msgId, reason) => {
    setFeedbackReasonByMessage((prev) => ({ ...prev, [msgId]: reason }));
  };

  const submitNegativeFeedback = async (msgId, reason = null) => {
    const success = await onFeedback(msgId, { helpful: false, reason });
    if (success) {
      setFeedbackPromptId((prev) => (prev === msgId ? null : prev));
    }
  };

  return (
    <>
      <div
        className={styles.conversationScroll}
        ref={scrollRef}
        aria-live="polite"
      >
        {messages.map((msg, idx) => {
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className={styles.msgUser}>
                <div className={styles.msgUserBubble}>{msg.content}</div>
              </div>
            );
          }

          const isActive = activeMessageId === msg.id;
          const sourceCount = msg.sourceCards?.length || 0;
          const uniqueSources = sourceCount > 0
            ? [...new Set(msg.sourceCards.map((c) => c.source))]
            : [];
          const selectedReason = feedbackReasonByMessage[msg.id] || null;
          const showFeedbackPrompt =
            feedbackPromptId === msg.id && msg.feedbackStatus !== 'submitted';
          const canRateMessage =
            msg.traceId &&
            !isStreaming &&
            msg.feedbackStatus !== 'submitted' &&
            msg.feedbackStatus !== 'submitting';

          return (
            <React.Fragment key={msg.id}>
              {/* Trace block (Only show when streaming) */}
              {isStreaming && isActive && currentTraceSteps.length > 0 && (
                <div className={styles.agentTrace}>
                  <div className={styles.traceLineActive}>
                    <div className={styles.traceDot} />
                    Searching sources...
                  </div>
                </div>
              )}

              {/* AI response — clickable to select as active */}
              <div
                className={`${styles.msgAi} ${isActive ? styles.msgAiActive : ''}`}
                onClick={() => onSelectMessage(msg.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectMessage(msg.id)}
              >
                <div className={styles.agentIconCircle }>
                    <img src="/img/icon/doc-ai-agent.svg" alt="AI"  onError={(e) => { e.target.style.display='none'; }} />
                    <span className={styles.agentName}>Docs AI Agent</span>
                  </div>
                <div className={styles.aiText}>
                  {msg.fragments
                    ? renderFragments(msg.fragments, mdComponents)
                    : msg.content}
                </div>
              </div>

             
              {/* Mobile inline source cards */}
              {expandedMobileId === msg.id && msg.sourceCards && (
                <div className={styles.mobileSourceCards}>
                  {msg.sourceCards.map((card, ci) => (
                    <MiniSourceCard key={ci} card={card} />
                  ))}
                </div>
              )}

              {/* Quick actions */}
              {msg.actions && msg.actions.length > 0 && (
                <div className={styles.quickActions}>
                  {msg.actions.map((a, j) => {
                    let actionClass = styles.qaBtn;
                    let icon = <DocsIcon width="14" height="14" />;

                    if (a.url?.includes('marketplace')) {
                      actionClass = `${styles.qaBtn} ${styles.qaBtnMarketplace}`;
                      icon = <MarketplaceIcon width="14" height="14" />;
                    } else if (a.url?.includes('storybook')) {
                      actionClass = `${styles.qaBtn} ${styles.qaBtnStorybook}`;
                      icon = <StorybookIcon width="14" height="14" />;
                    } else if (a.url?.includes('academy')) {
                      actionClass = `${styles.qaBtn} ${styles.qaBtnAcademy}`;
                      icon = <AcademyIcon width="14" height="14" />;
                    } else if (a.url?.includes('/docs/')) {
                      actionClass = `${styles.qaBtn} ${styles.qaBtnDocs}`;
                      icon = <DocsIcon width="14" height="14" />;
                    }

                    return (
                      <button
                        key={j}
                        className={actionClass}
                        onClick={() => onAction(a.url)}
                      >
                        <span className={styles.qaBtnIcon}>{icon}</span>
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {msg.traceId && (
                <div className={styles.feedbackBar}>
                  {uniqueSources.length > 0 && (
                    <button
                      type="button"
                      className={styles.sourcesToggleBtn}
                      onClick={(e) => { e.stopPropagation(); toggleMobileSources(msg.id); }}
                      aria-label="Toggle sources"
                    >
                      <div className={styles.sourcesIconStack}>
                        {uniqueSources.slice(0, 3).map((src) => {
                          const Icon = SOURCE_ICONS[src];
                          return Icon ? (
                            <div key={src} className={`${styles.sourcesIconBubble} ${styles[`sourcesIconBubble_${src}`]}`}>
                              <Icon width="12" height="12" />
                            </div>
                          ) : null;
                        })}
                      </div>
                      <span>Sources</span>
                    </button>
                  )}
                  {msg.feedbackStatus === 'submitted' ? (
                    <div className={styles.feedbackThanks}>
                      <span className={styles.feedbackThanksIcon}>
                        {msg.feedbackHelpful ? '👍' : '👎'}
                      </span>
                      <span>
                        Thanks
                        {!msg.feedbackHelpful && msg.feedbackReason
                          ? ` · ${FEEDBACK_REASONS.find((item) => item.value === msg.feedbackReason)?.label || msg.feedbackReason}`
                          : ''}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className={styles.feedbackActions}>
                        <button
                          type="button"
                          className={styles.feedbackBtn}
                          onClick={() => onFeedback(msg.id, { helpful: true })}
                          disabled={!canRateMessage}
                          title="Helpful"
                          aria-label="Mark as helpful"
                        >
                          👍
                        </button>
                        <button
                          type="button"
                          className={styles.feedbackBtn}
                          onClick={() =>
                            setFeedbackPromptId((prev) =>
                              prev === msg.id ? null : msg.id,
                            )
                          }
                          disabled={msg.feedbackStatus === 'submitting'}
                          title="Not helpful"
                          aria-label="Mark as not helpful"
                        >
                          👎
                        </button>
                      </div>

                      {showFeedbackPrompt && (
                        <div className={styles.feedbackPrompt}>
                          <div className={styles.feedbackPromptLabel}>
                            What went wrong?
                          </div>
                          <div className={styles.feedbackReasonChips}>
                            {FEEDBACK_REASONS.map((reason) => (
                              <button
                                key={reason.value}
                                type="button"
                                className={`${styles.feedbackChip} ${
                                  selectedReason === reason.value
                                    ? styles.feedbackChipActive
                                    : ''
                                }`}
                                onClick={() =>
                                  selectFeedbackReason(msg.id, reason.value)
                                }
                              >
                                {reason.label}
                              </button>
                            ))}
                          </div>
                          <div className={styles.feedbackPromptActions}>
                            <button
                              type="button"
                              className={styles.feedbackLinkBtn}
                              onClick={() => submitNegativeFeedback(msg.id)}
                              disabled={msg.feedbackStatus === 'submitting'}
                            >
                              Skip
                            </button>
                            <button
                              type="button"
                              className={styles.feedbackSubmitBtn}
                              onClick={() =>
                                submitNegativeFeedback(msg.id, selectedReason)
                              }
                              disabled={msg.feedbackStatus === 'submitting'}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.feedbackStatus === 'failed' && (
                        <div className={styles.feedbackError}>
                          Unable to record feedback. Please try again.
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Suggested follow-up questions */}
              {msg.followups && msg.followups.length > 0 && !isStreaming && (
                <div className={styles.msgFollowups}>
                  <div className={styles.msgFollowupsLabel}>Suggested questions</div>
                  <div className={styles.followupsChips}>
                    {msg.followups.map((f, i) => (
                      <button
                        key={i}
                        className={styles.followupChip}
                        onClick={() => onFollowup(f)}
                        tabIndex={0}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {idx < messages.length - 1 && (
                <div className={styles.convDivider} />
              )}
            </React.Fragment>
          );
        })}

        {/* Thinking steps — shown while waiting for first text fragment */}
        {isStreaming && (
          <ThinkingSteps
            messages={messages}
            isStreaming={isStreaming}
            traceSteps={currentTraceSteps}
            hasFragments={currentFragments.length > 0}
          />
        )}

        {/* Streaming text — shown once fragments start arriving */}
        {isStreaming && currentFragments.length > 0 && (
          <div className={styles.msgAi}>
            <div className={styles.agentHeader}>
              <div className={styles.agentIconCircle}>
                <img src="/img/icon/AskAI-Icon.svg" alt="AI" width="18" height="18" onError={(e) => { e.target.style.display='none'; }} />
              </div>
              <span className={styles.agentName}>Docs AI Agent</span>
            </div>
            <div className={styles.aiText}>
              {renderFragments(currentFragments, mdComponents)}
              <span className={styles.streamCursor} />
            </div>
          </div>
        )}
      </div>

    </>
  );
}
