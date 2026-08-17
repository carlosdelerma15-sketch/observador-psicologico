import React, { useRef, useEffect } from 'react';
import { drawLineChart, setupHiDPI } from '../utils/chartHelpers';
import { evaluationCategories, getCategoryAverage } from '../data/evaluationSchema';
import { getEvaluationsForPlayer } from '../utils/storage';

export default function LineChart({ playerId, width = 600, height = 280 }) {
  const canvasRef = useRef(null);
  const evaluations = getEvaluationsForPlayer(playerId).slice(0, 8).reverse();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || evaluations.length === 0) return;

    const ctx = setupHiDPI(canvas, width, height);
    ctx.clearRect(0, 0, width, height);

    const categoriesWithMetrics = evaluationCategories.filter(
      (c) => c.metrics.length > 0
    );

    const data = evaluations.map((evalItem) => ({
      date: evalItem.evalDate,
      values: Object.fromEntries(
        categoriesWithMetrics.map((cat) => [
          cat.id,
          getCategoryAverage(evalItem, cat.id),
        ])
      ),
    }));

    const keys = categoriesWithMetrics.map((cat) => ({
      id: cat.id,
      label: cat.label,
      color: cat.color,
    }));

    drawLineChart(ctx, {
      data,
      keys,
      width,
      height,
      padding: { top: 20, right: 20, bottom: 40, left: 40 },
    });
  }, [evaluations, width, height]);

  if (evaluations.length === 0) {
    return null;
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h3 className="card-title">📈 Tendencia de Evolución</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas ref={canvasRef} style={{ width, height, maxWidth: '100%' }} />
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
        {evaluationCategories
          .filter((c) => c.metrics.length > 0)
          .map((cat) => (
            <div
              key={cat.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem',
                color: 'var(--slate-400)',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 3,
                  background: cat.color,
                  borderRadius: 2,
                  display: 'inline-block',
                }}
              />
              {cat.icon} {cat.label.split(' ')[0]}
            </div>
          ))}
      </div>
    </div>
  );
}
