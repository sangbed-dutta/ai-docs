import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import './Tabs.css';

/**
 * TabItem Component
 * Used inside TabsWrapper to define individual tabs.
 */
export function TabItem({ children, name, active }) {
  return (
    <div
      className={`tab-pane ${active ? 'active' : ''}`}
      style={{ display: active ? 'block' : 'none' }}
    >
      {children}
    </div>
  );
}

/**
 * TabsWrapper Component
 * Manages the state and rendering of tabs.
 */
export function TabsWrapper({ children, type }) {
  // Extract children and filter out non-TabItem components if necessary
  const tabs = React.Children.toArray(children).filter(
    (child) => child.props && child.props.name,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const uniqueId = useId();

  if (tabs.length === 0) return null;

  const content = tabs.map((tab, index) => (
    <React.Fragment key={index}>
      {React.cloneElement(tab, { active: activeIndex === index })}
    </React.Fragment>
  ));

  return (
    <div className="tabs-wrapper">
      <div className="tabs-nav">
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={index}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              data-text={tab.props.name}
            >
              {isActive && (
                <motion.div
                  layoutId={`active-tab-${uniqueId}`}
                  className="active-tab-bg"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="tab-btn-text">{tab.props.name}</span>
            </button>
          );
        })}
      </div>
      <div className="tab-content">
        {type === 'release-notes' ? (
          <div className="release-notes-container">{content}</div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
