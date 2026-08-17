import React, { useState } from 'react';
import { saveGroupDynamic, getGroupDynamics, deleteGroupDynamic } from '../utils/storage';
import Modal from './Modal';

const EVENT_TYPES = [
  { value: 'charla_grupal', label: '🎤 Charla Grupal' },
  { value: 'dinámica_cohesión', label: '🤝 Dinámica de Cohesión' },
  { value: 'evento_externo', label: '🎯 Evento Externo' },
  { value: 'intervención_individual', label: '👤 Intervención Individual' },
  { value: 'reunión_staff', label: '📋 Reunión Staff' },
];

const EVENT_LABELS = Object.fromEntries(EVENT_TYPES.map((t) => [t.value, t.label]));

export default function DynamicsLog() {
  const [dynamics, setDynamics] = useState(getGroupDynamics());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    eventDate: new Date().toISOString().split('T')[0],
    eventType: 'charla_grupal',
    title: '',
    description: '',
    participants: '',
    impactScore: 5,
    impactNotes: '',
  });

  const handleSave = () => {
    if (!form.title.trim()) return;
    saveGroupDynamic({
      ...form,
      participants: form.participants.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setDynamics(getGroupDynamics());
    setShowModal(false);
    setForm({
      eventDate: new Date().toISOString().split('T')[0],
      eventType: 'charla_grupal',
      title: '',
      description: '',
      participants: '',
      impactScore: 5,
      impactNotes: '',
    });
  };

  const handleDelete = (id) => {
    deleteGroupDynamic(id);
    setDynamics(getGroupDynamics());
  };

  const getImpactColor = (score) => {
    if (score <= 3) return '#ef4444';
    if (score <= 5) return '#f59e0b';
    if (score <= 7) return '#3b82f6';
    return '#22c55e';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">📝 Registro de Dinámicas e Intervenciones</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
          id="btn-new-dynamic"
        >
          + Nueva Dinámica
        </button>
      </div>

      {dynamics.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p className="empty-state-text">No hay dinámicas registradas</p>
          <p className="empty-state-hint">
            Documenta charlas grupales, dinámicas de cohesión y otros eventos
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Impacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dynamics.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{d.eventDate}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.05)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {EVENT_LABELS[d.eventType] || d.eventType}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{d.title}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.description || '—'}
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontWeight: 700,
                        color: getImpactColor(d.impactScore),
                      }}
                    >
                      {d.impactScore}/10
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(d.id)}
                      style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para nueva dinámica */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="📝 Nueva Dinámica / Intervención"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              💾 Guardar
            </button>
          </>
        }
      >
        <div className="form-row" style={{ marginBottom: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-input"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de Evento</label>
            <select
              className="form-select"
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-input"
            placeholder="Nombre de la dinámica o intervención..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-textarea"
            placeholder="Detalle de la actividad realizada..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Participantes</label>
          <input
            type="text"
            className="form-input"
            placeholder="Separadas por comas: Bibi, Valero, Nanclares..."
            value={form.participants}
            onChange={(e) => setForm({ ...form, participants: e.target.value })}
          />
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Impacto posterior en rendimiento</span>
            <span className="slider-value" style={{ color: getImpactColor(form.impactScore) }}>
              {form.impactScore}
            </span>
          </div>
          <input
            type="range"
            className="slider-input"
            min="0"
            max="10"
            value={form.impactScore}
            onChange={(e) => setForm({ ...form, impactScore: parseInt(e.target.value, 10) })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notas sobre el impacto</label>
          <textarea
            className="form-textarea"
            placeholder="¿Cómo impactó esta intervención en el rendimiento?"
            value={form.impactNotes}
            onChange={(e) => setForm({ ...form, impactNotes: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
