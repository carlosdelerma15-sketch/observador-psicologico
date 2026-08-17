import React, { useMemo } from 'react';
import { evaluationCategories, getCategoryAverage } from '../data/evaluationSchema';
import { getEvaluationsForPlayer } from '../utils/storage';

export default function HistoryTable({ playerId }) {
  const evaluations = useMemo(
    () => getEvaluationsForPlayer(playerId).slice(0, 8),
    [playerId]
  );

  if (evaluations.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 Historial y Evolución</h3>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-text">Sin evaluaciones registradas</p>
          <p className="empty-state-hint">
            Las evaluaciones aparecerán aquí una vez guardadas
          </p>
        </div>
      </div>
    );
  }

  const categoriesWithMetrics = evaluationCategories.filter(
    (c) => c.metrics.length > 0
  );

  const getValueStyle = (val) => {
    if (val <= 3) return { color: '#ef4444' };
    if (val <= 5) return { color: '#f59e0b' };
    if (val <= 7) return { color: '#3b82f6' };
    return { color: '#22c55e' };
  };

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h3 className="card-title">📊 Historial y Evolución</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
          Últimas {evaluations.length} evaluaciones
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Sesión</th>
              {categoriesWithMetrics.map((cat) => (
                <th key={cat.id} style={{ color: cat.color }}>
                  {cat.icon} {cat.label.split(' ')[0]}
                </th>
              ))}
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evalItem) => {
              const categoryAvgs = categoriesWithMetrics.map((cat) =>
                getCategoryAverage(evalItem, cat.id)
              );
              const overallAvg =
                categoryAvgs.reduce((s, v) => s + (v || 0), 0) /
                categoryAvgs.filter((v) => v !== null).length;

              return (
                <tr key={evalItem.id}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {evalItem.evalDate}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background:
                          evalItem.sessionType === 'Partido'
                            ? 'rgba(238, 37, 35, 0.15)'
                            : 'rgba(59, 130, 246, 0.15)',
                        color:
                          evalItem.sessionType === 'Partido'
                            ? '#ee2523'
                            : '#3b82f6',
                      }}
                    >
                      {evalItem.sessionType}
                    </span>
                  </td>
                  {categoryAvgs.map((avg, i) => (
                    <td
                      key={i}
                      style={{
                        fontWeight: 700,
                        fontFamily: 'Outfit, sans-serif',
                        ...getValueStyle(avg),
                      }}
                    >
                      {avg !== null ? avg.toFixed(1) : '—'}
                    </td>
                  ))}
                  <td
                    style={{
                      fontWeight: 700,
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '0.95rem',
                      ...getValueStyle(overallAvg),
                    }}
                  >
                    {overallAvg.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
