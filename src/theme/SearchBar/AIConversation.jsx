import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DocusaurusCodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

const BADGE_ICONS = {
  docs: '●',
  storybook: '◈',
  marketplace: '⬡',
  academy: '✦',
};

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

const markdownComponents = {
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
        (typeof window !== 'undefined' && href.includes(window.location.host)));
    return (
      <a
        href={href}
        onClick={
          isInternal
            ? (e) => {
                e.preventDefault();
                window.location.href = href;
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
    return (
      <table className="md-table" {...props}>
        {children}
      </table>
    );
  },
};

function renderFragments(fragments) {
  const rendered = [];
  let textBuffer = '';

  const flushText = (key) => {
    if (textBuffer) {
      rendered.push(
        <ReactMarkdown
          key={key}
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
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
  const icons = { docs: '📄', storybook: '◈', marketplace: '⬡', academy: '✦' };

  return (
    <a
      className={styles.srcCard}
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize: '11px' }}
    >
      <div className={styles.srcCardHeader}>
        <div className={`${styles.srcCardIcon} ${getIconClass(card.source)}`}>
          {icons[card.source] || '📄'}
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
  followups,
  activeMessageId,
  onSelectMessage,
  onFollowup,
  onAction,
}) {
  const scrollRef = useRef(null);
  // Mobile: only one message's sources can be expanded at a time
  const [expandedMobileId, setExpandedMobileId] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentFragments, currentTraceSteps]);

  const toggleMobileSources = (msgId) => {
    setExpandedMobileId((prev) => (prev === msgId ? null : msgId));
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

          return (
            <React.Fragment key={msg.id}>
              {/* Trace block */}
              {msg.traceSteps && msg.traceSteps.length > 0 && (
                <div className={styles.agentTrace}>
                  {msg.traceSteps.map((t, j) => (
                    <div
                      key={j}
                      className={`${styles.traceLine} ${
                        t.status === 'done'
                          ? styles.traceLineDone
                          : styles.traceLineActive
                      }`}
                    >
                      <div className={styles.traceDot} />
                      {t.step}
                    </div>
                  ))}
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
                <div className={styles.aiRow}>
                  <div className={styles.aiIcon}>W</div>
                  <div className={styles.aiText}>
                    {msg.fragments
                      ? renderFragments(msg.fragments)
                      : msg.content}
                  </div>
                </div>
              </div>

              {/* Source count badge (desktop only, hidden on mobile via CSS) */}
              {sourceCount > 0 && (
                <div
                  className={styles.sourceCountBadge}
                  onClick={() => onSelectMessage(msg.id)}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2 3h12v1.5H2zM2 7h12v1.5H2zM2 11h8v1.5H2z" />
                  </svg>
                  {sourceCount} source{sourceCount !== 1 ? 's' : ''}
                </div>
              )}

              {/* Mobile inline source toggle (shown only on mobile via CSS) */}
              {sourceCount > 0 && (
                <button
                  className={styles.mobileSourceToggle}
                  onClick={() => toggleMobileSources(msg.id)}
                >
                  Sources ({sourceCount}){' '}
                  {expandedMobileId === msg.id ? '▾' : '▸'}
                </button>
              )}

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
                  {msg.actions.map((a, j) => (
                    <button
                      key={j}
                      className={`${styles.qaBtn} ${
                        a.variant === 'primary' ? styles.qaBtnPrimary : ''
                      }`}
                      onClick={() => onAction(a.url)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Divider */}
              {idx < messages.length - 1 && (
                <div className={styles.convDivider} />
              )}
            </React.Fragment>
          );
        })}

        {/* Currently streaming response */}
        {isStreaming && (
          <>
            {currentTraceSteps.length > 0 && (
              <div className={styles.agentTrace}>
                {currentTraceSteps.map((t, j) => (
                  <div
                    key={j}
                    className={`${styles.traceLine} ${
                      t.status === 'done'
                        ? styles.traceLineDone
                        : styles.traceLineActive
                    }`}
                  >
                    <div className={styles.traceDot} />
                    {t.step}
                  </div>
                ))}
              </div>
            )}

            {currentFragments.length > 0 && (
              <div className={`${styles.msgAi} ${styles.msgAiActive}`}>
                <div className={styles.aiRow}>
                  <div className={styles.aiIcon}>W</div>
                  <div className={styles.aiText}>
                    {renderFragments(currentFragments)}
                    <span className={styles.streamCursor} />
                  </div>
                </div>
              </div>
            )}

            {currentFragments.length === 0 && (
              <div className={styles.msgAi}>
                <div className={`${styles.aiRow} ${styles.thinkingRow}`}>
                  <div className={styles.aiIcon}>W</div>
                  <div className={styles.dots}>
                    <span className={styles.dotsSpan} />
                    <span className={styles.dotsSpan} />
                    <span className={styles.dotsSpan} />
                  </div>
                  <span className={styles.thinkingText}>Thinking…</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Follow-up chips */}
      {followups.length > 0 && !isStreaming && (
        <div className={styles.followups}>
          <div className={styles.followupsLabel}>Follow up</div>
          <div className={styles.followupsChips}>
            {followups.map((f, i) => (
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
    </>
  );
}
