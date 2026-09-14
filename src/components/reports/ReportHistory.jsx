import React from 'react';
import { useMission } from '../../context/MissionContext';
import { Archive, FileText, Download, CheckCircle } from 'lucide-react';

export const ReportHistory = () => {
  const { reportsHistory } = useMission();

  return (
    <div className="report-history panel">
      <div className="panel-header">
        <div className="panel-title">
          <Archive size={16} />
          <span>Archived mission briefings</span>
        </div>
      </div>

      <div className="history-body">
        {reportsHistory.map(rep => (
          <div key={rep.id} className="history-card font-mono text-xs">
            <div className="history-top">
              <span className="font-bold" style={{ color: 'var(--teal-primary)' }}>{rep.id}</span>
              <span className="badge badge-teal">{rep.status}</span>
            </div>
            <div className="history-title" style={{ color: 'var(--text-primary)' }}>{rep.title}</div>
            <div className="history-meta text-muted">
              <span>{rep.timestamp}</span> · <span>Author: {rep.author}</span>
            </div>
            <div className="history-hash text-faint">Hash: {rep.hash}</div>
          </div>
        ))}
      </div>

      <style>{`
        .report-history {
          display: flex;
          flex-direction: column;
        }
        .history-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .history-card {
          background: var(--bg-surface-alt);
          border: 1px solid var(--border-soft);
          padding: 10px;
          border-radius: var(--radius-xs);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .history-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .history-title {
          font-weight: 600;
        }
        .history-meta {
          font-size: 10.5px;
        }
        .history-hash {
          font-size: 9.5px;
        }
      `}</style>
    </div>
  );
};
