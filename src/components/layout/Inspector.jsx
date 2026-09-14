import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { Target, ShieldAlert, CheckCircle2, AlertTriangle, Eye, Download, Check, X, RefreshCw, Send } from 'lucide-react';

export const Inspector = () => {
  const { selectedObject, confirmHazard, reclassifyObject, dismissObject, escalateToCommand, updatePhysicsStatus } = useMission();
  const [reclassifyModalOpen, setReclassifyModalOpen] = useState(false);
  const [selectedNewClass, setSelectedNewClass] = useState('Subsea Cable');

  if (!selectedObject) {
    return (
      <aside className="inspector panel">
        <div className="empty-inspector">
          <Target size={32} className="text-muted" />
          <p>No target locked. Select an object from the Sonar view or Detection Feed.</p>
        </div>
      </aside>
    );
  }

  const { physics } = selectedObject;

  const handleDownloadChip = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Draw synthetic sonar chip export
    ctx.fillStyle = '#030d14';
    ctx.fillRect(0, 0, 300, 300);

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 300; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 300); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(300, i); ctx.stroke();
    }

    ctx.fillStyle = '#00E5FF';
    ctx.font = '14px monospace';
    ctx.fillText(`CyanO SONAR CHIP - ${selectedObject.id}`, 15, 25);
    ctx.fillText(`DEPTH: ${selectedObject.depth}m | CONF: ${selectedObject.confidence}%`, 15, 45);

    // Target highlight
    ctx.fillStyle = selectedObject.type === 'Unknown' ? '#FF5570' : '#00E5FF';
    ctx.fillRect(100, 110, 100, 50);
    ctx.fillStyle = '#02070b';
    ctx.fillRect(100, 160, 120, 40); // Acoustic shadow

    const link = document.createElement('a');
    link.download = `sonar_chip_${selectedObject.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <aside className="inspector panel">
      <div className="panel-header">
        <div className="panel-title">
          <Target size={16} />
          <span>Target Lock: {selectedObject.id}</span>
        </div>
        <span className={`badge ${selectedObject.type === 'Unknown' ? 'badge-amber' : 'badge-teal'}`}>
          {selectedObject.type}
        </span>
      </div>

      <div className="inspector-scroll-body">
        {/* Sonar Chip Renderer */}
        <div className="sonar-chip-container">
          <div className="sonar-chip-header">
            <span className="font-mono text-xs text-muted">High-res acoustic chip (900 kHz)</span>
            <span className="font-mono text-xs" style={{ color: 'var(--teal-primary)' }}>{selectedObject.confidence}% confidence</span>
          </div>

          <div className="chip-viewport">
            <div className="chip-grid-overlay"></div>
            
            {/* SVG Synthetic Target Simulation */}
            <svg viewBox="0 0 200 140" className="chip-svg">
              {/* Noise Background Texture */}
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.02   0 0 0 0 0.1   0 0 0 0 0.15  0.4 0 0 0 0" />
              </filter>
              <rect width="200" height="140" fill="#051520" />
              <rect width="200" height="140" filter="url(#noiseFilter)" />

              {/* Acoustic Shadow */}
              <ellipse cx="115" cy="85" rx="45" ry="18" fill="rgba(2, 8, 12, 0.95)" transform="rotate(-15 115 85)" />

              {/* Object Highlighting */}
              {selectedObject.chipSvgType === 'pipeline' && (
                <rect x="30" y="55" width="120" height="12" rx="3" fill="#13A7B5" />
              )}
              {selectedObject.chipSvgType === 'cylinder' && (
                <rect x="75" y="45" width="50" height="25" rx="4" fill="#C84A4A" />
              )}
              {selectedObject.chipSvgType === 'mine' && (
                <circle cx="95" cy="55" r="18" fill="#C84A4A" />
              )}
              {selectedObject.chipSvgType === 'wreck' && (
                <polygon points="50,65 140,40 120,75 40,75" fill="#13A7B5" opacity="0.75" />
              )}
              {selectedObject.chipSvgType === 'cable' && (
                <path d="M 10 90 Q 90 40 190 70" stroke="#13A7B5" strokeWidth="3" fill="none" />
              )}
              {selectedObject.chipSvgType === 'mound' && (
                <ellipse cx="95" cy="55" rx="35" ry="20" fill="#B9852E" opacity="0.55" />
              )}

              {/* Target Bounding Reticle */}
              <rect x="35" y="25" width="130" height="85" fill="none" stroke={selectedObject.type === 'Unknown' ? '#C84A4A' : '#13A7B5'} strokeWidth="1" strokeDasharray={selectedObject.type === 'Unknown' ? '4 4' : 'none'} />
              <circle cx="100" cy="67" r="2" fill="rgba(255,255,255,0.5)" />
            </svg>

            <div className="chip-overlay-reticle">
              <span className="reticle-top-left font-mono">LAT: {selectedObject.lat}</span>
              <span className="reticle-top-right font-mono">LNG: {selectedObject.lng}</span>
            </div>
          </div>
        </div>

        {/* Primary Metadata Table */}
        <div className="meta-card">
          <div className="meta-row">
            <span className="meta-key">Classification</span>
            <span className="meta-val font-mono" style={{ color: 'var(--text-primary)' }}>{selectedObject.class}</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">Depth</span>
            <span className="meta-val font-mono" style={{ color: 'var(--teal-primary)' }}>{selectedObject.depth} m</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">Hazard score</span>
            <span className="meta-val font-mono">
              <span className={`badge ${selectedObject.hazardScore > 75 ? 'badge-red' : selectedObject.hazardScore > 50 ? 'badge-amber' : 'badge-green'}`}>
                {selectedObject.hazardScore} / 100
              </span>
            </span>
          </div>
          <div className="meta-row">
            <span className="meta-key">Status</span>
            <span className="meta-val font-mono">{selectedObject.status}</span>
          </div>
        </div>

        {/* Physics-Fusion Evidence Verification Engine */}
        <div className="physics-section">
          <div className="section-title font-display">
            <ShieldAlert size={14} style={{ color: 'var(--teal-primary)' }} />
            <span>Physics-evidence audit</span>
          </div>

          <div className="physics-card">
            {/* Shadow Consistency */}
            <div className="physics-item">
              <div className="phys-head">
                <span className="phys-label">Shadow Length Correlation</span>
                <span className={`badge ${physics.shadowStatus === 'PASS' ? 'badge-green' : physics.shadowStatus === 'PENDING' ? 'badge-amber' : 'badge-red'}`}>
                  {physics.shadowStatus}
                </span>
              </div>
              <div className="phys-details font-mono">
                Expected: {physics.shadowLengthExpected} | Measured: {physics.shadowLengthMeasured} (Match: {physics.shadowMatchRatio}%)
              </div>
              <div className="phys-controls">
                <button 
                  className={`btn btn-xs ${physics.shadowStatus === 'PASS' ? 'btn-cyan' : 'btn-outline'}`}
                  onClick={() => updatePhysicsStatus(selectedObject.id, 'shadowStatus', 'PASS')}
                >
                  <Check size={12} /> Pass
                </button>
                <button 
                  className={`btn btn-xs ${physics.shadowStatus === 'PENDING' ? 'btn-cyan' : 'btn-outline'}`}
                  onClick={() => updatePhysicsStatus(selectedObject.id, 'shadowStatus', 'PENDING')}
                >
                  Pending
                </button>
                <button 
                  className={`btn btn-xs ${physics.shadowStatus === 'FAIL' ? 'btn-danger' : 'btn-outline'}`}
                  onClick={() => updatePhysicsStatus(selectedObject.id, 'shadowStatus', 'FAIL')}
                >
                  <X size={12} /> Fail
                </button>
              </div>
            </div>

            {/* Cross-Ping Temporal Coherence */}
            <div className="physics-item">
              <div className="phys-head">
                <span className="phys-label">Cross-Ping Coherence</span>
                <span className={`badge ${physics.crossPingStatus === 'PASS' ? 'badge-green' : 'badge-amber'}`}>
                  {physics.crossPingStatus}
                </span>
              </div>
              <div className="phys-details font-mono">
                Acoustic Aspect: {physics.crossPingCoherence}
              </div>
              <div className="phys-controls">
                <button 
                  className={`btn btn-xs ${physics.crossPingStatus === 'PASS' ? 'btn-cyan' : 'btn-outline'}`}
                  onClick={() => updatePhysicsStatus(selectedObject.id, 'crossPingStatus', 'PASS')}
                >
                  <Check size={12} /> Pass
                </button>
                <button 
                  className={`btn btn-xs ${physics.crossPingStatus === 'PENDING' ? 'btn-cyan' : 'btn-outline'}`}
                  onClick={() => updatePhysicsStatus(selectedObject.id, 'crossPingStatus', 'PENDING')}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Impedance & Size Plausibility */}
            <div className="physics-item">
              <div className="phys-head">
                <span className="phys-label">Acoustic Impedance & Size</span>
                <span className={`badge ${physics.sizePlausibility === 'PASS' ? 'badge-green' : 'badge-amber'}`}>
                  {physics.sizePlausibility}
                </span>
              </div>
              <div className="phys-details font-mono">
                Reflectivity: {physics.impedanceReflectivity}
              </div>
            </div>
          </div>
        </div>

        {/* Analyst Notes */}
        <div className="notes-card font-mono text-xs">
          <span className="text-muted">Analyst note:</span>
          <p className="text-main">{selectedObject.notes}</p>
        </div>

        {/* Action Buttons */}
        <div className="action-button-group">
          <button 
            className="btn btn-danger btn-full"
            onClick={() => confirmHazard(selectedObject.id)}
          >
            <ShieldAlert size={14} /> Confirm high hazard
          </button>

          <div className="button-grid">
            <button 
              className="btn btn-outline"
              onClick={() => setReclassifyModalOpen(!reclassifyModalOpen)}
            >
              <RefreshCw size={13} /> Reclassify
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => dismissObject(selectedObject.id)}
            >
              <X size={13} /> Dismiss
            </button>
            <button 
              className="btn btn-amber"
              style={{ background: 'rgba(185,133,46,0.1)', color: 'var(--warning)', borderColor: 'rgba(185,133,46,0.4)' }}
              onClick={() => escalateToCommand(selectedObject.id)}
            >
              <Send size={13} /> Escalate
            </button>
          </div>

          <button 
            className="btn btn-cyan btn-full"
            onClick={handleDownloadChip}
          >
            <Download size={14} /> Export high-res chip (PNG)
          </button>

          {reclassifyModalOpen && (
            <div className="reclassify-box">
              <span className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>Select new taxonomy class:</span>
              <select 
                className="select-box"
                value={selectedNewClass}
                onChange={(e) => setSelectedNewClass(e.target.value)}
              >
                <option value="Subsea Cable">Subsea Cable</option>
                <option value="Subsea Pipeline">Subsea Pipeline</option>
                <option value="Submerged UXO / Mine">Submerged UXO / Mine</option>
                <option value="Shipwreck Hull">Shipwreck Hull</option>
                <option value="Deep Sea Coral Colony">Deep Sea Coral Colony</option>
                <option value="Hydrothermal Vent Plume">Hydrothermal Vent Plume</option>
              </select>
              <button 
                className="btn btn-cyan btn-xs"
                onClick={() => {
                  reclassifyObject(selectedObject.id, selectedNewClass);
                  setReclassifyModalOpen(false);
                }}
              >
                Apply reclassification
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .inspector {
          height: 100%;
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border-soft);
          background: var(--bg-surface);
        }
        .inspector-scroll-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .empty-inspector {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          gap: 12px;
          padding: 20px;
          text-align: center;
        }
        .sonar-chip-container {
          background: #0A1C24;
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          padding: 10px;
        }
        .sonar-chip-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .chip-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-xs);
          overflow: hidden;
          border: 1px solid var(--border-dim);
        }
        .chip-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .chip-overlay-reticle {
          position: absolute;
          inset: 6px;
          pointer-events: none;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: var(--text-muted);
        }
        .meta-card {
          background: var(--bg-surface-alt);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }
        .meta-key {
          color: var(--text-muted);
          font-weight: 500;
        }
        .meta-val {
          font-weight: 600;
        }
        .physics-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .physics-card {
          background: var(--bg-surface-alt);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .physics-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .phys-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
        }
        .phys-details {
          font-size: 10px;
          color: var(--text-muted);
        }
        .phys-controls {
          display: flex;
          gap: 4px;
          margin-top: 4px;
        }
        .notes-card {
          background: var(--bg-surface-alt);
          border: 1px solid var(--border-soft);
          padding: 10px;
          border-radius: var(--radius-sm);
        }
        .action-button-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }
        .btn-full {
          width: 100%;
        }
        .button-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
        }
        .reclassify-box {
          background: var(--bg-surface-alt);
          border: 1px solid var(--teal-primary);
          padding: 10px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </aside>
  );
};
