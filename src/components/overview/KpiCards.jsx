import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Compass, Radio, Target, ShieldAlert, Award, Activity } from 'lucide-react';

export const KpiCards = () => {
  const { metrics, detections } = useMission();

  const cards = [
    {
      title: "SURVEYED AREA",
      value: `${metrics.surveyedAreaKm2} km²`,
      sub: "Swath Width: 450m",
      icon: Compass,
      color: "var(--cyan-primary)"
    },
    {
      title: "PINGS PROCESSED",
      value: metrics.pingsProcessed.toLocaleString(),
      sub: "SAS Aperture 900 kHz",
      icon: Radio,
      color: "var(--blue-accent)"
    },
    {
      title: "TOTAL DETECTIONS",
      value: `${metrics.totalDetections} Objects`,
      sub: `${metrics.knownObjects} Known / ${metrics.unknownAnomalies} Unknown`,
      icon: Target,
      color: "var(--green-success)"
    },
    {
      title: "FLAGGED ANOMALIES",
      value: `${metrics.flaggedQueueCount} Flagged`,
      sub: "Physics Audit Pending",
      icon: ShieldAlert,
      color: "var(--amber-warning)"
    },
    {
      title: "DATA QUALITY SCORE",
      value: `${metrics.dataQualityScore}%`,
      sub: `SNR: ${metrics.snrDb} dB`,
      icon: Activity,
      color: "var(--purple-accent)"
    },
    {
      title: "MISSION CONFIDENCE",
      value: `${metrics.missionConfidence}%`,
      sub: "Zero False Alarms Flagged",
      icon: Award,
      color: "var(--cyan-primary)"
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="kpi-card panel">
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
