import React, { useRef, useEffect } from 'react';
import { drawSpiderChart, setupHiDPI } from '../utils/chartHelpers';

export default function SpiderChart({ data, size = 300, showLabels = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length < 3) return;

    const labelMargin = showLabels ? 60 : 10;
    const fullSize = size + labelMargin * 2;
    const ctx = setupHiDPI(canvas, fullSize, fullSize);

    ctx.clearRect(0, 0, fullSize, fullSize);

    drawSpiderChart(ctx, {
      data,
      centerX: fullSize / 2,
      centerY: fullSize / 2,
      radius: size / 2 - 10,
      maxValue: 10,
      showLabels,
      fillColor: 'rgba(238, 37, 35, 0.12)',
      strokeColor: '#ee2523',
      gridColor: 'rgba(148, 163, 184, 0.12)',
      labelColor: '#94a3b8',
      dotColor: '#ee2523',
      fontSize: 10,
    });
  }, [data, size, showLabels]);

  if (!data || data.length < 3) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <div className="empty-state-icon">📊</div>
        <p className="empty-state-text">Se necesitan al menos 3 métricas</p>
      </div>
    );
  }

  const labelMargin = showLabels ? 60 : 10;
  const fullSize = size + labelMargin * 2;

  return (
    <div className="spider-chart-container">
      <canvas ref={canvasRef} style={{ width: fullSize, height: fullSize }} />
    </div>
  );
}
