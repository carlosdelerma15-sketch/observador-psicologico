import React, { useState, useRef, useEffect } from 'react';
import { drawGauge, setupHiDPI } from '../utils/chartHelpers';
import { saveGroupMetric, getGroupMetrics } from '../utils/storage';

const METRICS = [
  { id: 'cohesion', label: 'Cohesión', icon: '🤝', color: '#3b82f6' },
  { id: 'resiliencia', label: 'Resiliencia', icon: '💎', color: '#22c55e' },
  { id: 'comunicacion', label: 'Comunicación', icon: '🗣️', color: '#8b5cf6' },
  { id: 'asimilacion_carga', label: 'Asimilación Carga', icon: '⚖️', color: '#f59e0b' },
];

function GaugeWidget({ value, label, color, size = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPI(canvas, size, size);
    ctx.clearRect(0, 0, size, size);
    drawGauge(ctx, {
      centerX: size / 2,
      centerY: size / 2,
      radius: size / 2 - 16,
      value,
      maxValue: 10,
      label: '',
      color,
    });
  }, [value, color, size]);

  return (
    <div className="gauge-card">
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ac-white)' }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default function GroupMetrics() {
  const [metrics, setMetrics] = useState(getGroupMetrics());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    evalDate: new Date().toISOString().split('T')[0],
    sessionType: 'Entrenamiento',
    cohesion: 5,
    resiliencia: 5,
    comunicacion: 5,
    asimilacion_carga: 5,
    observaciones: '',
  });

  const latestMetric = metrics.length > 0 ? metrics[0] : null;

  const handleSave = () => {
    const saved = saveGroupMetric(form);
    setMetrics(getGroupMetrics());
    setShowForm(false);
    setForm({
      evalDate: new Date().toISOString().split('T')[0],
      sessionType: 'Entrenamiento',
      cohesion: 5,
      resiliencia: 5,
      comunicacion: 5,
      asimilacion_carga: 5,
      observaciones: '',
    });
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">📊 Métricas Colectivas</h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowForm(!showForm)}
            id="btn-new-group-metric"
          >
            {showForm ? '✕ Cancelar' : '+ Nueva Evaluación'}
          </button>
        </div>

        {showForm && (
          <div className="animate-slide-up" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="form-row" style={{ marginBottom: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.evalDate}
                  onChange={(e) => setForm({ ...form, evalDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Sesión</label>
                <select
                  className="form-select"
                  value={form.sessionType}
                  onChange={(e) => setForm({ ...form, sessionType: e.target.value })}
                >
                  <option value="Entrenamiento">Entrenamiento</option>
                  <option value="Partido">Partido</option>
                </select>
              </div>
            </div>

            {METRICS.map((m) => (
              <div className="slider-group" key={m.id}>
                <div className="slider-header">
                  <span className="slider-label">{m.icon} {m.label}</span>
                  <span className="slider-value" style={{ color: m.color }}>
                    {form[m.id]}
                  </span>
                </div>
                <input
                  type="range"
                  className="slider-input"
                  min="0"
                  max="10"
                  value={form[m.id]}
                  onChange={(e) =>
                    setForm({ ...form, [m.id]: parseInt(e.target.value, 10) })
                  }
                />
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Observaciones</label>
              <textarea
                className="form-textarea"
                placeholder="Notas sobre la dinámica grupal..."
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              />
            </div>

            <button className="btn btn-primary" onClick={handleSave}>
              💾 Guardar Métrica Grupal
            </button>
          </div>
        )}

        {/* Gauges */}
        <div className="gauge-grid">
          {METRICS.map((m) => (
            <GaugeWidget
              key={m.id}
              value={latestMetric ? latestMetric[m.id] : 0}
              label={`${m.icon} ${m.label}`}
              color={m.color}
            />
          ))}
        </div>
      </div>

      {/* History */}
      {metrics.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 Historial Grupal</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Sesión</th>
                  {METRICS.map((m) => (
                    <th key={m.id} style={{ color: m.color }}>{m.icon} {m.label}</th>
                  ))}
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {metrics.slice(0, 10).map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{item.evalDate}</td>
                    <td>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          background: item.sessionType === 'Partido'
                            ? 'rgba(238, 37, 35, 0.15)'
                            : 'rgba(59, 130, 246, 0.15)',
                          color: item.sessionType === 'Partido' ? '#ee2523' : '#3b82f6',
                        }}
                      >
                        {item.sessionType}
                      </span>
                    </td>
                    {METRICS.map((m) => (
                      <td key={m.id} style={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                        {item[m.id]}
                      </td>
                    ))}
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.observaciones || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
