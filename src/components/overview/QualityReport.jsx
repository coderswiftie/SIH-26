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
          <span>SURVEY ACOUSTIC QUALITY REPORT</span>
        </div>
      </div>

      <div className="quality-body">
        <div className="gauge-item">
          <div className="gauge-label font-mono">
            <span>SIGNAL-TO-NOISE RATIO (SNR)</span>
            <span className="text-cyan font-bold">{metrics.snrDb} dB</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill cyan" style={{ width: `${(metrics.snrDb / 30) * 100}%` }}></div>
          </div>
        </div>

        <div className="gauge-item">
          <div className="gauge-label font-mono">
            <span>COVERAGE COMPLETENESS</span>
            <span className="text-green font-bold">{metrics.coverageCompleteness}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill green" style={{ width: `${metrics.coverageCompleteness}%` }}></div>
          </div>
        </div>

        <div className="gauge-item">
          <div className="gauge-label font-mono">
            <span>NOISE REJECTION EFFICIENCY</span>
            <span className="text-amber font-bold">{metrics.noiseFilteredPercent}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill amber" style={{ width: `${metrics.noiseFilteredPercent}%` }}></div>
          </div>
        </div>

        <div className="gaps-summary font-mono text-xs">
          <CheckCircle size={13} className="text-green" />
          <span>GAPS FLAGGED: {metrics.gapsFlaggedKm2} km² (MICRO-GAPS VERIFIED NO HAZARD)</span>
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
          background: var(--bg-inset);
          border-radius: var(--radius-xs);
          overflow: hidden;
          border: 1px solid var(--border-dim);
        }
        .bar-fill {
          height: 100%;
          border-radius: var(--radius-xs);
          transition: width 0.5s ease;
        }
        .bar-fill.cyan { background: var(--cyan-primary); box-shadow: 0 0 8px var(--cyan-primary); }
        .bar-fill.green { background: var(--green-success); box-shadow: 0 0 8px var(--green-success); }
        .bar-fill.amber { background: var(--amber-warning); box-shadow: 0 0 8px var(--amber-warning); }

        .gaps-summary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(53, 230, 165, 0.05);
          border: 1px solid rgba(53, 230, 165, 0.2);
          padding: 8px;
          border-radius: var(--radius-sm);
          color: var(--text-bright);
        }
        .font-bold { font-weight: 700; }
        .text-cyan { color: var(--cyan-primary); }
        .text-green { color: var(--green-success); }
        .text-amber { color: var(--amber-warning); }
      `}</style>
    </div>
  );
};
