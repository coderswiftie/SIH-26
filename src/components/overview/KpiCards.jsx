import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Compass, Radio, Target, ShieldAlert, Award, Activity } from 'lucide-react';

export const KpiCards = () => {
  const { metrics, jumpToFilteredView } = useMission();

  const cards = [
    {
      title: "SURVEYED AREA",
      value: `${metrics.surveyedAreaKm2} km²`,
      sub: "Swath Width: 450m",
      icon: Compass,
      color: "var(--cyan-primary)",
      onClick: () => jumpToFilteredView('geo')
    },
    {
      title: "PINGS PROCESSED",
      value: metrics.pingsProcessed.toLocaleString(),
      sub: "SAS Aperture 900 kHz",
      icon: Radio,
      color: "var(--blue-accent)",
      onClick: () => jumpToFilteredView('overview')
    },
    {
      title: "TOTAL DETECTIONS",
      value: `${metrics.totalDetections} Objects`,
      sub: `${metrics.knownObjects} Known / ${metrics.unknownAnomalies} Unknown`,
      icon: Target,
      color: "var(--green-success)",
      onClick: () => jumpToFilteredView('detection', { typeFilter: 'ALL', statusFilter: 'ALL' })
    },
    {
      title: "FLAGGED ANOMALIES",
      value: `${metrics.flaggedQueueCount} Flagged`,
      sub: "Physics Audit Pending",
      icon: ShieldAlert,
      color: "var(--amber-warning)",
      onClick: () => jumpToFilteredView('detection', { statusFilter: 'PENDING_REVIEW' })
    },
    {
      title: "DATA QUALITY SCORE",
      value: `${metrics.dataQualityScore}%`,
      sub: `SNR: ${metrics.snrDb} dB`,
      icon: Activity,
      color: "var(--purple-accent)",
      onClick: () => jumpToFilteredView('overview')
    },
    {
      title: "MISSION CONFIDENCE",
      value: `${metrics.missionConfidence}%`,
      sub: "Zero False Alarms Flagged",
      icon: Award,
      color: "var(--cyan-primary)",
      onClick: () => jumpToFilteredView('reports')
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx} 
            className="kpi-card panel"
            onClick={card.onClick}
          >
            <div className="kpi-top">
              <span className="kpi-title font-mono">{card.title}</span>
              <Icon size={16} style={{ color: card.color }} />
            </div>
            <div className="kpi-val font-mono" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="kpi-sub font-mono">{card.sub}</div>
          </div>
        );
      })}

      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
          margin-bottom: 14px;
        }
        .kpi-card {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(10, 27, 38, 0.6);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .kpi-card:hover {
          border-color: var(--cyan-primary);
          box-shadow: 0 0 16px rgba(0, 229, 255, 0.25);
          transform: translateY(-2px);
          background: rgba(14, 36, 51, 0.8);
        }
        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .kpi-title {
          font-size: 10px;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }
        .kpi-val {
          font-size: 16px;
          font-weight: 700;
          margin-top: 2px;
        }
        .kpi-sub {
          font-size: 9.5px;
          color: var(--text-faint);
        }
      `}</style>
    </div>
  );
};
