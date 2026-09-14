import React from 'react';
import { KpiCards } from './KpiCards';
import { SonarViewer } from './SonarViewer';
import { QualityReport } from './QualityReport';
import { PipelineTracker } from './PipelineTracker';

export const OverviewTab = () => {
  return (
    <div className="overview-tab">
      <div className="view-header">
        <div>
          <h1 className="font-display text-bright">Mission overview</h1>
          <p className="font-mono text-muted text-xs">Real-time synthetic aperture sonar telemetry and detection analysis</p>
        </div>
      </div>

      <KpiCards />

      <div className="overview-middle-grid">
        <SonarViewer />
        <QualityReport />
      </div>

      <PipelineTracker />

      <style>{`
        .overview-tab {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .view-header h1 {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }
        .overview-middle-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 14px;
        }
      `}</style>
    </div>
  );
};
