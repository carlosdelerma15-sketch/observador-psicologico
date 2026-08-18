import React from 'react';
import Modal from './Modal';
import { getLatestEvaluation, getEvaluationsForPlayer, getGroupMetrics, getGroupDynamics, getLeadershipMap, getLatestTeamObservation, getTeamObservations } from '../utils/storage';
import { evaluationCategories, getCategoryAverage } from '../data/evaluationSchema';
import { groupEvaluationCategories, getGroupCategoryAverage } from '../data/groupSchema';
import { getInitials } from '../data/players';

export default function PdfReportModal({ isOpen, onClose, type = 'individual', player = null }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const latestEval = player ? getLatestEvaluation(player.id) : null;
  const historyEvals = player ? getEvaluationsForPlayer(player.id).slice(0, 8) : [];

  const groupMetrics = getGroupMetrics();
  const latestGroupMetric = groupMetrics.length > 0 ? groupMetrics[0] : null;
  const groupDynamics = getGroupDynamics();
  const leadershipNodes = getLeadershipMap();
  const latestTeamObs = getLatestTeamObservation();

  // Dividir categorías para informes
  const catPage1 = evaluationCategories.slice(0, 4);
  const catPage2 = evaluationCategories.slice(4);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📄 Informe PDF (2 Páginas) — ${type === 'individual' ? player?.fullName : 'Observación del Equipo'}`}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn btn-primary" onClick={handlePrint} id="btn-do-print-2pages">
            🖨️ Imprimir / Guardar como PDF (2 Páginas)
          </button>
        </>
      }
    >
      <div className="pdf-report-document" id="pdf-report-document">

        {/* ========================================================== */}
        {/* PÁGINA 1: INFORMACIÓN GENERAL Y MÉTRICAS CLAVE              */}
        {/* ========================================================== */}
        <div className="pdf-page pdf-page-break">
          {/* Header Corporativo Athletic Club */}
          <div
            style={{
              background: 'linear-gradient(90deg, #ee2523, #c41e1c)',
              padding: '16px 20px',
              borderRadius: '8px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(238, 37, 35, 0.3)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ATHLETIC CLUB FEMENINO
              </div>
              <div style={{ fontSize: '0.82rem', opacity: 0.95 }}>
                Informe de Evaluación Psicológica y Rendimiento • Temporada 2026-27 (Página 1/2)
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.75rem', opacity: 0.95 }}>
              <div>Fecha: {new Date().toLocaleDateString('es-ES')}</div>
              <div>Liga F • Lezama</div>
            </div>
          </div>

          {/* INFORME INDIVIDUAL - PÁGINA 1 */}
          {type === 'individual' && player && (
            <div>
              {/* Ficha de Jugadora */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  background: 'var(--slate-800)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid var(--slate-700)',
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '12px',
                    background: 'var(--slate-900)',
                    border: '2px solid var(--ac-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(player.shortName)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: 'var(--ac-white)', fontSize: '1.3rem' }}>
                    #{player.dorsal} {player.fullName}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: 'var(--ac-red)', fontWeight: 600, marginTop: '2px' }}>
                    {player.position} • Estado Actual: <span style={{ textTransform: 'capitalize' }}>{player.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-300)', marginTop: '4px', display: 'flex', gap: '16px' }}>
                    <span><strong>Nacimiento:</strong> {player.birthDate || 'N/D'}</span>
                    <span><strong>Lugar:</strong> {player.birthPlace || 'N/D'}</span>
                    {player.seasons && <span><strong>Temporadas:</strong> {player.seasons}</span>}
                    {player.officialMatches && <span><strong>Partidos:</strong> {player.officialMatches}</span>}
                  </div>
                </div>
              </div>

              {latestEval ? (
                <div>
                  <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--ac-red)', paddingBottom: '4px', marginBottom: '12px', fontSize: '1rem' }}>
                    📋 Evaluación Reciente — Categorías Principales ({latestEval.evalDate} • {latestEval.sessionType})
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {catPage1.map((cat) => {
                      const avg = getCategoryAverage(latestEval, cat.id);
                      return (
                        <div
                          key={cat.id}
                          style={{
                            background: 'var(--slate-800)',
                            padding: '12px',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${cat.color}`,
                            border: '1px solid var(--slate-700)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--ac-white)' }}>
                              {cat.icon} {cat.label}
                            </strong>
                            <span style={{ fontWeight: 800, color: cat.color, fontSize: '0.95rem' }}>
                              {avg !== null ? `${avg.toFixed(1)}/10` : 'N/A'}
                            </span>
                          </div>

                          {cat.metrics.map((m) => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-300)', marginTop: '3px' }}>
                              <span>{m.label}</span>
                              <strong style={{ color: 'var(--ac-white)' }}>{latestEval[m.id] ?? '—'}/10</strong>
                            </div>
                          ))}

                          {cat.textFields.map((f) => (
                            latestEval[f.id] ? (
                              <div key={f.id} style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--slate-400)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '4px 6px', borderRadius: '4px' }}>
                                "{f.label}: {latestEval[f.id]}"
                              </div>
                            ) : null
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--slate-400)', background: 'var(--slate-800)', borderRadius: '8px' }}>
                  No hay evaluaciones registradas para esta jugadora.
                </div>
              )}
            </div>
          )}

          {/* INFORME GRUPAL / OBSERVACIÓN DEL EQUIPO - PÁGINA 1 */}
          {type === 'group' && (
            <div>
              <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--ac-red)', paddingBottom: '4px', marginBottom: '14px', fontSize: '1rem' }}>
                👥 Observación del Equipo — Cohesión, Comunicación y Respuesta al Error
              </h4>

              {latestTeamObs ? (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginBottom: '12px' }}>
                    Evaluación del: <strong>{latestTeamObs.evalDate}</strong> • Sesión: <strong>{latestTeamObs.sessionType}</strong> {latestTeamObs.evaluator && `• Staff: ${latestTeamObs.evaluator}`}
                  </div>

                  {/* Cohesión, Comunicación y Respuesta al error */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {groupEvaluationCategories.slice(0, 3).map((cat) => {
                      const avg = getGroupCategoryAverage(latestTeamObs, cat.id);
                      return (
                        <div
                          key={cat.id}
                          style={{
                            background: 'var(--slate-800)',
                            padding: '12px',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${cat.color}`,
                            border: '1px solid var(--slate-700)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--ac-white)' }}>
                              {cat.icon} {cat.label}
                            </strong>
                            {avg !== null && (
                              <span style={{ fontWeight: 800, color: cat.color, fontSize: '0.95rem' }}>
                                {avg.toFixed(1)}/10
                              </span>
                            )}
                          </div>

                          {cat.metrics.map((m) => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--slate-300)', marginTop: '3px' }}>
                              <span>{m.label}</span>
                              <strong style={{ color: 'var(--ac-white)' }}>{latestTeamObs[m.id] ?? '—'}/10</strong>
                            </div>
                          ))}

                          {cat.textFields.map((f) => (
                            latestTeamObs[f.id] ? (
                              <div key={f.id} style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--slate-400)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '4px 6px', borderRadius: '4px' }}>
                                "{f.label}: {latestTeamObs[f.id]}"
                              </div>
                            ) : null
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : latestGroupMetric ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'var(--slate-800)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--slate-700)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>🤝 Cohesión</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>{latestGroupMetric.cohesion}/10</div>
                  </div>
                  <div style={{ background: 'var(--slate-800)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--slate-700)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>💎 Resiliencia</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22c55e', marginTop: '4px' }}>{latestGroupMetric.resiliencia}/10</div>
                  </div>
                  <div style={{ background: 'var(--slate-800)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--slate-700)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>🗣️ Comunicación</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>{latestGroupMetric.comunicacion}/10</div>
                  </div>
                  <div style={{ background: 'var(--slate-800)', padding: '14px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--slate-700)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>⚖️ Asimilación Carga</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>{latestGroupMetric.asimilacion_carga}/10</div>
                  </div>
                </div>
              ) : null}

              {/* Liderazgo en Página 1 */}
              <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', border: '1px solid var(--slate-700)' }}>
                <strong style={{ fontSize: '0.88rem', color: 'var(--ac-white)', display: 'block', marginBottom: '6px' }}>
                  🔗 Estructura de Liderazgo y Roles Clave:
                </strong>
                {leadershipNodes && leadershipNodes.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.78rem' }}>
                    {leadershipNodes.slice(0, 6).map((n) => (
                      <div key={n.playerId} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-300)', padding: '4px 8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                        <span><strong>{n.name}</strong> ({n.role})</span>
                        <span style={{ color: 'var(--ac-red)', fontWeight: 700 }}>Inf: {n.influence}/10</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>Sociograma configurado por la dirección técnica.</div>
                )}
              </div>
            </div>
          )}

          {/* Pie de Página 1 */}
          <div style={{ position: 'absolute', bottom: '15px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--slate-500)', borderTop: '1px solid var(--slate-800)', paddingTop: '6px' }}>
            <span>Athletic Club Femenino • Informe Técnico Confidencial</span>
            <span>Página 1 de 2</span>
          </div>
        </div>


        {/* ========================================================== */}
        {/* PÁGINA 2: EVALUACIÓN DETALLADA, HISTORIAL Y SIGN-OFF       */}
        {/* ========================================================== */}
        <div className="pdf-page">
          {/* Header Secundario de Continuación */}
          <div
            style={{
              background: 'var(--slate-800)',
              padding: '10px 16px',
              borderRadius: '6px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderLeft: '4px solid var(--ac-red)',
            }}
          >
            <div>
              <strong style={{ fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', textTransform: 'uppercase' }}>
                ATHLETIC CLUB FEMENINO
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginLeft: '10px' }}>
                {type === 'individual' && player ? `#${player.dorsal} ${player.fullName}` : 'Observación del Equipo'} (Página 2/2)
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
              Lezama • {new Date().toLocaleDateString('es-ES')}
            </div>
          </div>

          {/* INFORME INDIVIDUAL - PÁGINA 2 */}
          {type === 'individual' && player && latestEval && (
            <div>
              <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--ac-red)', paddingBottom: '4px', marginBottom: '12px', fontSize: '1rem' }}>
                🗣️ Comunicación, Motivación y Comportamiento ante la Presión
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {catPage2.map((cat) => {
                  const avg = getCategoryAverage(latestEval, cat.id);
                  return (
                    <div
                      key={cat.id}
                      style={{
                        background: 'var(--slate-800)',
                        padding: '12px',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${cat.color}`,
                        border: '1px solid var(--slate-700)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--ac-white)' }}>
                          {cat.icon} {cat.label}
                        </strong>
                        {avg !== null && (
                          <span style={{ fontWeight: 800, color: cat.color, fontSize: '0.95rem' }}>
                            {avg.toFixed(1)}/10
                          </span>
                        )}
                      </div>

                      {cat.metrics.map((m) => (
                        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-300)', marginTop: '3px' }}>
                          <span>{m.label}</span>
                          <strong style={{ color: 'var(--ac-white)' }}>{latestEval[m.id] ?? '—'}/10</strong>
                        </div>
                      ))}

                      {cat.textFields.map((f) => (
                        latestEval[f.id] ? (
                          <div key={f.id} style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--slate-400)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '4px 6px', borderRadius: '4px' }}>
                            "{f.label}: {latestEval[f.id]}"
                          </div>
                        ) : null
                      ))}
                    </div>
                  );
                })}
              </div>

              {latestEval.observaciones_generales && (
                <div style={{ background: 'var(--slate-800)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--slate-700)' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--ac-white)', display: 'block', marginBottom: '4px' }}>
                    📝 Valoración Cualitativa del Staff:
                  </strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-300)', margin: 0, fontStyle: 'italic' }}>
                    "{latestEval.observaciones_generales}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* INFORME GRUPAL - PÁGINA 2 */}
          {type === 'group' && (
            <div>
              {latestTeamObs ? (
                <div>
                  <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--ac-red)', paddingBottom: '4px', marginBottom: '12px', fontSize: '1rem' }}>
                    🌡️ Clima Emocional, Adversidad, Liderazgo y Reacción al Cuerpo Técnico
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {groupEvaluationCategories.slice(3).map((cat) => {
                      const avg = getGroupCategoryAverage(latestTeamObs, cat.id);
                      return (
                        <div
                          key={cat.id}
                          style={{
                            background: 'var(--slate-800)',
                            padding: '12px',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${cat.color}`,
                            border: '1px solid var(--slate-700)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--ac-white)' }}>
                              {cat.icon} {cat.label}
                            </strong>
                            {avg !== null && (
                              <span style={{ fontWeight: 800, color: cat.color, fontSize: '0.95rem' }}>
                                {avg.toFixed(1)}/10
                              </span>
                            )}
                          </div>

                          {cat.metrics.map((m) => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--slate-300)', marginTop: '3px' }}>
                              <span>{m.label}</span>
                              <strong style={{ color: 'var(--ac-white)' }}>{latestTeamObs[m.id] ?? '—'}/10</strong>
                            </div>
                          ))}

                          {cat.textFields.map((f) => (
                            latestTeamObs[f.id] ? (
                              <div key={f.id} style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--slate-400)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '4px 6px', borderRadius: '4px' }}>
                                "{f.label}: {latestTeamObs[f.id]}"
                              </div>
                            ) : null
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {latestTeamObs.observaciones_generales && (
                    <div style={{ background: 'var(--slate-800)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--slate-300)', marginBottom: '16px', border: '1px solid var(--slate-700)' }}>
                      <strong style={{ color: 'var(--ac-white)', display: 'block', marginBottom: '4px' }}>📝 Valoración General del Grupo:</strong>
                      "{latestTeamObs.observaciones_generales}"
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h4 style={{ color: 'var(--ac-white)', borderBottom: '2px solid var(--ac-red)', paddingBottom: '4px', marginBottom: '12px', fontSize: '1rem' }}>
                    📝 Registro de Dinámicas e Intervenciones Grupales
                  </h4>
                  {groupDynamics.length > 0 ? (
                    <table className="data-table" style={{ fontSize: '0.78rem', marginBottom: '20px' }}>
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
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Firma y Cierre Oficial del Staff */}
          <div style={{ marginTop: '30px', paddingTop: '16px', borderTop: '1px dashed var(--slate-700)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate-400)' }}>
            <div>
              <strong style={{ color: 'var(--ac-white)' }}>Área de Psicología y Rendimiento Deportivo</strong>
              <div>Athletic Club Femenino • Lezama</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Documento Oficial Confidencial</div>
              <div>Cuerpo Técnico - Liga F 2026-27</div>
            </div>
          </div>

          {/* Pie de Página 2 */}
          <div style={{ position: 'absolute', bottom: '15px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--slate-500)', borderTop: '1px solid var(--slate-800)', paddingTop: '6px' }}>
            <span>Athletic Club Femenino • Observador Psicológico</span>
            <span>Página 2 de 2</span>
          </div>
        </div>

      </div>
    </Modal>
  );
}
