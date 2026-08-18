import React, { useState, useCallback } from 'react';
import { players, getPlayerById } from '../data/players';
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="main-panel" key={refreshKey}>
        {/* Mobile Player Selector Bar */}
        <div className="mobile-player-selector-bar" style={{ marginBottom: 'var(--space-md)' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsMobileSidebarOpen(true)}
            id="btn-mobile-sidebar-toggle"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📋 Plantilla ({players.length})
          </button>

          <select
            className="form-select"
            value={selectedPlayerId}
            onChange={(e) => handlePlayerSelect(Number(e.target.value))}
            style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }}
            id="select-player-mobile"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.dorsal} {p.shortName} ({p.position})
              </option>
            ))}
          </select>
        </div>

        {/* Header Action Bar */}
        <div className="view-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '10px' }}>
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
              Usa el panel lateral o el menú superior para elegir una jugadora
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
