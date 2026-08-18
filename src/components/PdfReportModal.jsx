import React from 'react';
import Modal from './Modal';
import { getLatestEvaluation, getEvaluationsForPlayer, getGroupMetrics, getGroupDynamics, getLeadershipMap } from '../utils/storage';
import { evaluationCategories, getCategoryAverage } from '../data/evaluationSchema';
import { players, getInitials, staff } from '../data/players';

export default function PdfReportModal({ isOpen, onClose, type = 'individual', player = null }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const latestEval = player ? getLatestEvaluation(player.id) : null;
  const historyEvals = player ? getEvaluationsForPlayer(player.id).slice(0, 6) : [];

  const groupMetrics = getGroupMetrics();
  const latestGroupMetric = groupMetrics.length > 0 ? groupMetrics[0] : null;
  const groupDynamics = getGroupDynamics();
  const leadershipNodes = getLeadershipMap();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📄 Informe PDF — ${type === 'individual' ? player?.fullName : 'Observación Grupal Vestuario'}`}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn-primary" onClick={handlePrint} id="btn-do-print">
            🖨️ Imprimir / Descargar PDF
          </button>
        </>
      }
    >
      {/* Printable Document Container */}
      <div className="pdf-report-document" id="pdf-report-document">
        {/* Header Corporativo Athletic Club */}
        <div
          style={{
            background: 'linear-gradient(90deg, #ee2523, #c41e1c)',
            padding: '16px 20px',
            borderRadius: '8px 8px 0 0',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase' }}>
              ATHLETIC CLUB FEMENINO
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              Informe de Evaluación Psicológica y Rendimiento • Temporada 2026-27
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.75rem', opacity: 0.95 }}>
            <div>Fecha: {new Date().toLocaleDateString('es-ES')}</div>
            <div>Liga F • Lezama</div>
          </div>
        </div>

        {/* INFORME INDIVIDUAL */}
        {type === 'individual' && player && (
          <div>
            {/* Ficha Jugadora Header */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                background: 'var(--slate-800)',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid var(--slate-700)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--slate-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: '#fff',
                }}
              >
                {getInitials(player.shortName)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: 'var(--ac-white)' }}>
                  #{player.dorsal} {player.fullName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--ac-red)', fontWeight: 600, marginTop: '2px' }}>
                  {player.position} • Estado: {player.status}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: '4px' }}>
                  Nacimiento: {player.birthDate || 'N/D'} • Lugar: {player.birthPlace || 'N/D'}
                </div>
              </div>
            </div>

            {/* Detalle de Última Evaluación */}
            {latestEval ? (
              <div>
                <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--ac-red)', paddingBottom: '4px', marginBottom: '14px' }}>
                  📋 Última Evaluación Registrada ({latestEval.evalDate} - {latestEval.sessionType})
                </h4>

                {/* Categorías y Métricas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  {evaluationCategories.map((cat) => {
                    const avg = getCategoryAverage(latestEval, cat.id);
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--ac-white)' }}>
                            {cat.icon} {cat.label}
                          </strong>
                          <span style={{ fontWeight: 800, color: cat.color, fontSize: '0.9rem' }}>
                            {avg !== null ? `${avg.toFixed(1)}/10` : 'N/A'}
                          </span>
                        </div>

                        {/* Lista de métricas individuales */}
                        {cat.metrics.map((m) => (
                          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-300)', marginTop: '3px' }}>
                            <span>{m.label}</span>
                            <strong>{latestEval[m.id] ?? '—'}</strong>
                          </div>
                        ))}

                        {/* Respuestas abiertas */}
                        {cat.textFields.map((f) => (
                          latestEval[f.id] ? (
                            <div key={f.id} style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>
                              "{f.label}: {latestEval[f.id]}"
                            </div>
                          ) : null
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Observaciones Generales */}
                {latestEval.observaciones_generales && (
                  <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--slate-700)' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--ac-white)', display: 'block', marginBottom: '4px' }}>
                      📝 Observaciones Generales del Staff:
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-300)', margin: 0 }}>
                      {latestEval.observaciones_generales}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--slate-400)' }}>
                No hay evaluaciones registradas para esta jugadora.
              </div>
            )}

            {/* Historial de Evaluaciones */}
            {historyEvals.length > 0 && (
              <div>
                <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--slate-700)', paddingBottom: '4px', marginBottom: '10px' }}>
                  📊 Evolución de Evaluaciones Recientes
                </h4>
                <table className="data-table" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Sesión</th>
                      <th>Evaluador</th>
                      <th>Promedio General</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyEvals.map((e) => {
                      const avgs = evaluationCategories
                        .filter((c) => c.metrics.length > 0)
                        .map((cat) => getCategoryAverage(e, cat.id))
                        .filter((v) => v !== null);
                      const over = avgs.length > 0 ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0;

                      return (
                        <tr key={e.id}>
                          <td>{e.evalDate}</td>
                          <td>{e.sessionType}</td>
                          <td>{e.evaluator || 'Cuerpo Técnico'}</td>
                          <td style={{ fontWeight: 700, color: 'var(--ac-red)' }}>{over.toFixed(1)}/10</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* INFORME GRUPAL */}
        {type === 'group' && (
          <div>
            <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--ac-red)', paddingBottom: '4px', marginBottom: '14px' }}>
              👥 Estado General del Vestuario y Dinámicas
            </h4>

            {/* Métricas Colectivas Actuales */}
            {latestGroupMetric ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>🤝 Cohesión</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6' }}>{latestGroupMetric.cohesion}/10</div>
                </div>
                <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>💎 Resiliencia</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22c55e' }}>{latestGroupMetric.resiliencia}/10</div>
                </div>
                <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>🗣️ Comunicación</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6' }}>{latestGroupMetric.comunicacion}/10</div>
                </div>
                <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>⚖️ Asimilación Carga</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{latestGroupMetric.asimilacion_carga}/10</div>
                </div>
              </div>
            ) : null}

            {/* Resumen de Liderazgo */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: 'var(--ac-white)', marginBottom: '8px' }}>🔗 Estructura de Liderazgo</h5>
              <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                {leadershipNodes && leadershipNodes.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {leadershipNodes.slice(0, 6).map((n) => (
                      <div key={n.playerId} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-300)' }}>
                        <span>{n.name} ({n.role})</span>
                        <strong>Inf: {n.influence}/10</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--slate-400)' }}>Sociograma configurado por la dirección técnica.</div>
                )}
              </div>
            </div>

            {/* Dinámicas e Intervenciones Registradas */}
            <div>
              <h5 style={{ color: 'var(--ac-white)', marginBottom: '8px' }}>📝 Historial de Dinámicas e Intervenciones</h5>
              {groupDynamics.length > 0 ? (
                <table className="data-table" style={{ fontSize: '0.75rem' }}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Evento</th>
                      <th>Título</th>
                      <th>Impacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupDynamics.map((d) => (
                      <tr key={d.id}>
                        <td>{d.eventDate}</td>
                        <td>{d.eventType}</td>
                        <td>{d.title}</td>
                        <td style={{ fontWeight: 700, color: '#22c55e' }}>{d.impactScore}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>Sin dinámicas grupales registradas.</div>
              )}
            </div>
          </div>
        )}

        {/* Firma del Staff */}
        <div style={{ marginTop: '30px', paddingTop: '16px', borderTop: '1px dashed var(--slate-700)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-400)' }}>
          <div>
            <strong>Dirección Deportiva & Área de Psicología</strong>
            <div>Athletic Club Femenino</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Documento Confidencial • Uso Interno</div>
            <div>Lezama</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
