import React, { useState, useCallback } from 'react';
import {
  groupEvaluationCategories,
  createEmptyTeamObservation,
  getGroupCategoryAverage,
} from '../data/groupSchema';
import SliderMetric from './SliderMetric';
import { saveTeamObservation } from '../utils/storage';

export default function TeamObservationForm({ onSaved }) {
  const [observation, setObservation] = useState(createEmptyTeamObservation);
  const [openCategories, setOpenCategories] = useState({ cohesion: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = useCallback((field, value) => {
    setObservation((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const toggleCategory = (catId) => {
    setOpenCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleCategoryExclusion = (catId, exclude) => {
    setObservation((prev) => {
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
    const savedObj = saveTeamObservation(observation);
    setSaving(false);
    setSaved(true);
    if (onSaved) onSaved(savedObj);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title" style={{ fontSize: '1.2rem' }}>
            📋 Observación del Equipo (Evaluación Completa)
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
            Registro cualitativo y cuantitativo del rendimiento colectivo
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saved && (
            <span style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
              ✓ Guardada
            </span>
          )}
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            id="btn-save-team-observation"
          >
            {saving ? '⏳ Guardando...' : '💾 Guardar Observación Equipo'}
          </button>
        </div>
      </div>

      {/* Header de sesión */}
      <div className="form-row" style={{ marginBottom: 'var(--space-md)' }}>
        <div className="form-group">
          <label className="form-label">Fecha de Evaluación</label>
          <input
            type="date"
            className="form-input"
            value={observation.evalDate}
            onChange={(e) => updateField('evalDate', e.target.value)}
            id="team-eval-date"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tipo de Sesión</label>
          <select
            className="form-select"
            value={observation.sessionType}
            onChange={(e) => updateField('sessionType', e.target.value)}
            id="team-session-type"
          >
            <option value="Entrenamiento">Entrenamiento</option>
            <option value="Partido">Partido</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Evaluador / Staff</label>
        <input
          type="text"
          className="form-input"
          placeholder="Nombre del evaluador o staff responsable..."
          value={observation.evaluator}
          onChange={(e) => updateField('evaluator', e.target.value)}
          id="team-evaluator"
        />
      </div>

      {/* Categorías de evaluación en acordeón */}
      {groupEvaluationCategories.map((category) => {
        const isOpen = openCategories[category.id];
        const isExcluded = (observation.excludedCategories || []).includes(category.id);
        const avg = getGroupCategoryAverage(observation, category.id);

        return (
          <div
            className="accordion"
            key={category.id}
            style={{
              borderColor: isOpen ? category.color : 'var(--slate-700)',
              opacity: isExcluded ? 0.65 : 1,
              filter: isExcluded ? 'grayscale(0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              className="accordion-header"
              onClick={() => toggleCategory(category.id)}
              id={`cat-team-${category.id}`}
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
                  id={`chk-cat-team-${category.id}`}
                />
                <span>{isExcluded ? 'Excluido' : 'Incluido'}</span>
              </label>

              {avg !== null ? (
                <span
                  className="accordion-avg"
                  style={{ color: category.color }}
                >
                  {avg.toFixed(1)}/10
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
                    🚫 <strong>Apartado Excluido:</strong> Este apartado está desactivado para esta valoración colectiva. No influirá en promedios del equipo ni informes PDF.
                  </div>
                )}

                {/* Métricas numéricas */}
                {category.metrics.map((metric) => (
                  <SliderMetric
                    key={metric.id}
                    id={metric.id}
                    label={metric.label}
                    value={observation[metric.id]}
                    onChange={(val) => updateField(metric.id, val)}
                    color={category.color}
                    disabled={isExcluded}
                  />
                ))}

                {/* Campos de texto / Respuestas abiertas */}
                {category.textFields.map((field) => (
                  <div className="form-group" key={field.id} style={{ marginTop: '12px' }}>
                    <label className="form-label">{field.label}</label>
                    <textarea
                      className="form-textarea"
                      placeholder={field.placeholder}
                      value={observation[field.id]}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      id={`text-team-${field.id}`}
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
      <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
        <label className="form-label">📝 Observaciones Generales del Equipo</label>
        <textarea
          className="form-textarea"
          placeholder="Resumen del clima general, conclusiones táctico-emocionales del grupo..."
          value={observation.observaciones_generales}
          onChange={(e) => updateField('observaciones_generales', e.target.value)}
          style={{ minHeight: 100 }}
          id="team-general-notes"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'var(--space-md)' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setObservation(createEmptyTeamObservation())}
        >
          🔄 Reiniciar
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar Observación Equipo'}
        </button>
      </div>
    </div>
  );
}
