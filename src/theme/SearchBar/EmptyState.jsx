import styles from './styles.module.css';

const STARTERS_BY_CATEGORY = {
  'ui-components': [
    { icon: '🔗', text: 'How do I bind a form to a REST API variable?' },
    { icon: '📁', text: 'What components are available for file upload?' },
    { icon: '🔐', text: 'How do I add Twilio OTP to my login form?' },
    { icon: '🎨', text: 'How to apply a design system from Marketplace?' },
  ],
  widgets: [
    { icon: '📊', text: 'How to use the Data Table widget?' },
    { icon: '📝', text: 'How to create a multi-step wizard form?' },
    { icon: '🔍', text: 'How to add search and filter to a list?' },
    { icon: '📱', text: 'How to make widgets responsive on mobile?' },
  ],
  deployment: [
    { icon: '🚀', text: 'How to deploy a WaveMaker app to AWS?' },
    { icon: '🔧', text: 'How to configure CI/CD for WaveMaker?' },
    { icon: '📦', text: 'How to build a WAR file for deployment?' },
    { icon: '☁️', text: 'How to set up WaveMaker on Azure?' },
  ],
  default: [
    { icon: '🔗', text: 'How do I bind a form to a REST API variable?' },
    { icon: '📁', text: 'What components are available for file upload?' },
    { icon: '🔐', text: 'How do I add Twilio OTP to my login form?' },
    { icon: '🎨', text: 'How to apply a design system from Marketplace?' },
  ],
};

function getCategoryFromPath(category) {
  if (!category) return 'default';
  const lower = category.toLowerCase();
  if (
    lower.includes('widget') ||
    lower.includes('ui') ||
    lower.includes('component')
  )
    return 'ui-components';
  if (lower.includes('deploy') || lower.includes('build')) return 'deployment';
  return 'default';
}

export default function EmptyState({ onSelect, pageCategory }) {
  const key = getCategoryFromPath(pageCategory);
  const starters = STARTERS_BY_CATEGORY[key] || STARTERS_BY_CATEGORY.default;

  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyGreeting}>
        Ask anything — I'll search across <strong>Docs</strong>,{' '}
        <strong>Storybook</strong>, <strong>Marketplace</strong>, and{' '}
        <strong>Academy</strong> to give you the best answer.
      </div>
      <div className={styles.startersLabel}>Try asking</div>
      <div className={styles.startersGrid}>
        {starters.map((s, i) => (
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
