import React, { useState } from 'react';
import GroupMetrics from '../components/GroupMetrics';
import Sociogram from '../components/Sociogram';
import DynamicsLog from '../components/DynamicsLog';
import PdfReportModal from '../components/PdfReportModal';

export default function GroupView() {
  const [showPdfModal, setShowPdfModal] = useState(false);

  return (
    <div className="app-content">
      <main className="main-panel" style={{ maxWidth: 1100, margin: '0 auto' }}>
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

        <div className="content-grid" style={{ gap: 'var(--space-xl)' }}>
          {/* Métricas colectivas con gauges */}
          <GroupMetrics />

          {/* Sociograma / Mapa de Liderazgo */}
          <Sociogram />

          {/* Registro de Dinámicas e Intervenciones */}
          <DynamicsLog />
        </div>

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
