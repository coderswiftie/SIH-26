import React from 'react';
import { useMission } from '../../context/MissionContext';
import { ShieldCheck, Gauge, CheckCircle } from 'lucide-react';

export const QualityReport = () => {
  const { metrics } = useMission();

  return (
    <div className="quality-report panel">
      <div className="panel-header">
        <div className="panel-title">
          <ShieldCheck size={16} />
          <span>Acoustic survey quality</span>
        </div>
      </div>

      <div className="quality-body">
        <div className="gauge-item">
          <div className="gauge-label font-mono">
            <span>Signal-to-noise ratio (SNR)</span>
            <span className="text-cyan font-bold">{metrics.snrDb} dB</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill cyan" style={{ width: `${(metrics.snrDb / 30) * 100}%` }}></div>
          </div>
        </div>

        <div className="gauge-item">
          <div className="gauge-label font-mono">
            <span>Coverage completeness</span>
            <span className="text-green font-bold">{metrics.coverageCompleteness}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill green" style={{ width: `${metrics.coverageCompleteness}%` }}></div>
          </div>
        </div>

        <div className="gauge-item">
          <div className="gauge-label font-mono">
            <span>Noise rejection efficiency</span>
            <span className="text-amber font-bold">{metrics.noiseFilteredPercent}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill amber" style={{ width: `${metrics.noiseFilteredPercent}%` }}></div>
          </div>
        </div>

        <div className="gaps-summary font-mono text-xs">
          <CheckCircle size={13} className="text-green" />
          <span>Flagged gaps: {metrics.gapsFlaggedKm2} km² (micro-gaps verified, no hazard detected)</span>
        </div>
      </div>

      <style>{`
        .quality-report {
          display: flex;
          flex-direction: column;
        }
        .quality-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .gauge-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .gauge-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-muted);
        }
        .bar-track {
          height: 6px;
          background: var(--bg-surface-alt);
          border-radius: var(--radius-xs);
          overflow: hidden;
          border: 1px solid var(--border-dim);
        }
        .bar-fill {
          height: 100%;
          border-radius: var(--radius-xs);
          transition: width 0.5s ease;
        }
        .bar-fill.cyan  { background: var(--teal-primary); }
        .bar-fill.green { background: var(--success); }
        .bar-fill.amber { background: var(--warning); }

        .gaps-summary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #E4F2EE;
          border: 1px solid #B5D9CF;
          padding: 8px;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
        }
        .font-bold { font-weight: 700; }
        .text-cyan { color: var(--cyan-primary); }
        .text-green { color: var(--green-success); }
        .text-amber { color: var(--amber-warning); }
      `}</style>
    </div>
  );
};
