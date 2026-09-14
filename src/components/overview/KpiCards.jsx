import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Compass, Radio, Target, ShieldAlert, Award, Activity } from 'lucide-react';

export const KpiCards = () => {
  const { metrics, jumpToFilteredView } = useMission();

  // Semantic color: only apply when the value is actually signalling an issue
  const flaggedColor = metrics.flaggedQueueCount > 0 ? 'var(--warning)' : 'var(--teal-deep)';

  const cards = [
    {
      title: "Surveyed Area",
      value: `${metrics.surveyedAreaKm2} km²`,
      sub: "Swath Width: 450m",
      icon: Compass,
      color: "var(--teal-deep)",
      onClick: () => jumpToFilteredView('geo')
    },
    {
      title: "Pings Processed",
      value: metrics.pingsProcessed.toLocaleString(),
      sub: "SAS Aperture 900 kHz",
      icon: Radio,
      color: "var(--teal-deep)",
      onClick: () => jumpToFilteredView('overview')
    },
    {
      title: "Total Detections",
      value: `${metrics.totalDetections} Objects`,
      sub: `${metrics.knownObjects} Known / ${metrics.unknownAnomalies} Unknown`,
      icon: Target,
      color: "var(--teal-deep)",
      onClick: () => jumpToFilteredView('detection', { typeFilter: 'ALL', statusFilter: 'ALL' })
    },
    {
      title: "Flagged Anomalies",
      value: `${metrics.flaggedQueueCount} Flagged`,
      sub: "Physics Audit Pending",
      icon: ShieldAlert,
      color: flaggedColor,
      onClick: () => jumpToFilteredView('detection', { statusFilter: 'PENDING_REVIEW' })
    },
    {
      title: "Data Quality Score",
      value: `${metrics.dataQualityScore}%`,
      sub: `SNR: ${metrics.snrDb} dB`,
      icon: Activity,
      color: "var(--teal-deep)",
      onClick: () => jumpToFilteredView('overview')
    },
    {
      title: "Mission Confidence",
      value: `${metrics.missionConfidence}%`,
      sub: "Zero False Alarms Flagged",
      icon: Award,
      color: "var(--teal-deep)",
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
              <span className="kpi-title">{card.title}</span>
              <Icon size={16} style={{ color: card.color }} />
            </div>
            <div className="kpi-val" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="kpi-sub">{card.sub}</div>
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
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .kpi-card:hover {
          border-color: var(--teal-primary);
          box-shadow: 0 2px 10px rgba(8, 127, 140, 0.12);
          transform: translateY(-1px);
        }
        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .kpi-title {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
        }
        .kpi-val {
          font-family: var(--font-mono);
          font-size: 15px;
          font-weight: 700;
          margin-top: 4px;
        }
        .kpi-sub {
          font-size: 10px;
          color: var(--text-faint);
        }
      `}</style>
    </div>
  );
};
