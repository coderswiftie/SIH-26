import React from 'react';
import { useMission } from '../../context/MissionContext';
import { LayoutDashboard, Database, AlertOctagon, Map, FileText, Cpu, HardDrive, Thermometer } from 'lucide-react';

export const LeftNav = () => {
  const { activeTab, setActiveTab, detections, hazards } = useMission();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'detection', label: 'Detection Feed', icon: Database, badge: detections.length },
    { id: 'investigation', label: 'Investigation Queue', icon: AlertOctagon, badge: detections.filter(d => d.status === 'PENDING_REVIEW' || d.type === 'Unknown').length, badgeColor: 'badge-amber' },
    { id: 'geo', label: 'Geo & Hazard Map', icon: Map, badge: hazards.length, badgeColor: 'badge-red' },
    { id: 'reports', label: 'Mission Reports', icon: FileText, badge: null }
  ];

  return (
    <aside className="left-nav">
      <div className="nav-section-label font-mono">Navigation</div>
      
      <nav className="nav-list">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-glow-beam"></div>
              <Icon size={16} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge !== null && (
                <span className={`badge ${item.badgeColor || 'badge-cyan'} nav-badge`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="nav-bottom-status panel">
        <div className="status-header font-mono">System status</div>
        <div className="telemetry-grid">
          <div className="telem-row">
            <Cpu size={12} />
            <span className="telem-label">AI Engine Load</span>
            <span className="telem-val font-mono">34.2%</span>
          </div>
          <div className="telem-row">
            <HardDrive size={12} />
            <span className="telem-label">Cache Memory</span>
            <span className="telem-val font-mono">1.8 GB</span>
          </div>
          <div className="telem-row">
            <Thermometer size={12} />
            <span className="telem-label">GPU Array Temp</span>
            <span className="telem-val font-mono text-green">42°C</span>
          </div>
        </div>
      </div>

      <style>{`
        .left-nav {
          background: var(--bg-surface);
          border-right: 1px solid var(--border-soft);
          display: flex;
          flex-direction: column;
          padding: 16px 12px;
          gap: 16px;
          height: 100%;
        }
        .nav-section-label {
          font-size: 10px;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          padding: 0 8px;
          text-transform: uppercase;
        }
        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .nav-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          text-align: left;
        }
        .nav-btn:hover {
          color: var(--text-primary);
          background: var(--bg-surface-alt);
        }
        .nav-btn.active {
          color: var(--teal-primary);
          background: #E6F4F5;
          border-color: transparent;
          font-weight: 600;
          box-shadow: inset 3px 0 0 var(--teal-primary);
        }
        /* The glow-beam element stays in DOM but is hidden in light theme */
        .nav-glow-beam {
          display: none;
        }
        .nav-icon {
          flex-shrink: 0;
        }
        .nav-label {
          flex: 1;
        }
        .nav-badge {
          font-size: 10px;
          padding: 1px 6px;
        }
        .nav-bottom-status {
          padding: 12px;
          background: var(--bg-surface-alt);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          box-shadow: none;
        }
        .status-header {
          font-size: 10px;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          margin-bottom: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .telemetry-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .telem-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: var(--text-secondary);
        }
        .telem-label {
          flex: 1;
        }
        .telem-val {
          color: var(--text-primary);
          font-weight: 600;
        }
        .text-green {
          color: var(--success);
        }
      `}</style>
    </aside>
  );
};
