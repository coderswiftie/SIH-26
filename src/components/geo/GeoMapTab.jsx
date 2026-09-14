import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { MapControls } from './MapControls';
import { HazardRankTable } from './HazardRankTable';
import { Map, Compass, Navigation, Maximize } from 'lucide-react';

export const GeoMapTab = () => {
  const { detections, selectedObjectId, selectObject } = useMission();
  const [activeLayer, setActiveLayer] = useState('hazard');

  return (
    <div className="geo-map-tab">
      <div className="view-header">
        <div>
          <h1 className="font-display text-bright">BATHYMETRIC GEO & HAZARD SPATIAL MAP</h1>
          <p className="font-mono text-muted text-xs">High-Resolution Depth Contours & Benthic Hazard Overlays (Sector 7-B Mariana Ridge)</p>
        </div>
      </div>

      <div className="geo-main-grid">
        {/* Interactive Bathymetric SVG Chart Viewport */}
        <div className="chart-panel panel">
          <div className="panel-header">
            <div className="panel-title">
              <Compass size={16} />
              <span>SPATIAL BATHYMETRY & SWATH TRACK (LAT: 11°22'N / LNG: 142°12'E)</span>
            </div>
            <span className="badge badge-cyan font-mono">CONTOUR STEP: 50m</span>
          </div>

          <div className="chart-viewport">
            <svg viewBox="0 0 800 440" className="bathymetry-svg">
              <defs>
                <linearGradient id="depthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#04121c" />
                  <stop offset="50%" stopColor="#082232" />
                  <stop offset="100%" stopColor="#02080f" />
                </linearGradient>

                {/* Layer Heat Gradients */}
                <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF5570" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FF5570" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ecologicalGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#35E6A5" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#35E6A5" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="confidenceGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Sea Floor */}
              <rect width="800" height="440" fill="url(#depthGradient)" />

              {/* Grid Lines */}
              <g stroke="rgba(0, 229, 255, 0.08)" strokeWidth="1">
                <line x1="0" y1="110" x2="800" y2="110" />
                <line x1="0" y1="220" x2="800" y2="220" />
                <line x1="0" y1="330" x2="800" y2="330" />
                <line x1="200" y1="0" x2="200" y2="440" />
                <line x1="400" y1="0" x2="400" y2="440" />
                <line x1="600" y1="0" x2="600" y2="440" />
              </g>

              {/* Bathymetric Depth Contour Isolines */}
              <g fill="none" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="1.2">
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
                  <circle cx="510" cy="310" r="12" stroke="#FF5570" strokeWidth="2" fill="none" className="pulse-ring" />
                </g>
              )}

              {activeLayer === 'ecological' && (
                <g>
                  {/* Marine Sanctuary & Coral Zone Boundary */}
                  <polygon points="120,40 380,60 320,240 80,180" fill="rgba(53, 230, 165, 0.15)" stroke="#35E6A5" strokeWidth="1.5" strokeDasharray="6 4" />
                  <text x="140" y="100" fill="#35E6A5" fontSize="11" fontFamily="monospace">PROTECTED DEEP CORAL SANCTUARY</text>
                </g>
              )}

              {activeLayer === 'confidence' && (
                <g>
                  <circle cx="220" cy="150" r="60" fill="url(#confidenceGlow)" />
                  <circle cx="650" cy="100" r="70" fill="url(#confidenceGlow)" />
                </g>
              )}

              {/* Vessel Swath Trajectory Track */}
              <g stroke="#00E5FF" strokeWidth="2.5" opacity="0.8">
                <path d="M 60 380 L 220 280 L 480 320 L 720 120" strokeDasharray="8 6" />
              </g>

              {/* Vessel Position Marker */}
              <g transform="translate(720, 120)">
                <circle cx="0" cy="0" r="8" fill="#00E5FF" />
                <circle cx="0" cy="0" r="16" stroke="#00E5FF" strokeWidth="1.5" fill="none" />
                <text x="14" y="4" fill="#00E5FF" fontSize="10" fontFamily="monospace" fontWeight="bold">R/V OCEANUS EXPLORER</text>
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
                    onClick={() => selectObject(d.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isSelected && (
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
                    )}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? 9 : 7} 
                      fill={isUnknown ? '#FF5570' : '#00E5FF'} 
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text 
                      x="12" 
                      y="4" 
                      fill={isUnknown ? '#FF5570' : '#00E5FF'} 
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
              <span className="text-bright">ACTIVE LAYER: {activeLayer.toUpperCase()}</span>
              <span className="text-muted">| COORDS: 11°21'44"N 142°12'08"E</span>
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
        .chart-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #02080f;
          overflow: hidden;
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
