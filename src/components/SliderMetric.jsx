import React from 'react';

export default function SliderMetric({ id, label, value, onChange, color = '#ee2523' }) {
  const percentage = (value / 10) * 100;

  const getValueColor = (val) => {
    if (val <= 3) return '#ef4444';
    if (val <= 5) return '#f59e0b';
    if (val <= 7) return '#3b82f6';
    return '#22c55e';
  };

  const displayColor = color || getValueColor(value);

  return (
    <div className="slider-group" id={`slider-${id}`}>
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value" style={{ color: getValueColor(value) }}>
          {value}
        </span>
      </div>
      <div className="slider-container">
        <div className="slider-bg" />
        <div
          className="slider-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${displayColor}88, ${displayColor})`,
            borderRadius: '3px',
          }}
        />
        <input
          type="range"
          className="slider-input"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          style={{
            position: 'relative',
            zIndex: 2,
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
