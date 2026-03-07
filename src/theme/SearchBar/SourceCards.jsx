import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { SOURCE_ICONS, DocsIcon } from './SourceIcons';

const getPlatform = (meta) => {
  const p = meta?.path || meta?.url_path || '';
  if (p.includes('/mobile/')) return 'mobile';
  if (p.includes('/web/')) return 'web';
  return null;
};

// Docs URLs are relative paths (e.g. "user-interfaces/web/...");
// academy/marketplace/storybook are already absolute.
const resolveUrl = (url, source) => {
  if (!url) return '#';
  if (source !== 'docs') return url; // absolute already
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/docs/${url}`;
};

const ICON_CLASS = {
  docs: 'srcCardIconDocs',
  storybook: 'srcCardIconStorybook',
  marketplace: 'srcCardIconMarketplace',
  academy: 'srcCardIconAcademy',
};

function ChunkRow({ chunk, isAcademy, onVideoOpen }) {
  const [hovered, setHovered] = useState(false);

  const rowTitle = chunk.meta?.section_title || chunk.title || 'Section';
  const timeBadge =
    isAcademy && chunk.meta?.display_time ? chunk.meta.display_time : null;
  // For docs: resolve relative path to /docs/... For academy: url is already absolute.
  const chunkHref = resolveUrl(
    chunk.meta?.url_path || chunk.url,
    chunk.source || (isAcademy ? 'academy' : 'docs'),
  );
  const excerpt = chunk.excerpt || '';

  const handleClick = (e) => {
    if (isAcademy && chunk.meta?.embed_link) {
      e.preventDefault();
      let embedUrl = chunk.meta.embed_link;
      if (chunk.meta.start_timestamp) {
        const sep = embedUrl.includes('?') ? '&' : '?';
        embedUrl = `${embedUrl}${sep}start=${chunk.meta.start_timestamp}`;
      }
      onVideoOpen(embedUrl);
    }
  };

  return (
    <a
      href={chunkHref}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.chunkRow}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.chunkRowInner}>
        <div className={styles.chunkRowTitle}>
          {timeBadge && (
            <span className={styles.timestampBadge}>{timeBadge}</span>
          )}
          <span className={styles.chunkRowTitleText}>{rowTitle}</span>
        </div>
        {!isAcademy && <span className={styles.chunkRowArrow}>↗</span>}
      </div>
      {excerpt && hovered && (
        <div
          className={styles.chunkRowExcerpt}
          style={{ maxHeight: '100px', opacity: 1, marginTop: '5px' }}
        >
          {excerpt}
        </div>
      )}
    </a>
  );
}

function GroupCard({ group }) {
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  const isAcademy = group.source === 'academy';
  const IconComponent = SOURCE_ICONS[group.source] || DocsIcon;
  const iconClass = styles[ICON_CLASS[group.source] || 'srcCardIconDocs'];

  const displayTitle = group.platform
    ? `${group.title} · ${group.platform === 'mobile' ? 'Mobile' : 'Web'}`
    : group.title;

  const chunkLabel = isAcademy
    ? group.chunks.length === 1
      ? 'timestamp'
      : 'timestamps'
    : group.chunks.length === 1
      ? 'section'
      : 'sections';

  return (
    <div className={styles.groupedCard}>
      <div className={styles.groupedCardHeader}>
        <div className={`${styles.srcCardIcon} ${iconClass}`}>
          <IconComponent width="20" height="20" />
        </div>
        <div className={styles.srcCardMeta}>
          <div className={styles.srcCardSource}>
            {group.source.charAt(0).toUpperCase() + group.source.slice(1)}
            <span className={styles.chunkCountBadge}>
              {group.chunks.length} {chunkLabel}
            </span>
          </div>
          <div className={styles.srcCardTitle}>
            {group.url ? (
              <a
                href={resolveUrl(group.url, group.source)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {displayTitle}
              </a>
            ) : (
              displayTitle
            )}
          </div>
        </div>
      </div>

      {activeVideoUrl && (
        <div className={styles.inlinePlayerWrapper}>
          <div className={styles.inlinePlayerHeader}>
            <span>Now Playing</span>
            <button
              onClick={() => setActiveVideoUrl(null)}
              aria-label="Close Video"
            >
              ✕
            </button>
          </div>
          <iframe
            src={activeVideoUrl}
            allowFullScreen
            className={styles.inlinePlayer}
            title="Academy Video Player"
          />
        </div>
      )}

      <div className={styles.chunkList}>
        {group.chunks.map((chunk, idx) => (
          <ChunkRow
            key={idx}
            chunk={chunk}
            isAcademy={isAcademy}
            onVideoOpen={setActiveVideoUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default function SourceCards({
  cards,
  activeIndex,
  totalMessages,
  onPrev,
  onNext,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [cards]);

  // GROUPING LOGIC: group chunks by parent_doc_id
  const groupedCardsMap = cards.reduce((acc, card) => {
    const parentId =
      card.meta?.parent_doc_id ||
      card.url ||
      `fallback-${card.title}-${Math.random()}`;
    if (!acc[parentId]) {
      acc[parentId] = {
        id: parentId,
        source: card.source || 'docs',
        title: card.title || 'Source',
        url: card.url,
        platform: getPlatform(card.meta),
        chunks: [],
      };
    }
    acc[parentId].chunks.push(card);
    return acc;
  }, {});

  const groupedCards = Object.values(groupedCardsMap).map((group) => {
    group.chunks.sort((a, b) => {
      const scoreA = a.meta?.relevanceScore ?? 0;
      const scoreB = b.meta?.relevanceScore ?? 0;
      return scoreB - scoreA;
    });
    return group;
  });

  const navHeader = (
    <div className={styles.sourcesNavHeader}>
      <span className={styles.sourcesNavLabel}>
        {cards.length > 0 ? `Sources · Q${activeIndex}` : 'Sources'}
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
  );

  if (cards.length === 0) {
    return (
      <div className={styles.sourcesCol}>
        {navHeader}
        <div className={styles.sourcesColScroll} ref={scrollRef}>
          <div className={styles.sourcesEmpty}>
            Sources will appear here after you ask a question.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sourcesCol}>
      {navHeader}
      <div className={styles.sourcesColScroll} ref={scrollRef}>
        {groupedCards.map((group, i) => (
          <GroupCard key={group.id || i} group={group} />
        ))}
      </div>
    </div>
  );
}
