import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

const INITIAL_STAGES = [
  { id: 1, name: "Ingestion", sub: "48 pings/sec", status: "DONE" },
  { id: 2, name: "Quality check", sub: "SNR 24.8 dB", status: "DONE" },
  { id: 3, name: "Tiling", sub: "300x300 Chips", status: "RUNNING" },
  { id: 4, name: "Detection", sub: "YOLO11 + Anomaly", status: "PENDING" },
  { id: 5, name: "Physics fusion", sub: "Shadow audit", status: "PENDING" },
  { id: 6, name: "Trust & mapping", sub: "Bathymetry map", status: "PENDING" }
];

export const PipelineTracker = () => {
  const [stages, setStages] = useState(INITIAL_STAGES);

  // Auto-advance pipeline every 4.5s (loops back to start)
  useEffect(() => {
    const interval = setInterval(() => {
      setStages(prev => {
        const runningIdx = prev.findIndex(s => s.status === 'RUNNING');
        const nextIdx = runningIdx === -1 || runningIdx === prev.length - 1 ? 0 : runningIdx + 1;

        return prev.map((s, idx) => {
          if (nextIdx === 0) {
            return { ...s, status: idx === 0 ? 'RUNNING' : 'PENDING' };
          }
          if (idx < nextIdx) return { ...s, status: 'DONE' };
          if (idx === nextIdx) return { ...s, status: 'RUNNING' };
          return { ...s, status: 'PENDING' };
        });
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pipeline-tracker panel">
      <div className="panel-header">
        <div className="panel-title">
          <Cpu size={16} />
          <span>Processing pipeline</span>
        </div>
      </div>

      <div className="pipeline-body">
        {/* Continuous Traffic Flow Packet Dot */}
        <div className="packet-flow-dot"></div>

        {stages.map((stage, idx) => {
          const isDone = stage.status === 'DONE';
          const isRunning = stage.status === 'RUNNING';
          const isPending = stage.status === 'PENDING';

          return (
            <React.Fragment key={stage.id}>
              <div className={`stage-node ${isPending ? 'node-dimmed' : ''}`}>
                <div className={`node-icon ${isDone ? 'icon-done' : isRunning ? 'icon-running' : 'icon-pending'}`}>
                  {isDone && <CheckCircle2 size={15} className="text-green" />}
                  {isRunning && <div className="pulse-indicator"></div>}
                  {isPending && <div className="dot-pending"></div>}
                </div>
                <div className="node-info font-mono">
                  <span className={`node-name ${isDone ? 'text-green' : isRunning ? 'text-cyan' : 'text-faint'}`}>
                    {stage.name}
                  </span>
                  <span className="node-sub">{stage.sub}</span>
                </div>
              </div>

              {idx < stages.length - 1 && (
                <div className="stage-connector">
                  <ArrowRight size={14} className={`connector-arrow ${isDone || isRunning ? 'arrow-active' : ''}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        .pipeline-tracker {
          display: flex;
          flex-direction: column;
        }
        .pipeline-body {
          position: relative;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
        }
        .packet-flow-dot {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cyan-primary);
          box-shadow: 0 0 10px var(--cyan-primary), 0 0 20px var(--cyan-primary);
          pointer-events: none;
          animation: flowPacket 3.5s linear infinite;
        }
        @keyframes flowPacket {
          0% { left: 2%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 96%; opacity: 0; }
        }
        .stage-node {
          display: flex;
          align-items: center;
          gap: 10px;
          transition: opacity 0.3s ease;
        }
        .node-dimmed {
          opacity: 0.45;
        }
        .node-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .icon-done {
          background: rgba(53, 230, 165, 0.12);
          border: 1px solid var(--green-success);
        }
        .icon-running {
          background: rgba(0, 229, 255, 0.15);
          border: 1px solid var(--cyan-primary);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
        }
        .icon-pending {
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed var(--text-faint);
        }
        .dot-pending {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--text-faint);
        }
        .node-info {
          display: flex;
          flex-direction: column;
        }
        .node-name {
          font-size: 11px;
          font-weight: 700;
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
        .arrow-active {
          color: var(--cyan-primary);
        }
        .connector-arrow {
          animation: pulseArrow 1.5s infinite;
        }
        @keyframes pulseArrow {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(3px); }
        }
        .text-green { color: var(--green-success); }
        .text-cyan { color: var(--cyan-primary); }
        .text-faint { color: var(--text-faint); }
      `}</style>
    </div>
  );
};
