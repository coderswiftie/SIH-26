import React, { useState, useRef, useEffect } from 'react';
import { useMission } from '../../context/MissionContext';
import { MapControls } from './MapControls';
import { HazardRankTable } from './HazardRankTable';
import { Compass, Maximize } from 'lucide-react';

export const GeoMapTab = () => {
  const { detections, selectedObjectId, selectObject } = useMission();
  const [activeLayer, setActiveLayer] = useState('hazard');

  // Interactive ViewBox Zoom & Pan State
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 440 });
  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const resetZoom = () => {
    setViewBox({ x: 0, y: 0, w: 800, h: 440 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const zoomFactor = e.deltaY < 0 ? 0.88 : 1.14;

    const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
    const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;

    setViewBox(prev => {
      // Clamped range: 200x110 (400% zoom in) to 2400x1320 (33% zoom out)
      const newW = Math.min(2400, Math.max(200, prev.w * zoomFactor));
      const newH = Math.min(1320, Math.max(110, prev.h * zoomFactor));

      const newX = mouseX - ((mouseX - prev.x) / prev.w) * newW;
      const newY = mouseY - ((mouseY - prev.y) / prev.h) * newH;

      return { x: newX, y: newY, w: newW, h: newH };
    });
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDraggedRef.current = true;
    }

    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;

    setViewBox(prev => ({
      ...prev,
      x: prev.x - dx * scaleX,
      y: prev.y - dy * scaleY
    }));

    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Attach wheel listener as non-passive so e.preventDefault() actually works.
  // React attaches JSX event handlers as passive by default, which silently
  // ignores preventDefault() for wheel events.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.addEventListener('wheel', handleWheel, { passive: false });
    return () => svg.removeEventListener('wheel', handleWheel);
  });

  return (
    <div className="geo-map-tab">
      <div className="view-header">
        <div>
          <h1 className="font-display text-bright">Bathymetric map</h1>
          <p className="font-mono text-muted text-xs">Depth contours and detected hazards across the current survey area.</p>
        </div>
      </div>

      <div className="geo-main-grid">
        {/* Interactive Bathymetric SVG Chart Viewport */}
        <div className="chart-panel panel">
          <div className="panel-header">
            <div className="panel-title">
              <Compass size={16} />
              <span>Spatial bathymetry and swath track</span>
            </div>
            
            <div className="map-header-controls font-mono">
              <button 
                className="btn btn-xs btn-outline" 
                onClick={resetZoom}
                title="Reset Bathymetry Map Zoom & Pan"
              >
                <Maximize size={12} /> Reset zoom
              </button>
              <span className="badge badge-cyan">
                Zoom: {Math.round((800 / viewBox.w) * 100)}%
              </span>
            </div>
          </div>

          <div className="chart-viewport">
            <svg 
              ref={svgRef}
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} 
              className="bathymetry-svg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
            >
              <defs>
                <linearGradient id="depthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#04121c" />
                  <stop offset="50%" stopColor="#082232" />
                  <stop offset="100%" stopColor="#02080f" />
                </linearGradient>

                {/* Layer Heat Gradients — muted scientific palette */}
                <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C84A4A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#C84A4A" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ecologicalGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#31856B" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#31856B" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="confidenceGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#13A7B5" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#13A7B5" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Sea Floor */}
              <rect x="-1000" y="-1000" width="3000" height="3000" fill="url(#depthGradient)" />

              {/* Grid Lines */}
              <g stroke="rgba(100, 160, 170, 0.08)" strokeWidth="1">
                <line x1="-1000" y1="110" x2="2000" y2="110" />
                <line x1="-1000" y1="220" x2="2000" y2="220" />
                <line x1="-1000" y1="330" x2="2000" y2="330" />
                <line x1="200" y1="-1000" x2="200" y2="2000" />
                <line x1="400" y1="-1000" x2="400" y2="2000" />
                <line x1="600" y1="-1000" x2="600" y2="2000" />
              </g>

              {/* Bathymetric Depth Contour Isolines */}
              <g fill="none" stroke="rgba(100, 160, 170, 0.22)" strokeWidth="1.2">
                <path d="M 0 100 Q 200 40 400 120 T 800 90" strokeDasharray="3 3" />
                <path d="M 0 180 Q 250 120 500 210 T 800 170" />
                <path d="M 0 260 Q 180 320 450 240 T 800 290" />
                <path d="M 0 350 Q 300 290 600 370 T 800 340" strokeDasharray="4 4" />
              </g>

              {/* Contour Depth Labels */}
              <text x="20" y="95" fill="#3B5F6C" fontSize="10" fontFamily="monospace">1350m</text>
              <text x="20" y="175" fill="#3B5F6C" fontSize="10" fontFamily="monospace">1400m</text>
              <text x="20" y="255" fill="#3B5F6C" fontSize="10" fontFamily="monospace">1450m</text>
              <text x="20" y="345" fill="#3B5F6C" fontSize="10" fontFamily="monospace">1500m</text>

              {/* Layer Crossfade Overlays */}
              {activeLayer === 'hazard' && (
                <g>
                  <circle cx="510" cy="310" r="45" fill="url(#hazardGlow)" />
                  <circle cx="510" cy="310" r="85" fill="url(#hazardGlow)" opacity="0.4" />
                  <circle cx="510" cy="310" r="12" stroke="#C84A4A" strokeWidth="1.5" fill="none" className="pulse-ring" />
                </g>
              )}

              {activeLayer === 'ecological' && (
                <g>
                  {/* Marine Sanctuary & Coral Zone Boundary */}
                  <polygon points="120,40 380,60 320,240 80,180" fill="rgba(49, 133, 107, 0.10)" stroke="#31856B" strokeWidth="1.2" strokeDasharray="6 4" />
                  <text x="140" y="100" fill="#31856B" fontSize="11" fontFamily="monospace">Protected deep coral sanctuary</text>
                </g>
              )}

              {activeLayer === 'confidence' && (
                <g>
                  <circle cx="220" cy="150" r="60" fill="url(#confidenceGlow)" />
                  <circle cx="650" cy="100" r="70" fill="url(#confidenceGlow)" />
                </g>
              )}

              {/* Vessel Swath Trajectory Track */}
              <g stroke="#1A8A96" strokeWidth="2" opacity="0.55">
                <path d="M 60 380 L 220 280 L 480 320 L 720 120" strokeDasharray="8 6" />
              </g>

              {/* Vessel Position Marker */}
              <g transform="translate(720, 120)">
                <circle cx="0" cy="0" r="6" fill="#13A7B5" />
                <circle cx="0" cy="0" r="13" stroke="#13A7B5" strokeWidth="1" fill="none" opacity="0.6" />
                <text x="14" y="4" fill="#13A7B5" fontSize="10" fontFamily="monospace" fontWeight="bold">R/V Oceanus Explorer</text>
              </g>

              {/* Detection Target Nodes */}
              {detections.map((d) => {
                const cx = d.xRatio * 800;
                const cy = d.yRatio * 440;
                const isSelected = d.id === selectedObjectId;
                const isUnknown = d.type === 'Unknown';

                return (
                  <g 
                    key={d.id} 
                    transform={`translate(${cx}, ${cy})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!hasDraggedRef.current) {
                        selectObject(d.id);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
                    )}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? 8 : 6} 
                      fill={isUnknown ? '#C84A4A' : '#13A7B5'} 
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1"
                    />
                    <text 
                      x="12" 
                      y="4" 
                      fill={isUnknown ? '#C84A4A' : '#13A7B5'} 
                      fontSize="10" 
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {d.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Telemetry Overlay */}
            <div className="map-info-overlay font-mono text-xs">
              <span className="text-bright">Active layer: {activeLayer}</span>
              <span className="text-muted"> | Coords: 11°21'44"N 142°12'08"E</span>
            </div>
          </div>
        </div>

        {/* Right Side Controls & Ranking Table */}
        <div className="geo-side-panel">
          <MapControls activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
          <HazardRankTable />
        </div>
      </div>

      <style>{`
        .geo-map-tab {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .geo-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 14px;
        }
        .chart-panel {
          display: flex;
          flex-direction: column;
        }
        .map-header-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .chart-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #05121A;
          overflow: hidden;
          user-select: none;
        }
        .bathymetry-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .map-info-overlay {
          position: absolute;
          bottom: 10px;
          left: 12px;
          background: rgba(3, 15, 23, 0.85);
          border: 1px solid var(--border-soft);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          pointer-events: none;
        }
        .geo-side-panel {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
      `}</style>
    </div>
  );
};
