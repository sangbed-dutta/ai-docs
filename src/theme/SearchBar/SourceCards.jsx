import { useEffect, useRef } from 'react';
import styles from './styles.module.css';

const SOURCE_ICONS = {
  docs: '📄',
  storybook: '◈',
  marketplace: '⬡',
  academy: '✦',
};

const SOURCE_CTA = {
  docs: 'View in Docs',
  storybook: 'Open in Storybook',
  marketplace: 'Install from Marketplace',
  academy: 'View course',
};

function getIconClass(source) {
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
}

export default function SourceCards({
  cards,
  activeIndex,
  totalMessages,
  onPrev,
  onNext,
}) {
  const scrollRef = useRef(null);

  // Reset scroll position when active message changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [cards]);

  if (cards.length === 0) {
    return (
      <div className={styles.sourcesCol}>
        <div className={styles.sourcesNavHeader}>
          <span className={styles.sourcesNavLabel}>
            {totalMessages > 0 ? `Sources · Q${activeIndex}` : 'Sources'}
          </span>
          {totalMessages > 1 && (
            <div className={styles.sourcesNavArrows}>
              <button
                className={styles.sourcesNavArrow}
                onClick={onPrev}
                disabled={activeIndex <= 1}
                aria-label="Previous message sources"
              >
                ←
              </button>
              <button
                className={styles.sourcesNavArrow}
                onClick={onNext}
                disabled={activeIndex >= totalMessages}
                aria-label="Next message sources"
              >
                →
              </button>
            </div>
          )}
        </div>
        <div className={styles.sourcesColScroll} ref={scrollRef}>
          <div className={styles.sourcesEmpty}>
            {totalMessages > 0
              ? 'No sources for this message.'
              : 'Sources will appear here after you ask a question.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sourcesCol}>
      <div className={styles.sourcesNavHeader}>
        <span className={styles.sourcesNavLabel}>Sources · Q{activeIndex}</span>
        {totalMessages > 1 && (
          <div className={styles.sourcesNavArrows}>
            <button
              className={styles.sourcesNavArrow}
              onClick={onPrev}
              disabled={activeIndex <= 1}
              aria-label="Previous message sources"
            >
              ←
            </button>
            <button
              className={styles.sourcesNavArrow}
              onClick={onNext}
              disabled={activeIndex >= totalMessages}
              aria-label="Next message sources"
            >
              →
            </button>
          </div>
        )}
      </div>
      <div className={styles.sourcesColScroll} ref={scrollRef}>
        {cards.map((card, i) => {
          const props = card.meta?.props;

          return (
            <a
              key={i}
              className={styles.srcCard}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.srcCardHeader}>
                <div
                  className={`${styles.srcCardIcon} ${getIconClass(card.source)}`}
                >
                  {SOURCE_ICONS[card.source] || '📄'}
                </div>
                <div className={styles.srcCardMeta}>
                  <div className={styles.srcCardSource}>
                    {card.source.charAt(0).toUpperCase() + card.source.slice(1)}
                  </div>
                  <div className={styles.srcCardTitle}>{card.title}</div>
                </div>
              </div>
              {props && props.length > 0 ? (
                <div className={styles.srcCardBody}>
                  <table className={styles.propTable}>
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>Type</th>
                        <th>Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.map((p, j) => (
                        <tr key={j}>
                          <td>{p.name}</td>
                          <td>{p.type}</td>
                          <td>{p.default}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                card.excerpt && (
                  <div className={styles.srcCardBody}>{card.excerpt}</div>
                )
              )}
              <div
                className={styles.srcCardAction}
                style={
                  card.source === 'marketplace'
                    ? { color: 'var(--purple)' }
                    : undefined
                }
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M6 3l6 5-6 5V3z" />
                </svg>
                {SOURCE_CTA[card.source] || 'View'}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
