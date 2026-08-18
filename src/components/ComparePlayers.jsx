import React, { useState, useRef, useEffect, useMemo } from 'react';
import { players, getPlayerById, getInitials, STATUS_COLORS } from '../data/players';
import { getLatestEvaluation, getEvaluationsForPlayer } from '../utils/storage';
import { evaluationCategories, getAllCategoryAverages } from '../data/evaluationSchema';
import { drawMultiSpiderChart, setupHiDPI } from '../utils/chartHelpers';

const PLAYER_COLORS = ['#ee2523', '#3b82f6', '#22c55e'];

function MultiSpiderChart({ datasets, size = 320 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !datasets || datasets.length === 0) return;

    const fullSize = size + 100;
    const ctx = setupHiDPI(canvas, fullSize, fullSize);
    ctx.clearRect(0, 0, fullSize, fullSize);

    drawMultiSpiderChart(ctx, {
      datasets,
      centerX: fullSize / 2,
      centerY: fullSize / 2,
      radius: size / 2 - 10,
      maxValue: 10,
      fontSize: 10,
    });
  }, [datasets, size]);

  if (!datasets || datasets.length === 0) return null;
  const fullSize = size + 100;

  return (
    <div className="spider-chart-container" style={{ position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: fullSize, height: fullSize }} />
    </div>
  );
}

export default function ComparePlayers() {
  const [selectedIds, setSelectedIds] = useState([1, 7, 13]); // Default 3 players

  const togglePlayer = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return; // Keep at least 1
      setSelectedIds(selectedIds.filter((pId) => pId !== id));
    } else {
      if (selectedIds.length >= 3) return; // Max 3
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedPlayers = useMemo(
    () => selectedIds.map((id) => getPlayerById(id)).filter(Boolean),
    [selectedIds]
  );

  // Formatear datos para el spider chart comparativo
  const spiderDatasets = useMemo(() => {
    return selectedPlayers.map((player, index) => {
      const latestEval = getLatestEvaluation(player.id);
      const categoryAvgs = getAllCategoryAverages(latestEval || {});
      return {
        label: player.shortName,
        color: PLAYER_COLORS[index % PLAYER_COLORS.length],
        data: categoryAvgs,
      };
    });
  }, [selectedPlayers]);

  const categoriesWithMetrics = evaluationCategories.filter((c) => c.metrics.length > 0);

  return (
    <div className="animate-fade-in" style={{ gap: 'var(--space-lg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Selector */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">⚔️ Comparador de Jugadoras (Máximo 3)</h3>
          <span className="card-badge" style={{ background: 'rgba(238, 37, 35, 0.15)', color: '#ee2523' }}>
            {selectedIds.length} / 3 Seleccionadas
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', marginBottom: 'var(--space-md)' }}>
          Selecciona entre 1 y 3 jugadoras para comparar su perfil psicológico, métricas tácticas y estado actual lado a lado.
        </p>

        {/* Player Selector Grid / Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {players.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            const index = selectedIds.indexOf(p.id);
            const color = isSelected ? PLAYER_COLORS[index] : null;

            return (
              <button
                key={p.id}
                onClick={() => togglePlayer(p.id)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.78rem',
                  backgroundColor: isSelected ? color : 'var(--slate-800)',
                  borderColor: isSelected ? color : 'var(--slate-700)',
                  color: isSelected ? '#fff' : 'var(--slate-300)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>#{p.dorsal} {p.shortName}</span>
                {isSelected && <span style={{ fontSize: '0.65rem' }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Comparativas de Jugadoras */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${selectedPlayers.length}, 1fr)`,
          gap: 'var(--space-md)',
        }}
      >
        {selectedPlayers.map((player, index) => {
          const color = PLAYER_COLORS[index];
          const latestEval = getLatestEvaluation(player.id);
          const evalsCount = getEvaluationsForPlayer(player.id).length;

          return (
            <div
              key={player.id}
              className="card"
              style={{
                borderTop: `4px solid ${color}`,
                background: 'var(--slate-900)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  className="sidebar-item-avatar"
                  style={{ width: 48, height: 48, borderColor: color, fontSize: '0.9rem' }}
                >
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.shortName} />
                  ) : (
                    getInitials(player.shortName)
                  )}
                </div>
                <div>
                  <h4 style={{ color: 'var(--ac-white)', margin: 0 }}>
                    #{player.dorsal} {player.shortName}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: color, fontWeight: 600 }}>
                    {player.position}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Estado: <strong style={{ color: STATUS_COLORS[player.status] }}>{player.status}</strong></div>
                <div>Evaluaciones registradas: <strong>{evalsCount}</strong></div>
                <div>Última evaluación: <strong>{latestEval ? latestEval.evalDate : 'Sin datos'}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlaid Spider Chart Comparativo */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">🕸️ Comparativa de Perfiles Psicológicos</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {selectedPlayers.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: PLAYER_COLORS[i] }} />
              <strong style={{ color: 'var(--ac-white)' }}>#{p.dorsal} {p.shortName}</strong>
            </div>
          ))}
        </div>

        <MultiSpiderChart datasets={spiderDatasets} size={320} />
      </div>

      {/* Tabla Comparativa Detallada Métrica a Métrica */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 Matriz Comparativa de Categorías (0-10)</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Categoría Psicológica</th>
                {selectedPlayers.map((p, i) => (
                  <th key={p.id} style={{ color: PLAYER_COLORS[i], textAlign: 'center' }}>
                    #{p.dorsal} {p.shortName}
                  </th>
                ))}
                <th>Diferencia Máx.</th>
              </tr>
            </thead>
            <tbody>
              {categoriesWithMetrics.map((cat) => {
                const values = selectedPlayers.map((player) => {
                  const latest = getLatestEvaluation(player.id);
                  if (!latest) return 0;
                  const categoryMetrics = cat.metrics.map((m) => latest[m.id] || 0);
                  if (categoryMetrics.length === 0) return 0;
                  return categoryMetrics.reduce((a, b) => a + b, 0) / categoryMetrics.length;
                });

                const maxVal = Math.max(...values);
                const minVal = Math.min(...values);
                const diff = maxVal - minVal;

                return (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 600, color: 'var(--ac-white)' }}>
                      {cat.icon} {cat.label}
                    </td>
                    {values.map((val, idx) => (
                      <td
                        key={idx}
                        style={{
                          textAlign: 'center',
                          fontWeight: 700,
                          fontFamily: 'Outfit, sans-serif',
                          color: PLAYER_COLORS[idx],
                          fontSize: '1rem',
                        }}
                      >
                        {val ? val.toFixed(1) : '—'}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', fontSize: '0.85rem', color: diff > 2 ? '#f59e0b' : 'var(--slate-400)' }}>
                      {diff ? `±${diff.toFixed(1)}` : '0.0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
