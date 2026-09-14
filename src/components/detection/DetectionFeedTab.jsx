import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { Database, Search, Filter, Target, ShieldAlert, ArrowUpDown } from 'lucide-react';

export const DetectionFeedTab = () => {
  const { detections, selectedObjectId, selectObject, confirmHazard } = useMission();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [minConfidence, setMinConfidence] = useState(50);

  const filteredDetections = detections.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesConf = d.confidence >= minConfidence;
    return matchesSearch && matchesType && matchesStatus && matchesConf;
  });

  return (
    <div className="detection-feed-tab">
      <div className="view-header">
        <div>
          <h1 className="font-display text-bright">DETECTION LOG FEED</h1>
          <p className="font-mono text-muted text-xs">Acoustic Targets Ingested by YOLO11 & Autonomous AI Anomaly Detectors</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="toolbar-panel panel">
        <div className="search-box">
          <Search size={14} className="search-icon text-muted" />
          <input 
            type="text" 
            placeholder="Search Target ID, Class, or Description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-text font-mono"
          />
        </div>

        <div className="filter-group">
          <Filter size={13} className="text-muted" />
          <span className="font-mono text-xs text-muted">TYPE:</span>
          <select 
            className="select-box"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="Known">YOLO11 Knowns</option>
            <option value="Unknown">Anomaly Unknowns</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="font-mono text-xs text-muted">STATUS:</span>
          <select 
            className="select-box"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="HIGH_HAZARD">High Hazard</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="font-mono text-xs text-muted">MIN CONF: {minConfidence}%</span>
          <input 
            type="range" 
            min="50" 
            max="95" 
            value={minConfidence} 
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="conf-slider"
          />
        </div>
      </div>

      {/* Table Panel */}
      <div className="table-panel panel">
        <div className="table-scroll-container">
          <table className="detection-table">
            <thead>
              <tr className="font-mono">
                <th>ID</th>
                <th>CLASSIFICATION</th>
                <th>TYPE</th>
                <th>CONFIDENCE</th>
                <th>DEPTH</th>
                <th>COORDINATES (LAT / LNG)</th>
                <th>HAZARD SCORE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetections.map((item) => {
                const isSelected = item.id === selectedObjectId;
                const isUnknown = item.type === 'Unknown';

                return (
                  <tr 
                    key={item.id} 
                    className={`table-row ${isSelected ? 'row-selected' : ''}`}
                    onClick={() => selectObject(item.id)}
                  >
                    <td className="font-mono font-bold text-cyan">{item.id}</td>
                    <td className="font-mono text-bright">{item.class}</td>
                    <td>
                      <span className={`badge ${isUnknown ? 'badge-amber' : 'badge-cyan'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="font-mono text-bright">{item.confidence}%</td>
                    <td className="font-mono text-muted">{item.depth} m</td>
                    <td className="font-mono text-xs text-faint">{item.lat} · {item.lng}</td>
                    <td>
                      <span className={`badge ${item.hazardScore > 75 ? 'badge-red' : item.hazardScore > 50 ? 'badge-amber' : 'badge-green'}`}>
                        {item.hazardScore}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-bright">{item.status}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button 
                          className="btn btn-xs btn-outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectObject(item.id);
                          }}
                        >
                          <Target size={12} /> Inspect
                        </button>
                        {isUnknown && item.status !== 'HIGH_HAZARD' && (
                          <button 
                            className="btn btn-xs btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmHazard(item.id);
                            }}
                          >
                            <ShieldAlert size={12} /> Hazard
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .detection-feed-tab {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .toolbar-panel {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          position: relative;
          flex: 1;
          min-width: 240px;
        }
        .search-icon {
          position: absolute;
          left: 10px;
        }
        .search-box input {
          width: 100%;
          padding-left: 32px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .conf-slider {
          accent-color: var(--cyan-primary);
          width: 90px;
          cursor: pointer;
        }
        .table-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .table-scroll-container {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 520px;
        }
        .detection-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 12px;
        }
        .detection-table th {
          background: rgba(0, 229, 255, 0.04);
          color: var(--text-muted);
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-soft);
          font-size: 10.5px;
          letter-spacing: 0.5px;
        }
        .detection-table td {
          padding: 11px 14px;
          border-bottom: 1px solid var(--border-dim);
        }
        .table-row {
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .table-row:hover {
          background: rgba(0, 229, 255, 0.05);
        }
        .row-selected {
          background: rgba(0, 229, 255, 0.12) !important;
          border-left: 3px solid var(--cyan-primary);
        }
        .row-actions {
          display: flex;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};
