import React from 'react';
import { useMission } from '../../context/MissionContext';
import { exportToCSV, exportToJSON, triggerPrintPDF } from '../../utils/export';
import { FileText, Download, Printer, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const ReportPreview = ({ generatedData }) => {
  const { detections, metrics, hazards } = useMission();

  if (!generatedData) return null;

  return (
    <div className="report-preview-container panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileText size={16} />
          <span>CYANO MISSION INTELLIGENCE SYNTHESIS BRIEFING</span>
        </div>

        <div className="report-export-actions">
          <button className="btn btn-xs btn-cyan" onClick={() => exportToCSV(detections)}>
            <Download size={12} /> CSV EXPORT
          </button>
          <button className="btn btn-xs btn-cyan" onClick={() => exportToJSON({ metrics, detections, hazards, generatedData })}>
            <Download size={12} /> JSON EXPORT
          </button>
          <button className="btn btn-xs btn-outline" onClick={triggerPrintPDF}>
            <Printer size={12} /> PRINT / PDF
          </button>
        </div>
      </div>

      <div className="report-document-body">
        {/* Header Block */}
        <div className="doc-header">
          <div className="doc-brand font-display">Cyan<span>O</span> SYNTHESIS BRIEFING</div>
          <div className="doc-meta font-mono text-xs">
            <div>REPORT ID: <span className="text-cyan">{generatedData.id}</span></div>
            <div>TIMESTAMP: <span className="text-bright">{generatedData.timestamp}</span></div>
            <div>SECURITY CLASSIFICATION: <span className="text-green">UNCLASSIFIED // PACIFIC-ABYSS</span></div>
          </div>
        </div>

        <hr className="doc-divider" />

        {/* Section 1: Executive Summary */}
        <div className="doc-section">
          <h3 className="doc-section-title font-display">1. EXECUTIVE SUMMARY</h3>
          <p className="doc-p font-sans">
            During acoustic survey operation <strong>PACIFIC-ABYSS-09</strong> conducted in Sector 7-B (Mariana Ridge) using the 
            <strong> SAS-X4 Ultra-Aperture (450/900 kHz)</strong> system, a total of <strong>{metrics.pingsProcessed.toLocaleString()}</strong> acoustic pings were processed over 
            <strong> {metrics.surveyedAreaKm2} km²</strong> of abyssal sea floor. 
            The autonomous AI ingestion pipeline logged <strong>{detections.length} acoustic targets</strong>, comprising 
            <strong> {metrics.knownObjects} YOLO11-verified known objects</strong> and <strong>{metrics.unknownAnomalies} flagged anomalies</strong> requiring multi-aspect physics verification.
          </p>
        </div>

        {/* Section 2: Key Findings & Physics Audit */}
        <div className="doc-section">
          <h3 className="doc-section-title font-display">2. KEY FORENSIC FINDINGS</h3>
          <div className="doc-metrics-grid font-mono text-xs">
            <div className="doc-metric-card">
              <span className="text-muted">High Hazard Targets</span>
              <span className="text-red font-bold text-lg">{hazards.filter(h => h.priority === 'HIGH').length} Critical</span>
            </div>
            <div className="doc-metric-card">
              <span className="text-muted">Data Quality Index</span>
              <span className="text-cyan font-bold text-lg">{metrics.dataQualityScore}% Optimal</span>
            </div>
            <div className="doc-metric-card">
              <span className="text-muted">Signal-to-Noise Ratio</span>
              <span className="text-green font-bold text-lg">{metrics.snrDb} dB</span>
            </div>
          </div>
        </div>

        {/* Section 3: Priority Benthic Hazard Summary */}
        <div className="doc-section">
          <h3 className="doc-section-title font-display">3. PRIORITY BENTHIC HAZARDS SUMMARY</h3>
          <table className="doc-table font-mono text-xs">
            <thead>
              <tr>
                <th>TARGET ID</th>
                <th>CLASSIFICATION</th>
                <th>DEPTH</th>
                <th>HAZARD INDEX</th>
                <th>RECOMMENDED ACTION</th>
              </tr>
            </thead>
            <tbody>
              {detections.map(d => (
                <tr key={d.id}>
                  <td className="text-cyan font-bold">{d.id}</td>
                  <td>{d.class}</td>
                  <td>{d.depth} m</td>
                  <td className={d.hazardScore > 75 ? 'text-red font-bold' : 'text-bright'}>{d.hazardScore} / 100</td>
                  <td className="text-muted text-xs">{d.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Cryptographic Verification Stamp */}
        <div className="doc-footer font-mono text-xs">
          <div className="stamp">
            <Lock size={14} className="text-green" />
            <span>CRYPTOGRAPHIC HASH: <strong className="text-bright">{generatedData.hash}</strong></span>
          </div>
          <div className="text-faint">CyanO Autonomous Marine Safety Engine — Verified Execution</div>
        </div>
      </div>

      <style>{`
        .report-preview-container {
          display: flex;
          flex-direction: column;
        }
        .report-export-actions {
          display: flex;
          gap: 8px;
        }
        .report-document-body {
          padding: 20px 24px;
          background: #020b12;
          color: var(--text-main);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .doc-brand {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--text-bright);
        }
        .doc-brand span { color: var(--cyan-primary); }
        .doc-divider {
          border: none;
          border-top: 1px solid var(--border-soft);
        }
        .doc-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .doc-section-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--cyan-primary);
          letter-spacing: 0.5px;
        }
        .doc-p {
          font-size: 12.5px;
          line-height: 1.6;
          color: var(--text-main);
        }
        .doc-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .doc-metric-card {
          background: var(--bg-inset);
          border: 1px solid var(--border-dim);
          padding: 10px;
          border-radius: var(--radius-xs);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .text-lg { font-size: 16px; }
        .doc-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .doc-table th {
          background: rgba(0, 229, 255, 0.05);
          color: var(--text-muted);
          padding: 6px 10px;
          border-bottom: 1px solid var(--border-soft);
        }
        .doc-table td {
          padding: 8px 10px;
          border-bottom: 1px solid var(--border-dim);
        }
        .doc-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(53, 230, 165, 0.04);
          border: 1px solid rgba(53, 230, 165, 0.2);
          padding: 10px 14px;
          border-radius: var(--radius-xs);
        }
        .stamp {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};
