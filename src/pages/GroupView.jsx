import React from 'react';
import GroupMetrics from '../components/GroupMetrics';
import Sociogram from '../components/Sociogram';
import DynamicsLog from '../components/DynamicsLog';

export default function GroupView() {
  return (
    <div className="app-content">
      <main className="main-panel" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-header">
          <h2 className="section-title">👥 Observación Grupal — Dinámica del Vestuario</h2>
        </div>

        <div className="content-grid" style={{ gap: 'var(--space-xl)' }}>
          {/* Métricas colectivas con gauges */}
          <GroupMetrics />

          {/* Sociograma / Mapa de Liderazgo */}
          <Sociogram />

          {/* Registro de Dinámicas e Intervenciones */}
          <DynamicsLog />
        </div>
      </main>
    </div>
  );
}
