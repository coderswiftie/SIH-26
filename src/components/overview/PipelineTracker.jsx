import React from 'react';
import { Cpu, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

export const PipelineTracker = () => {
  const stages = [
    { name: "INGESTION", sub: "48 pings/sec", status: "RUNNING" },
    { name: "QUALITY CHECK", sub: "SNR 24.8 dB", status: "RUNNING" },
    { name: "TILING", sub: "300x300 Chips", status: "RUNNING" },
    { name: "DETECTION", sub: "YOLO11 + Anomaly", status: "RUNNING" },
    { name: "PHYSICS FUSION", sub: "Shadow Audit", status: "RUNNING" },
    { name: "TRUST / GEO", sub: "Bathymetry Map", status: "ACTIVE" }
  ];

  return (
    <div className="pipeline-tracker panel">
      <div className="panel-header">
        <div className="panel-title">
          <Cpu size={16} />
          <span>AUTONOMOUS AI INGESTION & FORENSIC FUSION PIPELINE</span>
        </div>
      </div>

      <div className="pipeline-body">
        {stages.map((stage, idx) => (
          <React.Fragment key={idx}>
            <div className="stage-node">
              <div className="node-icon">
                <div className="pulse-indicator"></div>
              </div>
              <div className="node-info font-mono">
                <span className="node-name">{stage.name}</span>
                <span className="node-sub">{stage.sub}</span>
              </div>
            </div>

            {idx < stages.length - 1 && (
              <div className="stage-connector">
                <ArrowRight size={14} className="connector-arrow" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        .pipeline-tracker {
          display: flex;
          flex-direction: column;
        }
        .pipeline-body {
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stage-node {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .node-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid var(--cyan-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .node-info {
          display: flex;
          flex-direction: column;
        }
        .node-name {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-bright);
        }
        .node-sub {
          font-size: 9.5px;
          color: var(--text-muted);
        }
        .stage-connector {
          color: var(--text-faint);
          display: flex;
          align-items: center;
        }
        .connector-arrow {
          animation: pulseArrow 1.5s infinite;
        }
        @keyframes pulseArrow {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(3px); color: var(--cyan-primary); }
        }
      `}</style>
    </div>
  );
};
