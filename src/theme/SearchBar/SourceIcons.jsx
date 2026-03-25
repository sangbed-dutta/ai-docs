import React from 'react';

export const DocsIcon = ({
  width = '1em',
  height = '1em',
  className = '',
  style = {},
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={width}
    height={height}
    className={className}
    style={style}
  >
    <style>
      {`
        .d-draw { stroke-dasharray: 30; stroke-dashoffset: 30; animation: d-write 3s infinite ease-in-out; }
        .d1 { animation-delay: 0s; }
        .d2 { animation-delay: 0.4s; }
        .d3 { stroke-dasharray: 20; stroke-dashoffset: 20; animation-delay: 0.8s; }
        @keyframes d-write {
          0% { stroke-dashoffset: 30; opacity: 0; }
          20%, 80% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -30; opacity: 0; }
        }
      `}
    </style>
    <rect
      x="12"
      y="6"
      width="40"
      height="52"
      rx="4"
      fill="none"
      stroke="var(--ifm-color-dark, #18181B)"
      strokeWidth="4"
    />
    <line
      x1="20"
      y1="20"
      x2="44"
      y2="20"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className="d-draw d1"
    />
    <line
      x1="20"
      y1="32"
      x2="44"
      y2="32"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className="d-draw d2"
    />
    <line
      x1="20"
      y1="44"
      x2="36"
      y2="44"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className="d-draw d3"
    />
  </svg>
);

export const StorybookIcon = ({
  width = '1em',
  height = '1em',
  className = '',
  style = {},
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    <style>{`
    .float-ui { animation: float 3s infinite ease-in-out; transform-origin: center; }
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); fill: #FF4785; }
      50% { transform: translateY(-3px) scale(1.05); fill: #FF73A1; } /* Slightly lighter pink for the pulse */
    }
  `}</style>
    <rect
      x="6"
      y="10"
      width="52"
      height="44"
      rx="4"
      fill="none"
      stroke="var(--ifm-color-dark, #18181B)"
      stroke-width="4"
    />
    <line
      x1="22"
      y1="10"
      x2="22"
      y2="54"
      stroke="var(--ifm-color-dark, #18181B)"
      stroke-width="4"
    />
    <line
      x1="12"
      y1="20"
      x2="16"
      y2="20"
      stroke="var(--ifm-color-dark, #18181B)"
      stroke-width="4"
      stroke-linecap="round"
    />
    <line
      x1="12"
      y1="28"
      x2="16"
      y2="28"
      stroke="var(--ifm-color-dark, #18181B)"
      stroke-width="4"
      stroke-linecap="round"
    />
    <rect x="30" y="20" width="20" height="12" rx="3" class="float-ui" />
    <line
      x1="30"
      y1="42"
      x2="48"
      y2="42"
      stroke="var(--ifm-font-color-muted, #4A4A4A)"
      stroke-width="4"
      stroke-linecap="round"
    />
  </svg>
);

export const MarketplaceIcon = ({
  width = '1em',
  height = '1em',
  className = '',
  style = {},
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    <style>{`
    .bounce { animation: bag-bounce 2.5s infinite cubic-bezier(0.28, 0.84, 0.42, 1); transform-origin: center bottom; }
    @keyframes bag-bounce {
      0%, 100% { transform: scaleY(1) translateY(0); }
      10% { transform: scaleY(0.9) translateY(2px); }
      25% { transform: scaleY(1.05) translateY(-6px); }
      40% { transform: scaleY(1) translateY(0); }
    }
  `}</style>
    <g class="bounce">
      <path
        d="M14 24 L50 24 L54 56 L10 56 Z"
        fill="none"
        stroke="var(--ifm-color-dark, #18181B)"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path
        d="M24 24 V14 C24 8 40 8 40 14 V24"
        fill="none"
        stroke="var(--ifm-color-tertiary, #097FD5)"
        stroke-width="4"
        stroke-linecap="round"
      />
      <circle cx="32" cy="40" r="4" fill="var(--ifm-color-tertiary, #097FD5)" />
    </g>
  </svg>
);

export const AcademyIcon = ({
  width = '1em',
  height = '1em',
  className = '',
  style = {},
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="64"
    height="64"
  >
    <style>{`
    .swing { animation: pendulum 2s infinite ease-in-out; transform-origin: 32px 24px; }
    @keyframes pendulum {
      0%, 100% { transform: rotate(15deg); }
      50% { transform: rotate(-15deg); }
    }
  `}</style>
    <path
      d="M8 24 L32 12 L56 24 L32 36 Z"
      fill="none"
      stroke="var(--ifm-color-dark, #18181B)"
      stroke-width="4"
      stroke-linejoin="round"
    />
    <path
      d="M18 30 V46 C18 53 46 53 46 46 V30"
      fill="none"
      stroke="var(--ifm-color-dark, #18181B)"
      stroke-width="4"
      stroke-linecap="round"
    />
    <g class="swing">
      <line
        x1="32"
        y1="24"
        x2="46"
        y2="40"
        stroke="var(--ifm-color-blue-brand, #433FED)"
        stroke-width="3"
        stroke-linecap="round"
      />
      <circle
        cx="47"
        cy="42"
        r="3"
        fill="var(--ifm-color-blue-brand, #433FED)"
      />
    </g>
    <circle cx="32" cy="24" r="3" fill="var(--ifm-color-dark, #18181B)" />
  </svg>
);

export const SOURCE_ICONS = {
  docs: DocsIcon,
  storybook: StorybookIcon,
  marketplace: MarketplaceIcon,
  academy: AcademyIcon,
};
