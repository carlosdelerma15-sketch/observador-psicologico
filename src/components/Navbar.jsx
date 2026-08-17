import React from 'react';

export default function Navbar({ activeView, onViewChange }) {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">AC</div>
        <div>
          <div className="navbar-title">Observador Psicológico</div>
          <div className="navbar-subtitle">Athletic Club Femenino</div>
        </div>
      </div>

      <div className="navbar-tabs">
        <button
          id="tab-individual"
          className={`navbar-tab ${activeView === 'individual' ? 'active' : ''}`}
          onClick={() => onViewChange('individual')}
        >
          👤 Observación Individual
        </button>
        <button
          id="tab-group"
          className={`navbar-tab ${activeView === 'group' ? 'active' : ''}`}
          onClick={() => onViewChange('group')}
        >
          👥 Observación Grupal
        </button>
      </div>

      <div className="navbar-info">
        <span className="navbar-season">2026-27</span>
        <span>Liga F</span>
      </div>
    </nav>
  );
}
