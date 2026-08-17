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
        </div>
        <SpiderChart data={spiderData} size={240} />
      </div>

      {/* Categorías de evaluación */}
      {evaluationCategories.map((category) => {
        const isOpen = openCategories[category.id];
        const avg = getCategoryAverage(evaluation, category.id);

        return (
          <div className="accordion" key={category.id}>
            <button
              className="accordion-header"
              onClick={() => toggleCategory(category.id)}
              id={`cat-${category.id}`}
            >
              <span className="accordion-icon">{category.icon}</span>
              <span className="accordion-title">{category.label}</span>
              {avg !== null && (
                <span
                  className="accordion-avg"
                  style={{ color: category.color }}
                >
                  {avg.toFixed(1)}
                </span>
              )}
              <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="accordion-body">
                {/* Métricas numéricas */}
                {category.metrics.map((metric) => (
                  <SliderMetric
                    key={metric.id}
                    id={metric.id}
                    label={metric.label}
                    value={evaluation[metric.id]}
                    onChange={(val) => updateField(metric.id, val)}
                    color={category.color}
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
