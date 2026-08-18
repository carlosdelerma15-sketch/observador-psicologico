import React, { useState, useCallback } from 'react';
import { getPlayerById } from '../data/players';
import { getLatestEvaluation } from '../utils/storage';
import { getAllCategoryAverages } from '../data/evaluationSchema';
import Sidebar from '../components/Sidebar';
import PlayerCard from '../components/PlayerCard';
import EvaluationForm from '../components/EvaluationForm';
import HistoryTable from '../components/HistoryTable';
import LineChart from '../components/LineChart';
import SpiderChart from '../components/SpiderChart';
import ComparePlayers from '../components/ComparePlayers';
import PdfReportModal from '../components/PdfReportModal';

export default function IndividualView() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(1);
  const [activeTab, setActiveTab] = useState('evaluate'); // 'evaluate' | 'history' | 'compare'
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const player = getPlayerById(selectedPlayerId);
  const latestEval = getLatestEvaluation(selectedPlayerId);

  const handlePlayerSelect = useCallback((id) => {
    setSelectedPlayerId(id);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const latestSpiderData = latestEval ? getAllCategoryAverages(latestEval) : null;

  return (
    <div className="app-content">
      <Sidebar
        selectedPlayerId={selectedPlayerId}
        onSelectPlayer={handlePlayerSelect}
      />
      <main className="main-panel" key={refreshKey}>
        {/* Header Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            👤 Observación Individual
          </h2>

          <button
            className="btn btn-primary"
            onClick={() => setShowPdfModal(true)}
            id="btn-individual-pdf"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            📄 Informe PDF
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="tabs" style={{ marginBottom: 'var(--space-lg)' }}>
          <button
            className={`tab ${activeTab === 'evaluate' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluate')}
          >
            📋 Ficha y Evaluación
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📊 Historial y Evolución
          </button>
          <button
            className={`tab ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            ⚔️ Comparador (Máx. 3)
          </button>
        </div>

        {/* Tab 3: Comparador de Jugadoras */}
        {activeTab === 'compare' ? (
          <ComparePlayers />
        ) : player ? (
          <>
            {/* Ficha de jugadora */}
            <PlayerCard player={player} />

            {/* Spider chart de última evaluación */}
            {latestSpiderData && (
              <div className="card" style={{ margin: 'var(--space-lg) 0' }}>
                <div className="card-header">
                  <h3 className="card-title">🕸️ Última Evaluación — Perfil Psicológico</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    {latestEval.evalDate} • {latestEval.sessionType}
                  </span>
                </div>
                <SpiderChart data={latestSpiderData} size={220} />
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'evaluate' ? (
              <EvaluationForm
                player={player}
                key={`eval-${selectedPlayerId}`}
                onSaved={handleSaved}
              />
            ) : (
              <div className="content-grid">
                <HistoryTable playerId={selectedPlayerId} />
                <LineChart playerId={selectedPlayerId} />
              </div>
            )}
          </>
        ) : (
          <div className="empty-state" style={{ height: '60vh' }}>
            <div className="empty-state-icon">👤</div>
            <p className="empty-state-text">Selecciona una jugadora</p>
            <p className="empty-state-hint">
              Usa el panel lateral para elegir una jugadora de la plantilla
            </p>
          </div>
        )}

        {/* Modal de Informe PDF */}
        <PdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          type="individual"
          player={player}
        />
      </main>
    </div>
  );
}
