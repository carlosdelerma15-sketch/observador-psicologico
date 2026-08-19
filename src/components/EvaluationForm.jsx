import React, { useState, useCallback } from 'react';
import {
  evaluationCategories,
  createEmptyEvaluation,
  getCategoryAverage,
  getAllCategoryAverages,
} from '../data/evaluationSchema';
import SliderMetric from './SliderMetric';
import SpiderChart from './SpiderChart';
import { saveEvaluation } from '../utils/storage';

export default function EvaluationForm({ player, onSaved }) {
  const [evaluation, setEvaluation] = useState(() =>
    createEmptyEvaluation(player.id)
  );
  const [openCategories, setOpenCategories] = useState({ atencion: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = useCallback((field, value) => {
    setEvaluation((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const toggleCategory = (catId) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleCategoryExclusion = (catId, exclude) => {
    setEvaluation((prev) => {
      const list = prev.excludedCategories || [];
      const updated = exclude
        ? Array.from(new Set([...list, catId]))
        : list.filter((id) => id !== catId);
      return { ...prev, excludedCategories: updated };
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaving(true);
    const saved = saveEvaluation(evaluation);
    setSaving(false);
    setSaved(true);
    if (onSaved) onSaved(saved);
    setTimeout(() => setSaved(false), 3000);
  };

  const spiderData = getAllCategoryAverages(evaluation);

  return (
    <div className="animate-fade-in">
      {/* Header con info de sesión */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">📋 Nueva Evaluación</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {saved && (
              <span style={{ color: '#22c55e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ✓ Guardada
              </span>
            )}
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              id="btn-save-evaluation"
            >
              {saving ? '⏳ Guardando...' : '💾 Guardar Evaluación'}
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-input"
              value={evaluation.evalDate}
              onChange={(e) => updateField('evalDate', e.target.value)}
              id="eval-date"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de Sesión</label>
            <select
              className="form-select"
              value={evaluation.sessionType}
              onChange={(e) => updateField('sessionType', e.target.value)}
              id="eval-session-type"
            >
              <option value="Entrenamiento">Entrenamiento</option>
              <option value="Partido">Partido</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Evaluador</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nombre del evaluador..."
            value={evaluation.evaluator}
            onChange={(e) => updateField('evaluator', e.target.value)}
            id="eval-evaluator"
          />
        </div>
      </div>

      {/* Spider Chart resumen */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">🕸️ Perfil Psicológico Global</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
            (Las categorías excluidas mediante casilla no influyen en la gráfica)
          </span>
        </div>
        <SpiderChart data={spiderData} size={240} />
      </div>

      {/* Categorías de evaluación */}
      {evaluationCategories.map((category) => {
        const isOpen = openCategories[category.id];
        const isExcluded = (evaluation.excludedCategories || []).includes(category.id);
        const avg = getCategoryAverage(evaluation, category.id);

        return (
          <div
            className="accordion"
            key={category.id}
            style={{
              opacity: isExcluded ? 0.65 : 1,
              filter: isExcluded ? 'grayscale(0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              className="accordion-header"
              onClick={() => toggleCategory(category.id)}
              id={`cat-${category.id}`}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <span className="accordion-icon">{category.icon}</span>
              <span
                className="accordion-title"
                style={{
                  textDecoration: isExcluded ? 'line-through' : 'none',
                  color: isExcluded ? 'var(--slate-400)' : 'var(--ac-white)',
                  flex: 1,
                }}
              >
                {category.label}
              </span>

              {/* Casilla para incluir / excluir apartado */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: isExcluded ? '#ef4444' : '#22c55e',
                  fontWeight: 600,
                  marginRight: '14px',
                  background: isExcluded ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
                onClick={(e) => e.stopPropagation()}
                title="Desmarca la casilla para excluir este apartado de los cálculos y gráficas"
              >
                <input
                  type="checkbox"
                  checked={!isExcluded}
                  onChange={(e) => toggleCategoryExclusion(category.id, !e.target.checked)}
                  id={`chk-cat-${category.id}`}
                />
                <span>{isExcluded ? 'Excluido' : 'Incluido'}</span>
              </label>

              {avg !== null ? (
                <span
                  className="accordion-avg"
                  style={{ color: category.color }}
                >
                  {avg.toFixed(1)}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontStyle: 'italic', marginRight: '8px' }}>
                  [No Eval]
                </span>
              )}
              <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>
                ▼
              </span>
            </div>

            {isOpen && (
              <div className="accordion-body">
                {isExcluded && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#fca5a5',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    🚫 <strong>Apartado Excluido:</strong> Este apartado está desactivado para esta valoración. No influirá en promedios globales ni en el perfil en araña.
                  </div>
                )}

                {/* Métricas numéricas */}
                {category.metrics.map((metric) => (
                  <SliderMetric
                    key={metric.id}
                    id={metric.id}
                    label={metric.label}
                    value={evaluation[metric.id]}
                    onChange={(val) => updateField(metric.id, val)}
                    color={category.color}
                    disabled={isExcluded}
                  />
                ))}

                {/* Campos de texto */}
                {category.textFields.map((field) => (
                  <div className="form-group" key={field.id}>
                    <label className="form-label">{field.label}</label>
                    <textarea
                      className="form-textarea"
                      placeholder={field.placeholder}
                      value={evaluation[field.id]}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      id={`text-${field.id}`}
                      disabled={isExcluded}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}


      {/* Observaciones generales */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">📝 Observaciones Generales</h3>
        </div>
        <textarea
          className="form-textarea"
          placeholder="Notas generales sobre la sesión, el rendimiento, el estado anímico..."
          value={evaluation.observaciones_generales}
          onChange={(e) => updateField('observaciones_generales', e.target.value)}
          style={{ minHeight: 120 }}
          id="eval-general-notes"
        />
      </div>

      {/* Botón guardar inferior */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-lg)', gap: '8px' }}>
        <button className="btn btn-secondary" onClick={() => setEvaluation(createEmptyEvaluation(player.id))}>
          🔄 Reiniciar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar Evaluación'}
        </button>
      </div>
    </div>
  );
}
