import React from 'react';
import { Layers, ShieldAlert, Leaf, Eye } from 'lucide-react';

export const MapControls = ({ activeLayer, setActiveLayer }) => {
  const layers = [
    { id: 'hazard', label: 'Hazard Priority Layer', icon: ShieldAlert, color: 'var(--red-hazard)' },
    { id: 'ecological', label: 'Ecological Sensitivity Layer', icon: Leaf, color: 'var(--green-success)' },
    { id: 'confidence', label: 'Confidence & Uncertainty Heat', icon: Eye, color: 'var(--cyan-primary)' }
  ];

  return (
    <div className="map-controls panel">
      <div className="panel-header">
        <div className="panel-title">
          <Layers size={14} />
          <span>BATHYMETRIC LAYER SWITCHER</span>
        </div>
      </div>

      <div className="controls-body">
        {layers.map(layer => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;

          return (
            <button 
              key={layer.id}
              className={`layer-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <Icon size={14} style={{ color: layer.color }} />
              <span className="font-mono text-xs">{layer.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .map-controls {
          display: flex;
          flex-direction: column;
        }
        .controls-body {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .layer-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--bg-inset);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-xs);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .layer-btn:hover {
          color: var(--text-bright);
          border-color: var(--cyan-primary);
        }
        .layer-btn.active {
          background: rgba(0, 229, 255, 0.12);
          border-color: var(--cyan-primary);
          color: var(--text-bright);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
