import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { PhysicsBadge } from './PhysicsBadge';
import { ShieldAlert, AlertOctagon, RefreshCw, Check, X, PlusCircle, Target } from 'lucide-react';

export const InvestigationTab = () => {
  const { 
    detections, 
    selectedObjectId, 
    selectObject, 
    confirmHazard, 
    reclassifyObject, 
    dismissObject,
    updatePhysicsStatus,
    injectSimulatedAnomaly 
  } = useMission();

  const [selectedNewClass, setSelectedNewClass] = useState('Subsea Pipeline');
  const [reclassifyingId, setReclassifyingId] = useState(null);

  const anomalies = detections.filter(d => d.type === 'Unknown' || d.status === 'PENDING_REVIEW' || d.status === 'HIGH_HAZARD');

  return (
    <div className="investigation-tab">
      <div className="view-header">
        <div>
          <h1 className="font-display text-bright">Anomaly investigation queue</h1>
          <p className="font-mono text-muted text-xs">Multi-aspect sonar ping audit and acoustic shadow consistency verification</p>
        </div>

        <button className="btn btn-cyan" onClick={injectSimulatedAnomaly}>
          <PlusCircle size={14} /> Inject simulated anomaly
        </button>
      </div>

      <div className="anomaly-grid">
        {anomalies.map((item) => {
          const isSelected = item.id === selectedObjectId;
          const { physics } = item;

          return (
            <div 
              key={item.id}
              className={`anomaly-card panel ${isSelected ? 'card-selected' : ''}`}
              onClick={() => selectObject(item.id)}
            >
              <div className="panel-header">
                <div className="panel-title">
                  <AlertOctagon size={16} className="text-amber" />
                  <span>{item.id}: {item.class}</span>
                </div>
                <span className={`badge ${item.hazardScore > 75 ? 'badge-red' : 'badge-amber'}`}>
                  Hazard: {item.hazardScore}/100
                </span>
              </div>

              <div className="card-body">
                <div className="card-top-info font-mono text-xs">
                  <div><span className="text-muted">Depth:</span> <span className="text-cyan font-bold">{item.depth} m</span></div>
                  <div><span className="text-muted">Confidence:</span> <span className="text-bright font-bold">{item.confidence}%</span></div>
                  <div><span className="text-muted">Coords:</span> <span className="text-muted">{item.lat} · {item.lng}</span></div>
                </div>

                {/* Physics Verification Checklist */}
                <div className="physics-checklist-card">
                  <div className="checklist-title font-mono text-xs text-bright font-bold">
                    Physics verification audit:
                  </div>

                  {/* Item 1: Shadow Length */}
                  <div className="check-row">
                    <span className="check-label font-mono text-xs">Shadow length consistency</span>
                    <PhysicsBadge status={physics.shadowStatus} />
                    <div className="check-buttons">
                      <button 
                        className={`btn btn-xs ${physics.shadowStatus === 'PASS' ? 'btn-cyan' : 'btn-outline'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePhysicsStatus(item.id, 'shadowStatus', 'PASS');
                        }}
                      >
                        Pass
                      </button>
                      <button 
                        className={`btn btn-xs ${physics.shadowStatus === 'FAIL' ? 'btn-danger' : 'btn-outline'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePhysicsStatus(item.id, 'shadowStatus', 'FAIL');
                        }}
                      >
                        Fail
                      </button>
                    </div>
                  </div>

                  {/* Item 2: Cross Ping */}
                  <div className="check-row">
                    <span className="check-label font-mono text-xs">Cross-ping coherence</span>
                    <PhysicsBadge status={physics.crossPingStatus} />
                    <div className="check-buttons">
                      <button 
                        className={`btn btn-xs ${physics.crossPingStatus === 'PASS' ? 'btn-cyan' : 'btn-outline'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePhysicsStatus(item.id, 'crossPingStatus', 'PASS');
                        }}
                      >
                        Pass
                      </button>
                    </div>
                  </div>

                  {/* Item 3: Size Plausibility */}
                  <div className="check-row">
                    <span className="check-label font-mono text-xs">Size & reflectivity</span>
                    <PhysicsBadge status={physics.sizePlausibility} />
                  </div>
                </div>

                {/* Analyst Notes */}
                <div className="card-notes font-mono text-xs text-muted">
                  {item.notes}
                </div>

                {/* Card Action Controls */}
                <div className="card-actions">
                  <button 
                    className="btn btn-xs btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmHazard(item.id);
                    }}
                  >
                    <ShieldAlert size={12} /> Confirm hazard
                  </button>

                  <button 
                    className="btn btn-xs btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReclassifyingId(reclassifyingId === item.id ? null : item.id);
                    }}
                  >
                    <RefreshCw size={12} /> Reclassify
                  </button>

                  <button 
                    className="btn btn-xs btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissObject(item.id);
                    }}
                  >
                    <X size={12} /> Dismiss
                  </button>
                </div>

                {reclassifyingId === item.id && (
                  <div className="reclassify-inline-box" onClick={(e) => e.stopPropagation()}>
                    <select 
                      className="select-box select-xs"
                      value={selectedNewClass}
                      onChange={(e) => setSelectedNewClass(e.target.value)}
                    >
                      <option value="Subsea Pipeline">Subsea Pipeline</option>
                      <option value="Subsea Cable">Subsea Cable</option>
                      <option value="Shipwreck Hull">Shipwreck Hull</option>
                      <option value="Submerged UXO / Mine">Submerged UXO / Mine</option>
                    </select>
                    <button 
                      className="btn btn-xs btn-cyan"
                      onClick={() => {
                        reclassifyObject(item.id, selectedNewClass);
                        setReclassifyingId(null);
                      }}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .investigation-tab {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .anomaly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 14px;
        }
        .anomaly-card {
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .card-selected {
          border-color: var(--teal-primary);
          box-shadow: 0 0 0 2px rgba(8, 127, 140, 0.15);
        }
        .card-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .card-top-info {
          display: flex;
          justify-content: space-between;
          background: var(--bg-surface-alt);
          padding: 8px 10px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-dim);
        }
        .physics-checklist-card {
          background: var(--bg-surface-alt);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-xs);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .check-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .check-label {
          color: var(--text-muted);
          flex: 1;
        }
        .check-buttons {
          display: flex;
          gap: 4px;
        }
        .card-notes {
          background: var(--bg-surface-alt);
          padding: 8px;
          border-radius: var(--radius-xs);
          border-left: 2px solid var(--warning);
        }
        .card-actions {
          display: flex;
          gap: 6px;
        }
        .reclassify-inline-box {
          display: flex;
          gap: 6px;
          background: var(--bg-surface-alt);
          padding: 8px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--teal-primary);
        }
      `}</style>
    </div>
  );
};
