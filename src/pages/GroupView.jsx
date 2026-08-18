import React, { useState, useCallback } from 'react';
import GroupMetrics from '../components/GroupMetrics';
import Sociogram from '../components/Sociogram';
import DynamicsLog from '../components/DynamicsLog';
import TeamObservationForm from '../components/TeamObservationForm';
import PdfReportModal from '../components/PdfReportModal';
import { getTeamObservations, getLatestTeamObservation } from '../utils/storage';
import { groupEvaluationCategories, getGroupCategoryAverage } from '../data/groupSchema';

export default function GroupView() {
  const [activeTab, setActiveTab] = useState('team_obs'); // 'team_obs' | 'metrics' | 'sociogram' | 'dynamics'
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const historyTeamObs = getTeamObservations();
  const latestTeamObs = getLatestTeamObservation();

  return (
    <div className="app-content">
      <main className="main-panel" style={{ maxWidth: 1100, margin: '0 auto' }} key={refreshKey}>
        {/* Header Action Bar */}
        <div className="section-header">
          <h2 className="section-title">👥 Observación Grupal — Dinámica del Vestuario</h2>

          <button
            className="btn btn-primary"
            onClick={() => setShowPdfModal(true)}
            id="btn-group-pdf"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            📄 Informe PDF
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="tabs" style={{ marginBottom: 'var(--space-lg)' }}>
          <button
            className={`tab ${activeTab === 'team_obs' ? 'active' : ''}`}
            onClick={() => setActiveTab('team_obs')}
          >
            📋 Observación del Equipo
          </button>
          <button
            className={`tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            📊 Métricas Colectivas
          </button>
          <button
            className={`tab ${activeTab === 'sociogram' ? 'active' : ''}`}
            onClick={() => setActiveTab('sociogram')}
          >
            🔗 Sociograma / Liderazgo
          </button>
          <button
            className={`tab ${activeTab === 'dynamics' ? 'active' : ''}`}
            onClick={() => setActiveTab('dynamics')}
          >
            📝 Dinámicas e Intervenciones
          </button>
        </div>

        {/* TAB 1: Observación del Equipo (Formulario Completo + Histórico) */}
        {activeTab === 'team_obs' && (
          <div className="content-grid" style={{ gap: 'var(--space-xl)' }}>
            <TeamObservationForm onSaved={handleSaved} />

            {/* Resumen de Última Observación del Equipo */}
            {latestTeamObs && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">🌟 Última Evaluación del Equipo</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    {latestTeamObs.evalDate} • {latestTeamObs.sessionType}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  {groupEvaluationCategories.map((cat) => {
                    const avg = getGroupCategoryAverage(latestTeamObs, cat.id);
                    return (
                      <div
                        key={cat.id}
                        style={{
                          background: 'var(--slate-800)',
                          padding: '12px',
                          borderRadius: '8px',
                          borderLeft: `4px solid ${cat.color}`,
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{cat.icon} {cat.label}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: cat.color, marginTop: '2px' }}>
                          {avg !== null ? `${avg.toFixed(1)}/10` : 'Texto'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {latestTeamObs.liderazgo_referente && (
                  <div style={{ background: 'var(--slate-800)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--slate-200)', marginBottom: '10px' }}>
                    👑 <strong>Referente en dificultades:</strong> {latestTeamObs.liderazgo_referente}
                  </div>
                )}

                {latestTeamObs.momentos_situaciones_informativas && (
                  <div style={{ background: 'var(--slate-800)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--slate-200)' }}>
                    ⚡ <strong>Momentos clave:</strong> {latestTeamObs.momentos_situaciones_informativas}
                  </div>
                )}
              </div>
            )}

            {/* Histórico de Observaciones del Equipo */}
            {historyTeamObs.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">📊 Histórico de Evaluaciones del Equipo</h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Sesión</th>
                        <th>Cohesión</th>
                        <th>Comunicación</th>
                        <th>Resp. Error</th>
                        <th>Adversidad</th>
                        <th>Clima Emocional</th>
                        <th>Cuerpo Técnico</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyTeamObs.map((obs) => (
                        <tr key={obs.id}>
                          <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{obs.evalDate}</td>
                          <td>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                background: obs.sessionType === 'Partido' ? 'rgba(238,37,35,0.15)' : 'rgba(59,130,246,0.15)',
                                color: obs.sessionType === 'Partido' ? '#ee2523' : '#3b82f6',
                              }}
                            >
                              {obs.sessionType}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#3b82f6' }}>{getGroupCategoryAverage(obs, 'cohesion')?.toFixed(1) || '—'}</td>
                          <td style={{ fontWeight: 700, color: '#8b5cf6' }}>{getGroupCategoryAverage(obs, 'comunicacion')?.toFixed(1) || '—'}</td>
                          <td style={{ fontWeight: 700, color: '#ef4444' }}>{getGroupCategoryAverage(obs, 'respuesta_error')?.toFixed(1) || '—'}</td>
                          <td style={{ fontWeight: 700, color: '#f97316' }}>{getGroupCategoryAverage(obs, 'respuesta_adversidad')?.toFixed(1) || '—'}</td>
                          <td style={{ fontWeight: 700, color: '#f59e0b' }}>{getGroupCategoryAverage(obs, 'clima_emocional')?.toFixed(1) || '—'}</td>
                          <td style={{ fontWeight: 700, color: '#14b8a6' }}>{getGroupCategoryAverage(obs, 'reaccion_cuerpo_tecnico')?.toFixed(1) || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Métricas Colectivas */}
        {activeTab === 'metrics' && <GroupMetrics />}

        {/* TAB 3: Sociograma y Liderazgo */}
        {activeTab === 'sociogram' && <Sociogram />}

        {/* TAB 4: Dinámicas e Intervenciones */}
        {activeTab === 'dynamics' && <DynamicsLog />}

        {/* Modal de Informe PDF Grupal */}
        <PdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          type="group"
        />
      </main>
    </div>
  );
}
