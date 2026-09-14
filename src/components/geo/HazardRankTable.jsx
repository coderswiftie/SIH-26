import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ShieldAlert, AlertTriangle, Info, Target } from 'lucide-react';

export const HazardRankTable = () => {
  const { hazards, selectObject, selectedObjectId } = useMission();

  return (
    <div className="hazard-table-panel panel">
      <div className="panel-header">
        <div className="panel-title">
          <ShieldAlert size={16} />
          <span>Priority benthic hazards</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="hazard-table font-mono">
          <thead>
            <tr>
              <th>Hazard ID</th>
              <th>Target link</th>
              <th>Priority</th>
              <th>Hazard score</th>
              <th>Ecological sensitivity</th>
              <th>Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {hazards.map((h) => {
              const isSelected = h.targetId === selectedObjectId;
              return (
                <tr 
                  key={h.id} 
                  className={`hazard-row ${isSelected ? 'row-selected' : ''}`}
                  onClick={() => selectObject(h.targetId)}
                >
                  <td className="font-bold text-red">{h.id}</td>
                  <td className="text-cyan font-bold">{h.targetId}</td>
                  <td>
                    <span className={`badge ${h.priority === 'HIGH' ? 'badge-red' : h.priority === 'MEDIUM' ? 'badge-amber' : 'badge-green'}`}>
                      {h.priority}
                    </span>
                  </td>
                  <td className="font-bold text-bright">{h.hazardIndex} / 100</td>
                  <td className="text-muted">{h.ecologicalSensitivity}</td>
                  <td className="text-bright text-xs">{h.recommendedAction}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        .hazard-table-panel {
          display: flex;
          flex-direction: column;
        }
        .table-wrapper {
          overflow-x: auto;
          max-height: 220px;
        }
        .hazard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 11px;
        }
        .hazard-table th {
          background: var(--bg-surface-alt);
          color: var(--text-muted);
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-soft);
          font-size: 10px;
          font-weight: 600;
        }
        .hazard-table td {
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-dim);
          color: var(--text-primary);
        }
        .hazard-row {
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .hazard-row:hover {
          background: #EEF6F7;
        }
        .row-selected {
          background: #E3F3F5 !important;
          border-left: 3px solid var(--teal-primary);
        }
        .text-red   { color: var(--hazard); }
        .text-cyan  { color: var(--teal-primary); }
        .text-bright{ color: var(--text-primary); }
        .text-muted { color: var(--text-muted); }
      `}</style>
    </div>
  );
};
