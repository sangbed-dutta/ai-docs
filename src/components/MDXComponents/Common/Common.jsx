import './Common.css';

export function WaveMakerAIHeading({ children, scale = 1 }) {
  return (
    <div
      className="wm-ai-heading"
      style={{
        '--wm-ai-scale': scale,
      }}
    >
      <span className="wm-ai-heading-text">
        WaveMaker <span className="ai-bold">AI</span>
      </span>
      <span className="wm-ai-heading-children">{children}</span>
    </div>
  );
}
