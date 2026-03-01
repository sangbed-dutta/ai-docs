import React, { useEffect, useRef } from 'react';
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

function getDotClass(source) {
  switch (source) {
    case 'docs':
      return styles.srcChipDotDocs;
    case 'storybook':
      return styles.srcChipDotStorybook;
    case 'marketplace':
      return styles.srcChipDotMarketplace;
    case 'academy':
      return styles.srcChipDotAcademy;
    default:
      return styles.srcChipDotDocs;
  }
}

/** Custom markdown components for rendering inside the AI panel */
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

/** Render fragments: markdown text blocks + inline source badges */
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

export default function AIConversation({
  messages,
  isStreaming,
  currentFragments,
  currentTraceSteps,
  followups,
  activeActions: _activeActions,
  onFollowup,
  onAction,
}) {
  const scrollRef = useRef(null);

  // Auto-scroll on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentFragments, currentTraceSteps]);

  return (
    <div className={styles.conversationCol}>
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

          // Assistant message
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

              {/* AI response */}
              <div className={styles.msgAi}>
                <div className={styles.aiRow}>
                  <div className={styles.aiIcon}>W</div>
                  <div className={styles.aiText}>
                    {msg.fragments
                      ? renderFragments(msg.fragments)
                      : msg.content}
                  </div>
                </div>
              </div>

              {/* Sources row */}
              {msg.sourceCards && msg.sourceCards.length > 0 && (
                <div className={styles.sourcesRow}>
                  <span style={{ fontSize: '11px', color: 'var(--text4)' }}>
                    From:
                  </span>
                  {[...new Set(msg.sourceCards.map((c) => c.source))].map(
                    (src) => (
                      <div key={src} className={styles.srcChip}>
                        <div
                          className={`${styles.srcChipDot} ${getDotClass(src)}`}
                        />
                        <span>
                          {src.charAt(0).toUpperCase() + src.slice(1)}
                        </span>
                      </div>
                    ),
                  )}
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

              {/* Divider between exchanges */}
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
              <div className={styles.msgAi}>
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
    </div>
  );
}
