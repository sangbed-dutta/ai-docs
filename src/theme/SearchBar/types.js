/**
 * Shared types as JSDoc for the search modal
 * @typedef {'docs' | 'storybook' | 'marketplace' | 'academy'} SourceType
 * @typedef {'search' | 'ai'} SearchMode
 *
 * @typedef {Object} SourceCard
 * @property {string} source
 * @property {string} title
 * @property {string} excerpt
 * @property {string} url
 * @property {Object} [meta]
 *
 * @typedef {Object} TraceStep
 * @property {string} step
 * @property {'searching' | 'done'} status
 *
 * @typedef {Object} QuickAction
 * @property {string} label
 * @property {string} url
 * @property {'default' | 'primary'} variant
 *
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {string} [traceId]
 * @property {Array} [fragments]
 * @property {TraceStep[]} [traceSteps]
 * @property {SourceCard[]} [sourceCards]
 * @property {string[]} [followups]
 * @property {QuickAction[]} [actions]
 * @property {'idle' | 'submitting' | 'submitted' | 'failed'} [feedbackStatus]
 * @property {boolean | null} [feedbackHelpful]
 * @property {string | null} [feedbackReason]
 * @property {number} timestamp
 *
 * @typedef {Object} PageContext
 * @property {string} pageTitle
 * @property {string} pageSlug
 * @property {string} pageCategory
 */

export {};
