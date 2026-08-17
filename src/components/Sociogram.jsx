import React, { useRef, useEffect, useState, useCallback } from 'react';
import { players, getInitials } from '../data/players';
import { saveLeadershipMap, getLeadershipMap } from '../utils/storage';
import { setupHiDPI } from '../utils/chartHelpers';

const ROLES = {
  'líder_formal': { label: 'Líder Formal', color: '#ee2523' },
  'líder_informal': { label: 'Líder Informal', color: '#f59e0b' },
  'conectora': { label: 'Conectora', color: '#3b82f6' },
  'emergente': { label: 'Emergente', color: '#22c55e' },
  'aislada': { label: 'Aislada', color: '#64748b' },
};

function getDefaultNodes() {
  const saved = getLeadershipMap();
  if (saved && saved.length > 0) return saved;

  // Layout en círculo
  const cx = 350;
  const cy = 250;
  const radius = 180;

  return players.map((p, i) => {
    const angle = (2 * Math.PI * i) / players.length - Math.PI / 2;
    return {
      playerId: p.id,
      name: p.shortName,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      role: 'conectora',
      influence: 5,
      connections: [],
    };
  });
}

export default function Sociogram() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState(getDefaultNodes);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [editRole, setEditRole] = useState(false);
  const width = 700;
  const height = 500;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = setupHiDPI(canvas, width, height);
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    nodes.forEach((node) => {
      if (node.connections) {
        node.connections.forEach((targetId) => {
          const target = nodes.find((n) => n.playerId === targetId);
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isSelected = selectedNode === node.playerId;
      const roleInfo = ROLES[node.role] || ROLES.conectora;
      const baseRadius = 16 + (node.influence / 10) * 10;

      // Glow for selected
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, baseRadius + 6, 0, 2 * Math.PI);
        ctx.fillStyle = `${roleInfo.color}30`;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, baseRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? roleInfo.color : `${roleInfo.color}40`;
      ctx.fill();
      ctx.strokeStyle = roleInfo.color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Initials
      ctx.font = `bold ${baseRadius * 0.6}px Outfit, sans-serif`;
      ctx.fillStyle = isSelected ? '#fff' : roleInfo.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getInitials(node.name), node.x, node.y);

      // Name label below
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + baseRadius + 14);
    });
  }, [nodes, selectedNode, width, height]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const mx = (e.clientX - rect.left);
    const my = (e.clientY - rect.top);

    for (const node of nodes) {
      const dist = Math.hypot(mx - node.x, my - node.y);
      if (dist < 30) {
        setDragging(node.playerId);
        setSelectedNode(node.playerId);
        return;
      }
    }
    setSelectedNode(null);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setNodes((prev) =>
      prev.map((n) =>
        n.playerId === dragging
          ? { ...n, x: Math.max(20, Math.min(width - 20, mx)), y: Math.max(20, Math.min(height - 20, my)) }
          : n
      )
    );
  };

  const handleMouseUp = () => {
    if (dragging) {
      saveLeadershipMap(nodes);
    }
    setDragging(null);
  };

  const updateNodeRole = (playerId, role) => {
    setNodes((prev) => {
      const updated = prev.map((n) =>
        n.playerId === playerId ? { ...n, role } : n
      );
      saveLeadershipMap(updated);
      return updated;
    });
  };

  const updateNodeInfluence = (playerId, influence) => {
    setNodes((prev) => {
      const updated = prev.map((n) =>
        n.playerId === playerId ? { ...n, influence } : n
      );
      saveLeadershipMap(updated);
      return updated;
    });
  };

  const toggleConnection = (fromId, toId) => {
    setNodes((prev) => {
      const updated = prev.map((n) => {
        if (n.playerId === fromId) {
          const conns = n.connections || [];
          const hasConn = conns.includes(toId);
          return {
            ...n,
            connections: hasConn
              ? conns.filter((c) => c !== toId)
              : [...conns, toId],
          };
        }
        return n;
      });
      saveLeadershipMap(updated);
      return updated;
    });
  };

  const selectedNodeData = nodes.find((n) => n.playerId === selectedNode);

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">🔗 Sociograma / Mapa de Liderazgo</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
            Arrastra los nodos para reorganizar
          </span>
        </div>

        <div className="sociogram-container">
          <canvas
            ref={canvasRef}
            className="sociogram-canvas"
            style={{ width, height, maxWidth: '100%' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <div className="sociogram-legend">
            {Object.entries(ROLES).map(([key, role]) => (
              <div className="sociogram-legend-item" key={key}>
                <span className="sociogram-legend-dot" style={{ background: role.color }} />
                {role.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de edición del nodo seleccionado */}
      {selectedNodeData && (
        <div className="card animate-slide-up">
          <div className="card-header">
            <h3 className="card-title">
              ✏️ {selectedNodeData.name}
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedNode(null)}>
              ✕ Cerrar
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Rol en el equipo</label>
            <select
              className="form-select"
              value={selectedNodeData.role}
              onChange={(e) => updateNodeRole(selectedNode, e.target.value)}
            >
              {Object.entries(ROLES).map(([key, role]) => (
                <option key={key} value={key}>{role.label}</option>
              ))}
            </select>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span className="slider-label">Nivel de influencia</span>
              <span className="slider-value">{selectedNodeData.influence}</span>
            </div>
            <input
              type="range"
              className="slider-input"
              min="1"
              max="10"
              value={selectedNodeData.influence}
              onChange={(e) => updateNodeInfluence(selectedNode, parseInt(e.target.value, 10))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Conexiones (click para conectar/desconectar)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {nodes
                .filter((n) => n.playerId !== selectedNode)
                .map((n) => {
                  const isConnected = (selectedNodeData.connections || []).includes(n.playerId);
                  return (
                    <button
                      key={n.playerId}
                      className={`btn btn-sm ${isConnected ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => toggleConnection(selectedNode, n.playerId)}
                      style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                    >
                      {n.name}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
