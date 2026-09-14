// Initial Synthetic Aperture Sonar (SAS) Intelligence Dataset

export const INITIAL_DETECTIONS = [
  {
    id: "DET-9021",
    label: "YOLO11-Known: Pipeline-Alpha",
    class: "Subsea Pipeline",
    type: "Known",
    confidence: 99.4,
    depth: 1420.5,
    lat: "11°21'44.2\"N",
    lng: "142°12'08.5\"E",
    status: "CONFIRMED",
    hazardScore: 25,
    time: "22:41:05",
    xRatio: 0.28,
    yRatio: 0.35,
    wRatio: 0.22,
    hRatio: 0.12,
    physics: {
      shadowLengthExpected: "1.2m",
      shadowLengthMeasured: "1.22m",
      shadowMatchRatio: 98.3,
      crossPingCoherence: "12/12 pings",
      impedanceReflectivity: "0.85 (Hard Metallic Steel)",
      sizePlausibility: "PASS",
      shadowStatus: "PASS",
      crossPingStatus: "PASS"
    },
    chipSvgType: "pipeline",
    notes: "Continuous steel pipeline segment mapped via SAS high-frequency mode."
  },
  {
    id: "ANOM-03",
    label: "Anomaly-03: Cylindrical Metallic Structure",
    class: "Unknown Cylinder",
    type: "Unknown",
    confidence: 88.7,
    depth: 1485.2,
    lat: "11°22'04.8\"N",
    lng: "142°12'45.1\"E",
    status: "PENDING_REVIEW",
    hazardScore: 85,
    time: "22:42:19",
    xRatio: 0.64,
    yRatio: 0.42,
    wRatio: 0.14,
    hRatio: 0.18,
    physics: {
      shadowLengthExpected: "4.8m",
      shadowLengthMeasured: "5.1m",
      shadowMatchRatio: 93.7,
      crossPingCoherence: "8/8 pings",
      impedanceReflectivity: "0.78 (High Metallic Density)",
      sizePlausibility: "FLAGGED",
      shadowStatus: "PASS",
      crossPingStatus: "PASS"
    },
    chipSvgType: "cylinder",
    notes: "Unidentified high-reflectivity acoustic highlight with prominent acoustic shadow. Needs forensic shadow & cross-ping verification."
  },
  {
    id: "ANOM-07",
    label: "Anomaly-07: Submerged Acoustic Contact",
    class: "Potential Subsea Mine / UXO",
    type: "Unknown",
    confidence: 82.1,
    depth: 1390.8,
    lat: "11°20'59.1\"N",
    lng: "142°13'12.4\"E",
    status: "HIGH_HAZARD",
    hazardScore: 94,
    time: "22:44:02",
    xRatio: 0.48,
    yRatio: 0.72,
    wRatio: 0.12,
    hRatio: 0.14,
    physics: {
      shadowLengthExpected: "2.5m",
      shadowLengthMeasured: "3.9m",
      shadowMatchRatio: 64.1,
      crossPingCoherence: "5/8 pings",
      impedanceReflectivity: "0.91 (Dense Ferritic Mass)",
      sizePlausibility: "FLAGGED",
      shadowStatus: "PENDING",
      crossPingStatus: "PENDING"
    },
    chipSvgType: "mine",
    notes: "Shadow length discrepancy detected (Measured 3.9m vs Expected 2.5m). High hazard risk priority."
  },
  {
    id: "DET-9024",
    label: "YOLO11-Known: Historic Wreckage",
    class: "Shipwreck Hull",
    type: "Known",
    confidence: 97.8,
    depth: 1510.4,
    lat: "11°23'12.0\"N",
    lng: "142°11'50.2\"E",
    status: "CONFIRMED",
    hazardScore: 60,
    time: "22:38:50",
    xRatio: 0.82,
    yRatio: 0.22,
    wRatio: 0.16,
    hRatio: 0.25,
    physics: {
      shadowLengthExpected: "8.5m",
      shadowLengthMeasured: "8.4m",
      shadowMatchRatio: 98.8,
      crossPingCoherence: "16/16 pings",
      impedanceReflectivity: "0.68 (Corroded Structural Iron)",
      sizePlausibility: "PASS",
      shadowStatus: "PASS",
      crossPingStatus: "PASS"
    },
    chipSvgType: "wreck",
    notes: "Historically logged 1944 hull fragment. Stable acoustic signature."
  },
  {
    id: "DET-9028",
    label: "YOLO11-Known: Fiber-Optic Line",
    class: "Subsea Cable",
    type: "Known",
    confidence: 96.1,
    depth: 1412.0,
    lat: "11°21'10.5\"N",
    lng: "142°14'02.1\"E",
    status: "CONFIRMED",
    hazardScore: 30,
    time: "22:35:10",
    xRatio: 0.15,
    yRatio: 0.82,
    wRatio: 0.35,
    hRatio: 0.08,
    physics: {
      shadowLengthExpected: "0.4m",
      shadowLengthMeasured: "0.41m",
      shadowMatchRatio: 97.5,
      crossPingCoherence: "10/10 pings",
      impedanceReflectivity: "0.55 (Armored Cable Jacket)",
      sizePlausibility: "PASS",
      shadowStatus: "PASS",
      crossPingStatus: "PASS"
    },
    chipSvgType: "cable",
    notes: "Trans-Pacific telecommunications cable segment."
  },
  {
    id: "ANOM-09",
    label: "Anomaly-09: Low-Reflectivity Mound",
    class: "Hydrothermal Seep / Gas Mound",
    type: "Unknown",
    confidence: 76.4,
    depth: 1560.1,
    lat: "11°24'02.4\"N",
    lng: "142°10'33.8\"E",
    status: "UNDER_INVESTIGATION",
    hazardScore: 45,
    time: "22:45:11",
    xRatio: 0.42,
    yRatio: 0.18,
    wRatio: 0.18,
    hRatio: 0.15,
    physics: {
      shadowLengthExpected: "1.8m",
      shadowLengthMeasured: "1.9m",
      shadowMatchRatio: 94.4,
      crossPingCoherence: "4/8 pings",
      impedanceReflectivity: "0.22 (Soft Silt / Fluid Dispersion)",
      sizePlausibility: "PASS",
      shadowStatus: "PASS",
      crossPingStatus: "PENDING"
    },
    chipSvgType: "mound",
    notes: "Diffuse acoustic backscatter plume consistent with active benthic pore-fluid expulsion."
  }
];

export const INITIAL_METRICS = {
  surveyedAreaKm2: 184.6,
  pingsProcessed: 148920,
  totalDetections: 14,
  knownObjects: 11,
  unknownAnomalies: 3,
  flaggedQueueCount: 3,
  dataQualityScore: 96.4,
  snrDb: 24.8,
  coverageCompleteness: 94.7,
  noiseFilteredPercent: 98.2,
  gapsFlaggedKm2: 0.04,
  missionConfidence: 98.1
};

export const BATHYMETRY_HAZARDS = [
  {
    id: "HAZ-01",
    targetId: "ANOM-07",
    label: "Submerged Unexploded Ordnance (UXO) Risk Zone",
    lat: "11°20'59.1\"N",
    lng: "142°13'12.4\"E",
    hazardIndex: 94,
    depth: 1390.8,
    ecologicalSensitivity: "CRITICAL (Deep Sea Coral Colony)",
    recommendedAction: "Establish 500m exclusion perimeter & deploy ROV optical verification",
    priority: "HIGH"
  },
  {
    id: "HAZ-02",
    targetId: "ANOM-03",
    label: "Unidentified High-Density Cylindrical Mass",
    lat: "11°22'04.8\"N",
    lng: "142°12'45.1\"E",
    hazardIndex: 85,
    depth: 1485.2,
    ecologicalSensitivity: "MODERATE (Abyssal Plain)",
    recommendedAction: "Execute multi-angle 900kHz SAS high-frequency aperture re-scan",
    priority: "HIGH"
  },
  {
    id: "HAZ-03",
    targetId: "DET-9024",
    label: "Historic Structural Wreckage Sharp Debris Field",
    lat: "11°23'12.0\"N",
    lng: "142°11'50.2\"E",
    hazardIndex: 60,
    depth: 1510.4,
    ecologicalSensitivity: "PROTECTED (Benthic Habitat)",
    recommendedAction: "Log collision avoidance waypoint for AUV navigation path",
    priority: "MEDIUM"
  },
  {
    id: "HAZ-04",
    targetId: "ANOM-09",
    label: "Active Benthic Fluid Vent Plume",
    lat: "11°24'02.4\"N",
    lng: "142°10'33.8\"E",
    hazardIndex: 45,
    depth: 1560.1,
    ecologicalSensitivity: "HIGH (Chemosynthetic Ecosystem)",
    recommendedAction: "Sample acoustic water-column backscatter for dissolved methane surge",
    priority: "LOW"
  }
];

export const INITIAL_PAST_REPORTS = [
  {
    id: "REP-2026-0914-A",
    title: "PACIFIC-ABYSS Sector 7-A Preliminary Bathymetric Survey",
    timestamp: "2026-09-14 18:30 UTC",
    author: "Chief Hydrographer Dr. V. Vance",
    detectionsCount: 10,
    highHazardsCount: 1,
    status: "ARCHIVED",
    hash: "0x89f4a1c3d690e72f"
  },
  {
    id: "REP-2026-0913-C",
    title: "Mariana Ridge Acoustic Anomaly Forensic Audit",
    timestamp: "2026-09-13 14:15 UTC",
    author: "Autonomous AI Pipeline Safety Unit",
    detectionsCount: 18,
    highHazardsCount: 3,
    status: "VERIFIED",
    hash: "0x3e110b97a2df541c"
  }
];
