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
          <span>PRIORITY BENTHIC HAZARD RANKING & RECOMMENDATIONS</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="hazard-table font-mono">
          <thead>
            <tr>
              <th>HAZARD ID</th>
              <th>TARGET LINK</th>
              <th>PRIORITY</th>
              <th>HAZARD SCORE</th>
              <th>ECOLOGICAL SENSITIVITY</th>
              <th>RECOMMENDED ACTION</th>
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
          background: rgba(0, 229, 255, 0.04);
          color: var(--text-muted);
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-soft);
          font-size: 10px;
        }
        .hazard-table td {
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-dim);
        }
        .hazard-row {
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .hazard-row:hover {
          background: rgba(0, 229, 255, 0.05);
        }
        .text-red { color: var(--red-hazard); }
      `}</style>
    </div>
  );
};
