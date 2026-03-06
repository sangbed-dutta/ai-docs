import React from 'react';
import {
  Globe,
  Smartphone,
  Monitor,
  Server,
  Layers,
  Palette,
} from 'lucide-react';
import './Pills.css';

const pillConfig = {
  // web: { icon: Globe, label: 'Web' },
  web: { icon: Monitor, label: 'Web' },
  mobile: { icon: Smartphone, label: 'Mobile' },
  desktop: { icon: Monitor, label: 'Desktop' },
  android: { icon: Smartphone, label: 'Android' },
  ios: { icon: Smartphone, label: 'iOS' },
  backend: { icon: Server, label: 'Backend' },
  platform: { icon: Layers, label: 'Platform' },
  design: { icon: Palette, label: 'Design' },
};

export function Pill({ type, text, icon: CustomIcon, children }) {
  const preset = pillConfig[type?.toLowerCase()] || {};
  const IconComponent = CustomIcon || preset.icon;
  const displayText = text || preset.label || children || type;

  const typeClass = type ? `wm-pill-${type.toLowerCase()}` : 'wm-pill-default';

  return (
    <span className={`wm-pill ${typeClass}`}>
      {IconComponent && (
        <span className="wm-pill-icon">
          <IconComponent size={12} strokeWidth={2.5} />
        </span>
      )}
      {displayText && <span className="wm-pill-text">{displayText}</span>}
    </span>
  );
}
