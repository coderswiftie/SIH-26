import React, { useRef, useEffect, useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { sonarAudio } from '../../utils/audio';
import { Maximize2, Palette, Sliders, Zap } from 'lucide-react';

export const SonarViewer = () => {
  const canvasRef = useRef(null);
  const { 
    detections, 
    selectedObjectId, 
    selectObject, 
    sonarPalette, 
    setSonarPalette, 
    sonarFrequency, 
    setSonarFrequency,
    injectSimulatedAnomaly 
  } = useMission();

  const [gain, setGain] = useState(75);
  const beamAngleRef = useRef(0);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Palette Color Definitions
    const getColors = () => {
      if (sonarPalette === 'amber') {
        return { bg: '#100b03', beam: 'rgba(255, 209, 102, 0.25)', grid: 'rgba(255, 209, 102, 0.12)', knownBox: '#FFD166', unkBox: '#FF5570' };
      }
      if (sonarPalette === 'emerald') {
        return { bg: '#03120b', beam: 'rgba(53, 230, 165, 0.25)', grid: 'rgba(53, 230, 165, 0.12)', knownBox: '#35E6A5', unkBox: '#FF5570' };
      }
      // Default Cyan
      return { bg: '#030c14', beam: 'rgba(0, 229, 255, 0.25)', grid: 'rgba(0, 229, 255, 0.12)', knownBox: '#00E5FF', unkBox: '#FF5570' };
    };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const colors = getColors();

      // Clear Canvas Background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, width, height);

      // Draw Synthetic Waterfall Sonar Texture
      const gainMultiplier = gain / 100;
      ctx.fillStyle = colors.grid;
      for (let i = 0; i < 60; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        const rw = Math.random() * 80 * gainMultiplier;
        const rh = Math.random() * 2;
        ctx.fillRect(rx, ry, rw, rh);
      }

      // Draw Distance Concentric Rings
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      for (let r = 50; r <= maxRadius; r += 60) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Grid Crosshairs
      ctx.beginPath();
      ctx.moveTo(0, centerY); ctx.lineTo(width, centerY);
      ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height);
      ctx.stroke();

      // Update & Draw Sweeping Radar Beam
      beamAngleRef.current = (beamAngleRef.current + 0.015) % (Math.PI * 2);
      const angle = beamAngleRef.current;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, angle - 0.25, angle);
      ctx.closePath();
      ctx.fillStyle = colors.beam;
      ctx.fill();
      ctx.restore();

      // Beam Line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * maxRadius, centerY + Math.sin(angle) * maxRadius);
      ctx.strokeStyle = colors.knownBox;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Render Acoustic Detection Targets (Bounding Boxes)
      detections.forEach((det) => {
        const boxX = det.xRatio * width;
        const boxY = det.yRatio * height;
        const boxW = det.wRatio * width;
        const boxH = det.hRatio * height;
        const isSelected = det.id === selectedObjectId;
        const isUnknown = det.type === 'Unknown';

        // Check if Beam Intersects Target to Trigger Acoustic Ripple
        const targetAngle = Math.atan2(boxY + boxH/2 - centerY, boxX + boxW/2 - centerX);
        const angleDiff = Math.abs((angle - targetAngle + Math.PI * 3) % (Math.PI * 2) - Math.PI);

        if (angleDiff < 0.08 && Math.random() < 0.2) {
          ripplesRef.current.push({
            x: boxX + boxW / 2,
            y: boxY + boxH / 2,
            radius: 5,
            maxRadius: 35,
            opacity: 1
          });
          sonarAudio.playTick();
        }

        // Draw Bounding Box (Solid for Known, Dashed for Unknown)
        ctx.strokeStyle = isUnknown ? colors.unkBox : colors.knownBox;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;

        if (isUnknown) {
          ctx.setLineDash([5, 4]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Highlight Glow if Selected
        if (isSelected) {
          ctx.fillStyle = isUnknown ? 'rgba(255, 85, 112, 0.18)' : 'rgba(0, 229, 255, 0.18)';
          ctx.fillRect(boxX, boxY, boxW, boxH);

          // Target reticle corner marks
          ctx.setLineDash([]);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          const corner = 8;
          // Top Left
          ctx.beginPath(); ctx.moveTo(boxX - 3, boxX - 3 + corner); ctx.lineTo(boxX - 3, boxY - 3); ctx.lineTo(boxX - 3 + corner, boxY - 3); ctx.stroke();
          // Bottom Right
          ctx.beginPath(); ctx.moveTo(boxX + boxW + 3 - corner, boxY + boxH + 3); ctx.lineTo(boxX + boxW + 3, boxY + boxH + 3); ctx.lineTo(boxX + boxW + 3, boxY + boxH + 3 - corner); ctx.stroke();
        }

        // Target Tag Label
        ctx.setLineDash([]);
        ctx.fillStyle = isUnknown ? colors.unkBox : colors.knownBox;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`${det.id} [${det.confidence}%]`, boxX, boxY - 5);
      });

      // Update & Draw Acoustic Ripples
      ripplesRef.current.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${r.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        r.radius += 0.8;
        r.opacity -= 0.025;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [detections, selectedObjectId, sonarPalette, gain]);

  // Click Handler for Canvas Target Selection
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Find clicked detection bounding box
    const clicked = detections.find((det) => {
      const boxX = det.xRatio * canvas.width;
      const boxY = det.yRatio * canvas.height;
      const boxW = det.wRatio * canvas.width;
      const boxH = det.hRatio * canvas.height;
      return clickX >= boxX && clickX <= boxX + boxW && clickY >= boxY && clickY <= boxY + boxH;
    });

    if (clicked) {
      selectObject(clicked.id);
    }
  };

  return (
    <div className="sonar-viewer panel">
      <div className="panel-header">
        <div className="panel-title">
          <Zap size={16} />
          <span>LIVE APERTURE SONAR CANVAS (SIDE-SCAN WATERFALL)</span>
        </div>

        <div className="sonar-controls">
          <button 
            className="btn btn-xs btn-cyan"
            onClick={injectSimulatedAnomaly}
            title="Inject Real-time Anomaly Trigger"
          >
            + INJECT ANOMALY
          </button>

          <div className="control-group">
            <Palette size={12} className="text-muted" />
            <select 
              className="select-box select-xs"
              value={sonarPalette}
              onChange={(e) => setSonarPalette(e.target.value)}
            >
              <option value="cyan">Deep Cyan</option>
              <option value="amber">Amber Phosphor</option>
              <option value="emerald">Emerald Night</option>
            </select>
          </div>

          <div className="control-group">
            <Sliders size={12} className="text-muted" />
            <span className="font-mono text-xs text-muted">GAIN</span>
            <input 
              type="range" 
              min="30" 
              max="100" 
              value={gain} 
              onChange={(e) => setGain(Number(e.target.value))}
              className="gain-slider"
            />
          </div>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={480} 
          onClick={handleCanvasClick}
          className="sonar-canvas"
        />

        <div className="canvas-telemetry-overlay font-mono">
          <div className="telem-chip">RANGE: 250m</div>
          <div className="telem-chip">SPEED: 4.2 KTS</div>
          <div className="telem-chip">SWATH: 450m</div>
          <div className="telem-chip">ALT: 18.4m</div>
        </div>

        <div className="legend-overlay font-mono">
          <div className="legend-item"><span className="legend-box solid"></span> YOLO11 Known</div>
          <div className="legend-item"><span className="legend-box dashed"></span> Anomaly Unknown</div>
        </div>
      </div>

      <style>{`
        .sonar-viewer {
          display: flex;
          flex-direction: column;
        }
        .sonar-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .control-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .select-xs {
          padding: 2px 6px;
          font-size: 11px;
        }
        .gain-slider {
          width: 70px;
          accent-color: var(--cyan-primary);
          cursor: pointer;
        }
        .canvas-wrapper {
          position: relative;
          width: 100%;
          background: #02080d;
          aspect-ratio: 5 / 3;
          overflow: hidden;
        }
        .sonar-canvas {
          width: 100%;
          height: 100%;
          display: block;
          cursor: crosshair;
        }
        .canvas-telemetry-overlay {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 8px;
          pointer-events: none;
        }
        .telem-chip {
          background: rgba(3, 15, 23, 0.8);
          border: 1px solid var(--border-soft);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
          font-size: 10px;
          color: var(--cyan-primary);
        }
        .legend-overlay {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          gap: 12px;
          background: rgba(3, 15, 23, 0.85);
          border: 1px solid var(--border-soft);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          font-size: 10px;
          color: var(--text-bright);
          pointer-events: none;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-box {
          width: 12px;
          height: 12px;
          display: inline-block;
        }
        .legend-box.solid {
          border: 1.5px solid var(--cyan-primary);
          background: rgba(0, 229, 255, 0.2);
        }
        .legend-box.dashed {
          border: 1.5px dashed var(--red-hazard);
          background: rgba(255, 85, 112, 0.2);
        }
      `}</style>
    </div>
  );
};
