import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Volume2, VolumeX, Radio, Shield, Waves, Compass, Clock } from 'lucide-react';

export const TopBar = () => {
  const { audioMuted, toggleAudio, utcTime, sonarFrequency } = useMission();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-badge">
          <div className="sonar-logo">
            <div className="sonar-inner-ring"></div>
            <div className="sonar-dot"></div>
          </div>
          <div className="brand-text">
            <span className="brand-name font-display">Cyan<span>O</span></span>
            <span className="brand-sub font-mono">DEEP OCEAN INTEL v2.4</span>
          </div>
        </div>

        <div className="divider-vert"></div>

        <div className="mission-info">
          <div className="info-item">
            <Shield size={13} className="info-icon" />
            <span className="info-label">MISSION:</span>
            <span className="info-val font-mono">PACIFIC-ABYSS-09</span>
          </div>
          <div className="info-item">
            <Waves size={13} className="info-icon" />
            <span className="info-label">VESSEL:</span>
            <span className="info-val">R/V Oceanus Explorer</span>
          </div>
          <div className="info-item">
            <Compass size={13} className="info-icon" />
            <span className="info-label">SECTOR:</span>
            <span className="info-val font-mono">Sector 7-B (Mariana Ridge)</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="sonar-badge badge badge-cyan">
          <Radio size={12} className="animate-spin-slow" />
          <span>SAS-X4 APERTURE ({sonarFrequency})</span>
        </div>

        <div className="live-status">
          <div className="pulse-indicator"></div>
          <span className="live-text font-mono">LIVE INGESTION (48 pings/s)</span>
        </div>

        <div className="utc-clock font-mono">
          <Clock size={13} />
          <span>{utcTime}</span>
        </div>

        <button 
          className={`btn btn-xs ${audioMuted ? 'btn-outline' : 'btn-cyan'}`} 
          onClick={toggleAudio}
          title={audioMuted ? "Unmute Sonar Telemetry Audio" : "Mute Sonar Telemetry Audio"}
        >
          {audioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          <span>{audioMuted ? "MUTED" : "ACOUSTIC FEED"}</span>
        </button>
      </div>

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: rgba(3, 15, 23, 0.95);
          border-bottom: 1px solid var(--border-soft);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
          z-index: 100;
        }
        .topbar-left, .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .brand-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sonar-logo {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--cyan-primary);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 229, 255, 0.1);
        }
        .sonar-inner-ring {
          position: absolute;
          inset: 4px;
          border: 1px dashed rgba(0, 229, 255, 0.5);
          border-radius: 50%;
        }
        .sonar-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cyan-primary);
          box-shadow: 0 0 8px var(--cyan-primary);
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--text-bright);
          line-height: 1.1;
        }
        .brand-name span {
          color: var(--cyan-primary);
        }
        .brand-sub {
          font-size: 9px;
          letter-spacing: 1px;
          color: var(--text-muted);
        }
        .divider-vert {
          width: 1px;
          height: 22px;
          background: var(--border-soft);
        }
        .mission-info {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
        }
        .info-icon {
          color: var(--cyan-primary);
          opacity: 0.8;
        }
        .info-label {
          font-weight: 600;
          color: var(--text-faint);
          font-size: 11px;
        }
        .info-val {
          color: var(--text-bright);
          font-weight: 500;
        }
        .live-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 229, 255, 0.06);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-dim);
        }
        .live-text {
          font-size: 11px;
          color: var(--cyan-primary);
          font-weight: 600;
        }
        .utc-clock {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-bright);
          background: var(--bg-inset);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-dim);
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};
