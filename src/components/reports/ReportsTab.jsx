import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { ReportPreview } from './ReportPreview';
import { ReportHistory } from './ReportHistory';
import { FileText, Cpu, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { sonarAudio } from '../../utils/audio';

export const ReportsTab = () => {
  const { detections, metrics, setReportsHistory } = useMission();
  const [generatingStage, setGeneratingStage] = useState(null); // null | 'ANALYZING' | 'FUSING' | 'CALCULATING' | 'COMPILING' | 'COMPLETE'
  const [generatedReport, setGeneratedReport] = useState(null);

  const startReportSynthesis = () => {
    sonarAudio.playPing(1800, 0.4);
    setGeneratingStage('ANALYZING');

    setTimeout(() => {
      sonarAudio.playPing(2000, 0.4);
      setGeneratingStage('FUSING');
    }, 900);

    setTimeout(() => {
      sonarAudio.playPing(2200, 0.4);
      setGeneratingStage('CALCULATING');
    }, 1800);

    setTimeout(() => {
      sonarAudio.playPing(2400, 0.4);
      setGeneratingStage('COMPILING');
    }, 2700);

    setTimeout(() => {
      sonarAudio.playPing(2600, 0.5);
      const newReport = {
        id: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().substring(0, 19).replace('T', ' ') + ' UTC',
        author: 'CyanO Autonomous AI Core',
        detectionsCount: detections.length,
        highHazardsCount: detections.filter(d => d.hazardScore > 75).length,
        status: 'VERIFIED',
        hash: `0x${Math.floor(Math.random() * 1e16).toString(16)}`
      };

      setGeneratedReport(newReport);
      setReportsHistory(prev => [newReport, ...prev]);
      setGeneratingStage('COMPLETE');
    }, 3600);
  };

  return (
    <div className="reports-tab">
      <div className="view-header">
        <div>
          <h1 className="font-display text-bright">MISSION INTELLIGENCE SYNTHESIS REPORTS</h1>
          <p className="font-mono text-muted text-xs">Autonomous Multi-Agent Evidence Compilation & Cryptographic Verification Audit</p>
        </div>

        <button 
          className="btn btn-cyan"
          onClick={startReportSynthesis}
          disabled={generatingStage !== null && generatingStage !== 'COMPLETE'}
        >
          <Zap size={14} /> GENERATE MISSION SYNTHESIS REPORT
        </button>
      </div>

      {/* Multi-Stage Loading Animation Panel */}
      {generatingStage && generatingStage !== 'COMPLETE' && (
        <div className="synthesis-loading-panel panel">
          <div className="loading-content">
            <Cpu size={32} className="animate-spin text-cyan" />
            <div className="loading-status font-mono">
              <span className="text-bright font-bold text-lg">
                {generatingStage === 'ANALYZING' && 'STAGE 1/4: ANALYZING ACOUSTIC FRAMES...'}
                {generatingStage === 'FUSING' && 'STAGE 2/4: FUSING MULTI-ASPECT EVIDENCE...'}
                {generatingStage === 'CALCULATING' && 'STAGE 3/4: CALCULATING HAZARD INDEX...'}
                {generatingStage === 'COMPILING' && 'STAGE 4/4: COMPILING SYNTHESIS BRIEFING...'}
              </span>
              <span className="text-muted text-xs">Processing {metrics.pingsProcessed.toLocaleString()} pings across {detections.length} targets...</span>
            </div>
          </div>
          <div className="loading-progress-bar">
            <div 
              className="progress-fill" 
              style={{
                width: generatingStage === 'ANALYZING' ? '25%' :
                       generatingStage === 'FUSING' ? '50%' :
                       generatingStage === 'CALCULATING' ? '75%' : '95%'
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Grid Layout: Main Preview & History Sidebar */}
      <div className="reports-grid">
        <div className="reports-main-col">
          {generatedReport ? (
            <ReportPreview generatedData={generatedReport} />
          ) : (
            <div className="report-placeholder panel">
              <FileText size={42} className="text-muted" />
              <h3 className="font-display text-bright">No Report Generated Yet</h3>
              <p className="font-mono text-xs text-muted">Click "GENERATE MISSION SYNTHESIS REPORT" to execute the 4-stage AI evidence compilation engine.</p>
              <button className="btn btn-cyan" onClick={startReportSynthesis}>
                <Zap size={14} /> GENERATE NOW
              </button>
            </div>
          )}
        </div>

        <div className="reports-side-col">
          <ReportHistory />
        </div>
      </div>

      <style>{`
        .reports-tab {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .synthesis-loading-panel {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: rgba(0, 229, 255, 0.05);
          border: 1px solid var(--cyan-primary);
        }
        .loading-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .loading-status {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .loading-progress-bar {
          height: 6px;
          background: var(--bg-inset);
          border-radius: var(--radius-xs);
          overflow: hidden;
          border: 1px solid var(--border-dim);
        }
        .progress-fill {
          height: 100%;
          background: var(--cyan-primary);
          box-shadow: 0 0 12px var(--cyan-primary);
          transition: width 0.8s ease;
        }
        .reports-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 14px;
        }
        .report-placeholder {
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 14px;
          min-height: 400px;
        }
        .animate-spin {
          animation: spin 3s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
