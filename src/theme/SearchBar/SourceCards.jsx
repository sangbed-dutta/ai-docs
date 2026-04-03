import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './AIConverstion.module.css';
import { SOURCE_ICONS} from './SourceIcons';

// ── Video modal dialog ────────────────────────────────────────
function VideoModal({ url, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return createPortal(
    <div className={styles.videoModalOverlay} onClick={onClose}>
      <div className={styles.videoModalBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.videoModalClose} onClick={onClose} aria-label="Close video">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe
          src={url}
          allowFullScreen
          className={styles.videoModalIframe}
          title="Academy Video Player"
        />
      </div>
    </div>,
    document.body,
  );
}

const getPlatform = (meta) => {
  const p = meta?.path || meta?.url_path || '';
  if (p.includes('/mobile/')) return 'mobile';
  if (p.includes('/web/')) return 'web';
  return null;
};

const resolveUrl = (url, source) => {
  if (!url) return '#';
  if (source !== 'docs') return url;
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/docs/${url}`;
};

const SOURCE_ORDER = { docs: 1, academy: 2, storybook: 3, marketplace: 4 };

const SOURCE_LABELS = {
  docs: 'DOCS',
  academy: 'ACADEMY',
  storybook: 'STORYBOOK',
  marketplace: 'MARKETPLACE',
};

const SOURCE_COLORS = {
  docs: '#1b7be4',
  academy: '#433fed',
  storybook: '#ff4785',
  marketplace: '#097fd5',
};

// ── Chevron icon ─────────────────────────────────────────────
function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── DOCS: flat link list ──────────────────────────────────────
function DocLinkList({ groups }) {
  return (
    <div className={styles.docLinkList}>
      {groups.map((group) =>
        group.chunks.map((chunk, ci) => {
          const href = resolveUrl(chunk.meta?.url_path || chunk.url, 'docs');
          const label = chunk.meta?.section_title || chunk.title || 'Section';
          const isFirst = ci === 0;
          return (
            <a
              key={`${group.id}-${ci}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.docLink} ${isFirst && ci === 0 && groups.indexOf(group) === 0 ? styles.docLinkActive : ''}`}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.docLinkIcon}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className={styles.docLinkText}>{label}</span>
            </a>
          );
        }),
      )}
    </div>
  );
}

// ── ACADEMY: video card + timestamps ─────────────────────────
function AcademyVideoCard({ group, onVideoOpen }) {
  const buildEmbedUrl = (chunk, withTimestamp = true) => {
    if (!chunk?.meta?.embed_link) return null;
    let url = chunk.meta.embed_link;
    if (withTimestamp && chunk.meta.start_timestamp) {
      url += (url.includes('?') ? '&' : '?') + `t=${chunk.meta.start_timestamp}`;
    }
    return url;
  };

  const handleThumbnailPlay = () => {
    const firstChunk = group.chunks[0];
    const url = buildEmbedUrl(firstChunk, false);
    if (url) onVideoOpen(url);
  };

  const handleTimestampPlay = (e, chunk) => {
    const url = buildEmbedUrl(chunk, true);
    if (url) {
      e.preventDefault();
      onVideoOpen(url);
    }
    // else: let the default href open (external link fallback)
  };

  const hasThumbnailPlay = !!group.chunks[0]?.meta?.embed_link;

  return (
    <div className={styles.academyCard}>
      {/* Thumbnail — clickable if embed available */}
      <div
        className={`${styles.academyThumbnail} ${hasThumbnailPlay ? styles.academyThumbnailClickable : ''}`}
        onClick={hasThumbnailPlay ? handleThumbnailPlay : undefined}
        role={hasThumbnailPlay ? 'button' : undefined}
        tabIndex={hasThumbnailPlay ? 0 : undefined}
        onKeyDown={hasThumbnailPlay ? (e) => e.key === 'Enter' && handleThumbnailPlay() : undefined}
        aria-label={hasThumbnailPlay ? `Play ${group.title}` : undefined}
      >
        <div className={styles.academyThumbnailPlaceholder}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" fill="white" opacity="0.9" />
          </svg>
        </div>
        <div className={styles.academyCardInfo}>
          <span className={styles.academyCardTitle}>{group.title}</span>
        </div>
      </div>

      {/* Timestamps */}
      {group.chunks.map((chunk, idx) => {
        const timeBadge = chunk.meta?.display_time;
        const label = chunk.meta?.section_title || chunk.title || 'Section';
        const href = resolveUrl(chunk.meta?.url_path || chunk.url, 'academy');
        return (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.academyTimestampRow}
            onClick={(e) => handleTimestampPlay(e, chunk)}
          >
            {timeBadge && (
              <span className={styles.timestampTag}>{timeBadge}</span>
            )}
            <span className={styles.academyTimestampLabel}>{label}</span>
            <span className={styles.academyPlayBtn}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play
            </span>
          </a>
        );
      })}
    </div>
  );
}

// ── Per-source accordion section ──────────────────────────────
function SourceSection({ source, groups, defaultOpen, onVideoOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const IconComponent = SOURCE_ICONS[source] || DocsIcon;
  const color = SOURCE_COLORS[source] || '#6b7280';
  const isAcademy = source === 'academy';

  return (
    <div className={styles.sourceSection}>
      <button
        className={styles.sourceSectionHeader}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <div
          className={styles.sourceSectionIcon}
          style={{ background: `${color}18`, color }}
        >
          <IconComponent width="14" height="14" />
        </div>
        <span className={styles.sourceSectionLabel}>{SOURCE_LABELS[source] || source.toUpperCase()}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className={styles.sourceSectionContent}>
          {isAcademy
            ? groups.map((group) => (
                <AcademyVideoCard
                  key={group.id}
                  group={group}
                  onVideoOpen={onVideoOpen}
                />
              ))
            : <DocLinkList groups={groups} />}
        </div>
      )}
    </div>
  );
}

// ── Main SourceCards export ───────────────────────────────────
export default function SourceCards({
  cards,
  activeIndex,
  activeQuestion,
  totalMessages,
  isLoading,
  onPrev,
  onNext,
}) {
  const scrollRef = useRef(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [cards]);

  // Group by parent_doc_id within each source
  const bySource = {};
  cards.forEach((card) => {
    const src = card.source || 'docs';
    if (!bySource[src]) bySource[src] = {};
    const parentId = card.meta?.parent_doc_id || card.url || `fallback-${card.title}-${Math.random()}`;
    if (!bySource[src][parentId]) {
      bySource[src][parentId] = {
        id: parentId,
        source: src,
        title: card.title || 'Source',
        url: card.url,
        platform: getPlatform(card.meta),
        chunks: [],
      };
    }
    bySource[src][parentId].chunks.push(card);
  });

  // Sorted sources
  const sortedSources = Object.keys(bySource).sort(
    (a, b) => (SOURCE_ORDER[a] || 99) - (SOURCE_ORDER[b] || 99),
  );

  const navHeader = (
    <div className={styles.sourcesNavHeader}>
      <div className={styles.sourcesNavTop}>
        <span className={styles.sourcesNavLabel}>SOURCES</span>
      </div>
      {activeQuestion && (
        <div className={styles.sourcesNavQuestion}>{activeQuestion}</div>
      )}
    </div>
  );

  if (cards.length === 0) {
    return (
      <div className={styles.sourcesCol}>
        {navHeader}
        <div className={`${styles.sourcesColScroll} ${styles.sourcesColCenter}`} ref={scrollRef}>
          {isLoading ? (
            <div className={styles.sourcesLoadingState}>
              <div className={styles.sourcesSpinner} />
              <span className={styles.sourcesLoadingText}>Gathering sources…</span>
            </div>
          ) : (
            <div className={styles.sourcesEmpty}>
              Sources will appear here after you ask a question.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sourcesCol}>
      {navHeader}
      <div className={styles.sourcesColScroll} ref={scrollRef}>
        {sortedSources.map((source) => {
          const groups = Object.values(bySource[source]);
          const defaultOpen = source === 'docs' || source === 'academy';
          return (
            <SourceSection
              key={source}
              source={source}
              groups={groups}
              defaultOpen={defaultOpen}
              onVideoOpen={setActiveVideoUrl}
            />
          );
        })}
      </div>
      {activeVideoUrl && (
        <VideoModal url={activeVideoUrl} onClose={() => setActiveVideoUrl(null)} />
      )}
    </div>
  );
}
