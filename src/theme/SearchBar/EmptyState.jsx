import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const FALLBACK_STARTERS = [
  { icon: '🔗', text: 'How do I bind a form to a REST API variable?' },
  { icon: '📁', text: 'What components are available for file upload?' },
  { icon: '🔐', text: 'How do I add Twilio OTP to my login form?' },
  { icon: '🎨', text: 'How to apply a design system from Marketplace?' },
];

const ICONS = ['💡', '🔍', '⚙️', '📦', '🧩', '🚀'];

export default function EmptyState({ onSelect, pageContext, apiUrl }) {
  const [starters, setStarters] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;

    let cancelled = false;
    setLoading(true);

    fetch(`${apiUrl}/api/v1/chat/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: pageContext
          ? {
              pageTitle: pageContext.pageTitle || '',
              pageSlug: pageContext.pageSlug || '',
              pageCategory: pageContext.pageCategory || '',
              pageSummary: pageContext.pageSummary || '',
              pageHeadings: pageContext.pageHeadings || [],
            }
          : null,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch suggestions');
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data.suggestions?.length) {
          setStarters(
            data.suggestions.map((text, i) => ({
              icon: ICONS[i % ICONS.length],
              text,
            })),
          );
        }
      })
      .catch(() => {
        // Silently fall back to static starters
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiUrl, pageContext?.pageSlug]);

  const items = starters || FALLBACK_STARTERS;

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyGreeting}>
        Ask anything — I'll search across <strong>Docs</strong>,{' '}
        <strong>Storybook</strong>, <strong>Marketplace</strong>, and{' '}
        <strong>Academy</strong> to give you the best answer.
      </div>
      <div className={styles.startersLabel}>
        {loading ? 'Loading suggestions…' : 'Try asking'}
      </div>
      <div className={styles.startersGrid}>
        {items.map((s, i) => (
          <button
            key={i}
            className={styles.starterCard}
            onClick={() => onSelect(s.text)}
            tabIndex={0}
          >
            <span className={styles.starterIcon}>{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
