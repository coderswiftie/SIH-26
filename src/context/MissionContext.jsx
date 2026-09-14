import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DETECTIONS, INITIAL_METRICS, BATHYMETRY_HAZARDS, INITIAL_PAST_REPORTS } from '../types/data';
import { sonarAudio } from '../utils/audio';

const MissionContext = createContext();

export const MissionProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [detections, setDetections] = useState(INITIAL_DETECTIONS);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [hazards, setHazards] = useState(BATHYMETRY_HAZARDS);
  const [reportsHistory, setReportsHistory] = useState(INITIAL_PAST_REPORTS);
  
  const [audioMuted, setAudioMuted] = useState(true);
  const [sonarPalette, setSonarPalette] = useState('cyan');
  const [sonarFrequency, setSonarFrequency] = useState('900kHz');
  const [utcTime, setUtcTime] = useState(new Date().toISOString().substring(0, 19).replace('T', ' ') + ' UTC');

  // Live UTC Clock & Telemetry Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(0, 19).replace('T', ' ') + ' UTC');

      // Subtle live telemetry pulse increment (capped at realistic upper bounds)
      setMetrics(prev => ({
        ...prev,
        pingsProcessed: Math.min(160000, prev.pingsProcessed + 12),
        surveyedAreaKm2: Math.min(198, parseFloat((prev.surveyedAreaKm2 + 0.01).toFixed(2)))
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectObject = (id) => {
    setSelectedObjectId(id);
    sonarAudio.playTick();
  };

  const toggleAudio = () => {
    const nextState = !audioMuted;
    setAudioMuted(nextState);
    sonarAudio.setMuted(nextState);
    if (!nextState) {
      sonarAudio.playPing(1600, 0.3);
    }
  };

  const confirmHazard = (id) => {
    setDetections(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'HIGH_HAZARD',
          hazardScore: Math.max(item.hazardScore, 88),
          physics: {
            ...item.physics,
            shadowStatus: 'PASS',
            crossPingStatus: 'PASS',
            sizePlausibility: 'PASS'
          }
        };
      }
      return item;
    }));
    sonarAudio.playPing(1800, 0.4);
  };

  const reclassifyObject = (id, newClass) => {
    setDetections(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          class: newClass,
          label: `Reclassified: ${newClass}`,
          status: 'RECLASSIFIED'
        };
      }
      return item;
    }));
    sonarAudio.playTick();
  };

  const dismissObject = (id) => {
    setDetections(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'DISMISSED_NOISE',
          hazardScore: 10
        };
      }
      return item;
    }));
    sonarAudio.playTick();
  };

  const updatePhysicsStatus = (id, field, value) => {
    setDetections(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          physics: {
            ...item.physics,
            [field]: value
          }
        };
      }
      return item;
    }));
  };

  const injectSimulatedAnomaly = () => {
    const newId = `ANOM-${Math.floor(10 + Math.random() * 90)}`;
    const newDepth = (1350 + Math.random() * 250).toFixed(1);
    const newLat = `11°${Math.floor(20 + Math.random() * 5)}'${(Math.random() * 59).toFixed(1)}"N`;
    const newLng = `142°${Math.floor(10 + Math.random() * 5)}'${(Math.random() * 59).toFixed(1)}"E`;

    const newAnomaly = {
      id: newId,
      label: `${newId}: Live Ingested Anomaly Target`,
      class: 'Submerged Acoustic Anomaly',
      type: 'Unknown',
      confidence: parseFloat((75 + Math.random() * 20).toFixed(1)),
      depth: parseFloat(newDepth),
      lat: newLat,
      lng: newLng,
      status: 'PENDING_REVIEW',
      hazardScore: 78,
      time: new Date().toISOString().substring(11, 19),
      xRatio: parseFloat((0.2 + Math.random() * 0.6).toFixed(2)),
      yRatio: parseFloat((0.2 + Math.random() * 0.6).toFixed(2)),
      wRatio: 0.15,
      hRatio: 0.15,
      physics: {
        shadowLengthExpected: '3.2m',
        shadowLengthMeasured: '3.8m',
        shadowMatchRatio: 84.2,
        crossPingCoherence: '6/8 pings',
        impedanceReflectivity: '0.82 (High Metallic Contrast)',
        sizePlausibility: 'FLAGGED',
        shadowStatus: 'PENDING',
        crossPingStatus: 'PENDING'
      },
      chipSvgType: 'cylinder',
      notes: 'Real-time SAS acoustic ingestion trigger. Requires physics temporal & spatial verification.'
    };

    setDetections(prev => [newAnomaly, ...prev]);
    setSelectedObjectId(newId);
    setMetrics(prev => ({
      ...prev,
      totalDetections: prev.totalDetections + 1,
      unknownAnomalies: prev.unknownAnomalies + 1,
      flaggedQueueCount: prev.flaggedQueueCount + 1
    }));

    sonarAudio.playPing(2100, 0.5);
  };

  const activeSelectedId = selectedObjectId || detections[0]?.id;
  const selectedObject = detections.find(d => d.id === activeSelectedId) || detections[0];

  return (
    <MissionContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedObjectId,
        selectObject,
        selectedObject,
        detections,
        metrics,
        hazards,
        reportsHistory,
        setReportsHistory,
        audioMuted,
        toggleAudio,
        sonarPalette,
        setSonarPalette,
        sonarFrequency,
        setSonarFrequency,
        utcTime,
        confirmHazard,
        reclassifyObject,
        dismissObject,
        updatePhysicsStatus,
        injectSimulatedAnomaly
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => useContext(MissionContext);
