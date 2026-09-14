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
            <span className="brand-sub font-mono">Deep-ocean survey intelligence</span>
          </div>
        </div>

        <div className="divider-vert"></div>

        <div className="mission-info">
          <div className="info-item">
            <Shield size={13} className="info-icon" />
            <span className="info-label">Mission:</span>
            <span className="info-val font-mono">PACIFIC-ABYSS-09</span>
          </div>
          <div className="info-item">
            <Waves size={13} className="info-icon" />
            <span className="info-label">Vessel:</span>
            <span className="info-val">R/V Oceanus Explorer</span>
          </div>
          <div className="info-item">
            <Compass size={13} className="info-icon" />
            <span className="info-label">Sector:</span>
            <span className="info-val font-mono">Sector 7-B (Mariana Ridge)</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="sonar-badge badge badge-cyan">
          <Radio size={12} className="animate-spin-slow" />
          <span>SAS-X4 · {sonarFrequency}</span>
        </div>

        <div className="live-status">
          <div className="pulse-indicator"></div>
          <span className="live-text font-mono">Live · 48 pings/s</span>
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
          <span>{audioMuted ? "Muted" : "Audio on"}</span>
        </button>
      </div>

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-soft);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
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
          border: 2px solid var(--teal-primary);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #E6F4F5;
        }
        .sonar-inner-ring {
          position: absolute;
          inset: 4px;
          border: 1px dashed var(--teal-bright);
          border-radius: 50%;
        }
        .sonar-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--teal-primary);
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .brand-name span {
          color: var(--teal-primary);
        }
        .brand-sub {
          font-size: 9px;
          letter-spacing: 0.8px;
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
          color: var(--text-secondary);
        }
        .info-icon {
          color: var(--teal-primary);
          opacity: 0.9;
        }
        .info-label {
          font-weight: 600;
          color: var(--text-muted);
          font-size: 11px;
        }
        .info-val {
          color: var(--text-primary);
          font-weight: 500;
        }
        .live-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #E6F4F5;
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          border: 1px solid #B2D9DD;
        }
        .live-text {
          font-size: 11px;
          color: var(--teal-primary);
          font-weight: 600;
        }
        .utc-clock {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-primary);
          background: var(--bg-surface-alt);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-soft);
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
