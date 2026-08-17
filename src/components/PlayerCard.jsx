import React from 'react';
import { getInitials, STATUS_COLORS, STATUS_LABELS } from '../data/players';

export default function PlayerCard({ player }) {
  if (!player) return null;

  const statusColor = STATUS_COLORS[player.status];
  const statusLabel = STATUS_LABELS[player.status];

  return (
    <div className="player-card animate-fade-in" id="player-card">
      <div className="player-dorsal">#{player.dorsal}</div>
      <div className="player-avatar-large">
        {player.photoUrl ? (
          <img src={player.photoUrl} alt={player.fullName} />
        ) : (
          getInitials(player.shortName)
        )}
      </div>
      <div className="player-info">
        <h2 className="player-name">{player.fullName}</h2>
        <div className="player-position">{player.position}</div>
        <div className="player-details">
          <div className="player-detail">
            <span className="player-detail-label">Dorsal</span>
            <span className="player-detail-value">#{player.dorsal}</span>
          </div>
          {player.birthDate && (
            <div className="player-detail">
              <span className="player-detail-label">Nacimiento</span>
              <span className="player-detail-value">{player.birthDate}</span>
            </div>
          )}
          {player.birthPlace && (
            <div className="player-detail">
              <span className="player-detail-label">Lugar</span>
              <span className="player-detail-value">{player.birthPlace}</span>
            </div>
          )}
          {player.seasons && (
            <div className="player-detail">
              <span className="player-detail-label">Temporadas</span>
              <span className="player-detail-value">{player.seasons}</span>
            </div>
          )}
          {player.officialMatches && (
            <div className="player-detail">
              <span className="player-detail-label">Partidos</span>
              <span className="player-detail-value">{player.officialMatches}</span>
            </div>
          )}
          <div className="player-detail">
            <span className="player-detail-label">Estado</span>
            <span
              className="player-status-badge"
              style={{
                backgroundColor: `${statusColor}18`,
                color: statusColor,
                border: `1px solid ${statusColor}40`,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: statusColor,
                  display: 'inline-block',
                }}
              />
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
