/**
 * Custom SearchBar that extends the default Algolia DocSearch
 * Adds an "Ask AI" option within the search results
 */
import { useCallback, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DocSearchButton } from '@docsearch/react/button';
import { useDocSearchKeyboardEvents } from '@docsearch/react/useDocSearchKeyboardEvents';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import {
  isRegexpStringMatch,
  useSearchLinkCreator,
} from '@docusaurus/theme-common';
import {
  useAlgoliaContextualFacetFilters,
  useSearchResultUrlProcessor,
  mergeFacetFilters,
} from '@docusaurus/theme-search-algolia/client';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import translations from '@theme/SearchTranslations';

// New AI components
import { useAIChat } from './useAIChat';
import AIConversation from './AIConversation';
import SourceCards from './SourceCards';
import EmptyState from './EmptyState';
import askAiStyles from './styles.module.css';
import { DocsIcon } from './SourceIcons';

// Default API URL for ecosystem agent
const DEFAULT_API_URL = 'http://localhost:8000';

// Global flag to prevent multiple DocSearch modals from opening
let globalModalOpen = false;

/**
 * Helper: get page context for AI conversation
 */
function getPageContext() {
  if (typeof document === 'undefined') {
    return {
      pageTitle: '',
      pageSlug: '',
      pageCategory: '',
      pageHeadings: [],
      pageSummary: '',
    };
  }
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);

  // Extract headings from the article content
  const article =
    document.querySelector('article') || document.querySelector('.markdown');
  const headings = [];
  if (article) {
    article.querySelectorAll('h2, h3').forEach((h) => {
      const text = h.textContent?.trim();
      if (text) headings.push(text);
    });
  }

  // Extract a brief content summary (first ~300 chars of article text)
  let pageSummary = '';
  if (article) {
    const firstParagraphs = article.querySelectorAll('p');
    const parts = [];
    for (const p of firstParagraphs) {
      parts.push(p.textContent?.trim() || '');
      // if (parts.join(' ').length > 300) break;
    }
    // pageSummary = parts.join(' ').slice(0, 500);
    pageSummary = parts.join(' ');
  }

  return {
    // pageTitle: document.title?.replace(/ \| .*$/, '') || '',
    pageTitle:
      document.URL.match(/\/docs\/(.+)/)?.[1]
        ?.split('/')
        .map((p) =>
          p.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        )
        .join(' > ') || '',
    pageSlug: path,
    pageCategory: segments[0] || '',
    pageHeadings: headings.slice(0, 15),
    pageSummary,
  };
}

let DocSearchModal = null;

function importDocSearchModalIfNeeded() {
  if (DocSearchModal) {
    return Promise.resolve();
  }
  return Promise.all([
    import('@docsearch/react/modal'),
    import('@docsearch/react/style'),
    import('./styles.css'),
  ]).then(([{ DocSearchModal: Modal }]) => {
    DocSearchModal = Modal;
  });
}

function useNavigator({ externalUrlRegex }) {
  const history = useHistory();
  const [navigator] = useState(() => ({
    navigate(params) {
      if (isRegexpStringMatch(externalUrlRegex, params.itemUrl)) {
        window.location.href = params.itemUrl;
      } else {
        history.push(params.itemUrl);
      }
    },
  }));
  return navigator;
}

function useTransformSearchClient() {
  const {
    siteMetadata: { docusaurusVersion },
  } = useDocusaurusContext();
  return useCallback(
    (searchClient) => {
      searchClient.addAlgoliaAgent('docusaurus', docusaurusVersion);
      return searchClient;
    },
    [docusaurusVersion],
  );
}

function useTransformItems(props) {
  const processSearchResultUrl = useSearchResultUrlProcessor();
  const [transformItems] = useState(
    () => (items) =>
      props.transformItems
        ? props.transformItems(items)
        : items.map((item) => ({
            ...item,
            url: processSearchResultUrl(item.url),
          })),
  );
  return transformItems;
}

function Hit({ hit, children }) {
  return <Link to={hit.url}>{children}</Link>;
}

function ResultsFooter({ state, onClose }) {
  const createSearchLink = useSearchLinkCreator();
  return (
    <Link to={createSearchLink(state.query)} onClick={onClose}>
      <Translate
        id="theme.SearchBar.seeAll"
        values={{ count: state.context.nbHits }}
      >
        {'See all {count} results'}
      </Translate>
    </Link>
  );
}

function useSearchParameters({ contextualSearch, ...props }) {
  const contextualSearchFacetFilters = useAlgoliaContextualFacetFilters();
  const configFacetFilters = props.searchParameters?.facetFilters ?? [];
  const facetFilters = contextualSearch
    ? mergeFacetFilters(contextualSearchFacetFilters, configFacetFilters)
    : configFacetFilters;
  return {
    ...props.searchParameters,
    facetFilters,
  };
}

/**
 * Ask AI Panel — uses new ecosystem agent components
 * Renders two-column layout: conversation (left) + source cards (right)
 */
function AskAIPanel({
  query,
  apiUrl,
  onClose: _onClose,
  isVisible,
  triggerSearch,
}) {
  const pageContext = getPageContext();
  const chat = useAIChat(pageContext, apiUrl);
  const chatInputRef = useRef(null);
  const [chatInput, setChatInput] = useState('');

  // Listen for manual trigger (e.g. Enter key from DocSearch input)
  useEffect(() => {
    if (isVisible && triggerSearch > 0 && query && !chat.isStreaming) {
      chat.sendMessage(query);
    }
  }, [triggerSearch]);

  const hasMessages = chat.messages.length > 0 || chat.isStreaming;

  // Hide DocSearch top form ONLY when AI tab is active AND has messages
  const shouldHideForm = hasMessages && isVisible;
  useEffect(() => {
    const form = document.querySelector('.DocSearch-Form');
    if (!form) return;
    if (shouldHideForm) {
      form.classList.add('DocSearch-Form--hidden');
    } else {
      form.classList.remove('DocSearch-Form--hidden');
    }
    // Focus bottom input when chat activates
    if (shouldHideForm && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
    // Always clean up on unmount or when switching away
    return () => {
      form.classList.remove('DocSearch-Form--hidden');
    };
  }, [shouldHideForm]);

  const handleChatSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const text = chatInput.trim();
      if (!text || chat.isStreaming) return;
      chat.sendMessage(text);
      setChatInput('');
    },
    [chatInput, chat],
  );

  const handleClearHistory = useCallback(() => {
    chat.clearHistory();
    setChatInput('');
  }, [chat]);

  const handleFollowup = useCallback(
    (text) => {
      chat.sendMessage(text);
    },
    [chat],
  );

  const handleAction = useCallback((url) => {
    window.open(url, '_blank', 'noopener');
  }, []);

  // Compute active source cards — per-message, not accumulated
  const assistantMessages = chat.messages.filter((m) => m.role === 'assistant');
  const totalAssistantMessages = assistantMessages.length;

  let activeCards = [];
  let activeIndex = 0;
  let activeQuestion = '';

  if (chat.activeMessageId === '__streaming__') {
    activeCards = chat.currentSourceCards;
    activeIndex = totalAssistantMessages + 1;
    // The last user message is the current question
    const lastUser = [...chat.messages]
      .reverse()
      .find((m) => m.role === 'user');
    activeQuestion = lastUser?.content || '';
  } else if (chat.activeMessageId) {
    const activeMsg = assistantMessages.find(
      (m) => m.id === chat.activeMessageId,
    );
    if (activeMsg) {
      activeCards = activeMsg.sourceCards || [];
      const msgIdx = chat.messages.findIndex(
        (m) => m.id === chat.activeMessageId,
      );
      activeIndex =
        assistantMessages.findIndex((m) => m.id === chat.activeMessageId) + 1;
      // Find the user message just before this assistant message
      for (let i = msgIdx - 1; i >= 0; i--) {
        if (chat.messages[i].role === 'user') {
          activeQuestion = chat.messages[i].content;
          break;
        }
      }
    }
  }

  const handlePrevMessage = useCallback(() => {
    const idx = assistantMessages.findIndex(
      (m) => m.id === chat.activeMessageId,
    );
    if (idx > 0) {
      chat.setActiveMessageId(assistantMessages[idx - 1].id);
    }
  }, [assistantMessages, chat]);

  const handleNextMessage = useCallback(() => {
    const idx = assistantMessages.findIndex(
      (m) => m.id === chat.activeMessageId,
    );
    if (idx < assistantMessages.length - 1) {
      chat.setActiveMessageId(assistantMessages[idx + 1].id);
    }
  }, [assistantMessages, chat]);

  return (
    <div className="DocSearch-AskAI-Fullscreen">
      {/* Context banner */}
      {pageContext.pageTitle && (
        <div className={askAiStyles.contextBanner}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zm.75 7a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
          <span>
            <strong>Context:</strong> {pageContext.pageTitle}
          </span>
          <span className={askAiStyles.contextPageTag}>
            {pageContext.pageCategory || 'docs'}
          </span>
        </div>
      )}

      {/* Two-column layout */}
      <div className={askAiStyles.modalBody}>
        {/* Left column: conversation + bottom input */}
        <div className={askAiStyles.conversationCol}>
          {hasMessages ? (
            <AIConversation
              messages={chat.messages}
              isStreaming={chat.isStreaming}
              currentFragments={chat.currentFragments}
              currentTraceSteps={chat.currentTraceSteps}
              followups={chat.followups}
              activeMessageId={chat.activeMessageId}
              onSelectMessage={chat.setActiveMessageId}
              onFollowup={handleFollowup}
              onAction={handleAction}
            />
          ) : (
            <EmptyState
              onSelect={(q) => chat.sendMessage(q)}
              pageContext={pageContext}
              apiUrl={apiUrl}
            />
          )}

          {/* Bottom chat input — inside conversation column */}
          {hasMessages && (
            <form
              className={askAiStyles.chatInputBar}
              onSubmit={handleChatSubmit}
            >
              <input
                ref={chatInputRef}
                className={askAiStyles.chatInputField}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a follow-up..."
                disabled={chat.isStreaming}
                autoComplete="off"
              />
              <button
                type="submit"
                className={askAiStyles.chatSendBtn}
                disabled={!chatInput.trim() || chat.isStreaming}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
              <button
                type="button"
                className={askAiStyles.chatClearBtn}
                onClick={handleClearHistory}
                title="Clear history"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
            </form>
          )}
        </div>

        {/* Source cards panel (right column) — per active message */}
        {hasMessages && (
          <SourceCards
            cards={activeCards}
            activeIndex={activeIndex}
            activeQuestion={activeQuestion}
            totalMessages={
              chat.isStreaming
                ? totalAssistantMessages + 1
                : totalAssistantMessages
            }
            onPrev={handlePrevMessage}
            onNext={handleNextMessage}
          />
        )}
      </div>

      {/* Footer with keyboard hints (only in empty state) */}
      {!hasMessages && (
        <div className={askAiStyles.modalFooter}>
          <div className={askAiStyles.kbdHint}>
            <kbd className={askAiStyles.kbd}>↵</kbd> to send
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Custom Modal Wrapper that adds Ask AI
 */
function CustomDocSearchModal({ onClose, apiUrl, ...props }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'ask-ai'
  const [triggerSearch, setTriggerSearch] = useState(0);

  // Refs to avoid re-creating MutationObserver on every keystroke
  const queryRef = useRef(query);
  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Listen for query changes from DocSearch — stable effect, runs once
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const input = document.querySelector('.DocSearch-Input');
      if (input && input.value !== queryRef.current) {
        setQuery(input.value);
      }
    });

    const container = document.querySelector('.DocSearch-Container');
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // Also listen for input events
    const handleInput = (e) => {
      if (e.target.classList.contains('DocSearch-Input')) {
        setQuery(e.target.value);
      }
    };

    const handleKeyDown = (e) => {
      if (e.target.classList.contains('DocSearch-Input') && e.key === 'Enter') {
        if (activeTabRef.current === 'ask-ai') {
          // Prevent DocSearch form submission
          e.preventDefault();
          e.stopPropagation();
          setTriggerSearch((prev) => prev + 1);
        }
      }
    };

    document.addEventListener('input', handleInput);
    document.addEventListener('keydown', handleKeyDown, true); // Capture phase to prevent DocSearch default

    return () => {
      observer.disconnect();
      document.removeEventListener('input', handleInput);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <>
      <DocSearchModal onClose={onClose} {...props} />
      {/* Inject Tabs into Header */}
      <SearchTabsPortal activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Inject Ask AI panel via portal */}
      <AskAIPortal
        query={query}
        apiUrl={apiUrl}
        onClose={onClose}
        activeTab={activeTab}
        triggerSearch={triggerSearch}
      />
    </>
  );
}

/**
 * Portal to inject tabs into the Search Header
 */
function SearchTabsPortal({ activeTab, setActiveTab }) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const ensureContainer = () => {
      const form = document.querySelector('.DocSearch-Form');
      if (!form) return;

      // Check if our container exists
      let tabsContainer = document.querySelector('.DocSearch-Tabs-Container');

      if (!tabsContainer) {
        tabsContainer = document.createElement('div');
        tabsContainer.className = 'DocSearch-Tabs-Container';
        // Append after the form (search input) in the header
        form.parentElement.appendChild(tabsContainer);
      }

      setContainer(tabsContainer);
    };

    // Retry a few times as Modal renders
    const interval = setInterval(ensureContainer, 50);
    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, []);

  if (!container) return null;

  return createPortal(
    <div className="DocSearch-Tabs">
      <button
        className={`DocSearch-Tab ${activeTab === 'search' ? 'DocSearch-Tab--active' : ''}`}
        onClick={() => setActiveTab('search')}
      >
        Search
      </button>
      <button
        className={`DocSearch-Tab ${activeTab === 'ask-ai' ? 'DocSearch-Tab--active' : ''}`}
        onClick={() => setActiveTab('ask-ai')}
      >
        <svg
          className="DocSearch-Tab-Icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 2L11.5 7.5L17 9L11.5 10.5L10 16L8.5 10.5L3 9L8.5 7.5L10 2Z" />
          <path d="M18 12L19 15L22 16L19 17L18 20L17 17L14 16L17 15L18 12Z" />
        </svg>
        Ask AI
      </button>
    </div>,
    container,
  );
}

/**
 * Portal to inject Ask AI into DocSearch results
 */
function AskAIPortal({ query, apiUrl, onClose, activeTab, triggerSearch }) {
  const [container, setContainer] = useState(null);
  const containerRef = useRef(null);

  // Handle visibility of Search Dropdown vs AI Panel using class-based approach
  useEffect(() => {
    const modal = document.querySelector('.DocSearch-Modal');
    const dropdown = document.querySelector('.DocSearch-Dropdown');
    const footer = document.querySelector('.DocSearch-Footer');
    const askAiContainer = document.querySelector('.DocSearch-AskAI-Container');

    if (modal) {
      if (activeTab === 'ask-ai') {
        modal.classList.add('DocSearch-AskAI-Active');
      } else {
        modal.classList.remove('DocSearch-AskAI-Active');
      }
    }

    if (dropdown) {
      dropdown.style.display = activeTab === 'ask-ai' ? 'none' : '';
    }

    if (footer) {
      footer.style.display = activeTab === 'ask-ai' ? 'none' : '';
    }

    if (askAiContainer) {
      askAiContainer.style.display = activeTab === 'ask-ai' ? 'flex' : 'none';
    }
  }, [activeTab]);

  useEffect(() => {
    // Function to find or create the Ask AI container
    const ensureContainer = () => {
      // Find the modal - container must be INSIDE this
      const modal = document.querySelector('.DocSearch-Modal');
      if (!modal) return;

      let askAiContainer = document.querySelector('.DocSearch-AskAI-Container');

      if (!askAiContainer) {
        askAiContainer = document.createElement('div');
        askAiContainer.className = 'DocSearch-AskAI-Container';
        askAiContainer.style.display = 'none'; // Hidden by default

        // Insert after the dropdown (or at end of modal)
        const dropdown = modal.querySelector('.DocSearch-Dropdown');
        if (dropdown) {
          dropdown.after(askAiContainer);
        } else {
          modal.appendChild(askAiContainer);
        }
      }

      if (containerRef.current !== askAiContainer) {
        containerRef.current = askAiContainer;
        setContainer(askAiContainer);
      }
    };

    // Initial check
    ensureContainer();
    const interval = setInterval(ensureContainer, 100);
    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, []);

  if (!container) return null;

  // unless we want persistence. Let's keep it mounted but hidden for persistence.
  return createPortal(
    <div
      style={{
        display: activeTab === 'ask-ai' ? 'flex' : 'none',
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <AskAIPanel
        query={query}
        apiUrl={apiUrl}
        onClose={onClose}
        isVisible={activeTab === 'ask-ai'}
        triggerSearch={triggerSearch}
      />
    </div>,
    container,
  );
}

function DocSearch({ externalUrlRegex, ...props }) {
  const { siteConfig } = useDocusaurusContext();
  const apiUrl = siteConfig?.customFields?.ecosystemAgentUrl || DEFAULT_API_URL;

  const navigator = useNavigator({ externalUrlRegex });
  const searchParameters = useSearchParameters({ ...props });
  const transformItems = useTransformItems(props);
  const transformSearchClient = useTransformSearchClient();
  const searchContainer = useRef(null);
  const searchButtonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState(undefined);

  const prepareSearchContainer = useCallback(() => {
    if (!searchContainer.current) {
      const divElement = document.createElement('div');
      searchContainer.current = divElement;
      document.body.insertBefore(divElement, document.body.firstChild);
    }
  }, []);

  const openModal = useCallback(() => {
    // Prevent opening if another modal is already open (multiple SearchBar instances)
    if (globalModalOpen) return;
    globalModalOpen = true;
    prepareSearchContainer();
    importDocSearchModalIfNeeded().then(() => setIsOpen(true));
  }, [prepareSearchContainer]);

  const closeModal = useCallback(() => {
    globalModalOpen = false;
    setIsOpen(false);
    searchButtonRef.current?.focus();
    setInitialQuery(undefined);
  }, []);

  const handleInput = useCallback(
    (event) => {
      if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
        return;
      }
      event.preventDefault();
      setInitialQuery(event.key);
      openModal();
    },
    [openModal],
  );

  const resultsFooterComponent = useCallback(
    ({ state }) => <ResultsFooter state={state} onClose={closeModal} />,
    [closeModal],
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen: openModal,
    onClose: closeModal,
    onInput: handleInput,
    searchButtonRef,
  });

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href={`https://${props.appId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
      </Head>

      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={openModal}
        ref={searchButtonRef}
        translations={props.translations?.button ?? translations.button}
      />

      {isOpen &&
        DocSearchModal &&
        searchContainer.current &&
        createPortal(
          <CustomDocSearchModal
            onClose={closeModal}
            apiUrl={apiUrl}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            transformSearchClient={transformSearchClient}
            {...(props.searchPagePath && { resultsFooterComponent })}
            {...props}
            translations={props.translations?.modal ?? translations.modal}
            searchParameters={searchParameters}
          />,
          searchContainer.current,
        )}
    </>
  );
}

export default function SearchBar() {
  const { siteConfig } = useDocusaurusContext();
  return <DocSearch {...siteConfig.themeConfig.algolia} />;
}
