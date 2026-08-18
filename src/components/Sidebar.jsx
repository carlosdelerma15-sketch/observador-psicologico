import React, { useState, useMemo } from 'react';
import { getPlayersByPosition, getInitials, STATUS_COLORS } from '../data/players';

export default function Sidebar({ selectedPlayerId, onSelectPlayer, isOpen = false, onClose }) {
  const [search, setSearch] = useState('');
  const groups = useMemo(() => getPlayersByPosition(), []);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    const result = {};
    for (const [pos, players] of Object.entries(groups)) {
      const filtered = players.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q) ||
          String(p.dorsal).includes(q)
      );
      if (filtered.length > 0) result[pos] = filtered;
    }
    return result;
  }, [groups, search]);

  const positionIcons = {
    Portera: '🧤',
    Defensa: '🛡️',
    Centrocampista: '⚙️',
    Delantera: '⚡',
  };

  const handleSelect = (id) => {
    onSelectPlayer(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1400,
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} id="player-sidebar">
        <div className="sidebar-header" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="sidebar-search"
            placeholder="Buscar jugadora..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-player"
          />
          {isOpen && (
            <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {Object.entries(filteredGroups).map(([position, players]) => (
          <div className="sidebar-group" key={position}>
            <div className="sidebar-group-title">
              {positionIcons[position]} {position}s
            </div>
            {players.map((player) => (
              <div
                key={player.id}
                className={`sidebar-item ${selectedPlayerId === player.id ? 'active' : ''}`}
                onClick={() => handleSelect(player.id)}
                id={`player-${player.id}`}
              >
                <div className="sidebar-item-avatar">
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.shortName} />
                  ) : (
                    getInitials(player.shortName)
                  )}
                </div>
                <div className="sidebar-item-info">
                  <div className="sidebar-item-name">{player.shortName}</div>
                  <div className="sidebar-item-meta">
                    <span className="sidebar-item-dorsal">#{player.dorsal}</span>
                    <span>{player.position}</span>
                  </div>
                </div>
                <div
                  className="sidebar-item-status"
                  style={{ backgroundColor: STATUS_COLORS[player.status] }}
                  title={player.status}
                />
              </div>
            ))}
          </div>
        ))}
      </aside>
    </>
  );
}
