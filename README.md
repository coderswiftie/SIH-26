# CyanO — Deep-Ocean Survey Workstation

**Smart India Hackathon 2026 · Problem Statement 26057**
AI-assisted detection and hazard analysis of submerged objects in side-scan / synthetic aperture sonar imagery.

CyanO is an analyst-facing marine survey workstation. It takes sonar survey output and turns it into a reviewable intelligence workflow: acoustic targets are detected and classified, unknown returns are queued for forensic verification, hazards are ranked and plotted against bathymetry, and the whole mission is compiled into an exportable briefing.

> [!IMPORTANT]
> **Current status: frontend prototype with simulated data.**
> This repository contains the complete analyst interface running on a synthetic SAS dataset (`src/types/data.js`). There is **no backend, no trained model, and no live sonar ingestion** yet. All detections, confidence scores, physics-verification figures, and telemetry are mock values designed to demonstrate the intended workflow. Model integration is planned — see [Roadmap](#roadmap).

---

## Table of contents

- [Why this project](#why-this-project)
- [What the interface does](#what-the-interface-does)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Data model](#data-model)
- [Feature reference](#feature-reference)
- [Design system](#design-system)
- [Roadmap](#roadmap)
- [Known limitations](#known-limitations)
- [Contributing](#contributing)

---

## Why this project

Seabed surveys generate enormous volumes of sonar imagery. Finding the things that matter in that imagery — ghost fishing nets, exposed pipelines, unexploded ordnance, wreckage, debris fields — is still largely manual, slow, and dependent on scarce expert interpreters. Acoustic data is also genuinely hard to read: returns are noisy, geometry is distorted, and a rock and a mine can look nearly identical in a low-frequency sweep.

CyanO addresses the analyst half of that problem. Rather than treating detection as a single automated verdict, it treats every unknown return as **evidence to be verified** — cross-checking acoustic shadow geometry, multi-ping temporal coherence, and size plausibility before anything is escalated. A human analyst stays in the loop and owns the final classification.

---

## What the interface does

The workstation is organised as five views around a persistent inspector panel:

| View | Purpose |
|---|---|
| **Overview** | Mission health at a glance — survey KPIs, live sonar viewer, data-quality gauges, processing pipeline status |
| **Detection Feed** | Complete searchable/filterable log of every acoustic target with confidence, depth, and coordinates |
| **Investigation Queue** | Forensic review of unknown returns with a physics-verification checklist and analyst actions |
| **Geo & Hazard Map** | Bathymetric chart with swath track, hazard nodes, switchable overlays, and a ranked hazard table |
| **Mission Reports** | Multi-stage report synthesis with executive summary, findings, hazard priorities, and CSV/JSON/PDF export |

The **Inspector** (right rail) is persistent across all five views. Selecting a target anywhere — a bounding box on the sonar canvas, a row in the detection feed, a node on the map, a row in the hazard table — locks it into the Inspector, so the analyst never loses context when switching views.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **React 19** | Function components + hooks throughout |
| Build tool | **Vite 6** | Dev server on port `5173`, `host: true` for LAN testing |
| Styling | **Vanilla CSS** | CSS custom properties for tokens; no Tailwind or CSS-in-JS runtime |
| Icons | **lucide-react** | |
| Rendering | **HTML5 Canvas + inline SVG** | Canvas for the sonar viewer, SVG for the bathymetric map |
| Audio | **Web Audio API** | Synthesised acoustic feedback, no audio assets |
| State | **React Context** | Single provider, no Redux/Zustand |

Deliberately zero heavyweight dependencies — no charting library, no map library (Leaflet/Mapbox), no UI kit. The sonar viewer and bathymetric chart are both hand-rendered, which keeps the bundle small (~95 KB gzipped) and the visual language fully controllable.

---

## Getting started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm

### Install and run

```bash
git clone https://github.com/<your-org>/SIH-26.git
cd SIH-26
npm install
npm run dev
```

The dev server starts at **http://localhost:5173**. Because `vite.config.js` sets `host: true`, it is also reachable from other devices on the same network — useful for demoing on a phone or tablet.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

### Verifying the build

```bash
npm run build
```

Expect a clean build with no warnings — roughly 1,600 modules transformed, ~339 KB JS (~95 KB gzipped) and ~5.8 KB CSS.

---

## Project structure

```
SIH-26/
├── index.html                      # Entry point; loads IBM Plex Sans, Inter, JetBrains Mono
├── package.json
├── vite.config.js                  # React plugin, port 5173, host: true
├── claude-cyano-dashboard-mockup-.html   # Original standalone design mockup (reference only)
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                    # React root
    ├── App.jsx                     # Shell: Toast + TopBar + (LeftNav | MainContent | Inspector)
    ├── index.css                   # Design system: tokens, base styles, utilities
    ├── types/
    │   └── data.js                 # Synthetic SAS dataset (detections, metrics, hazards, reports)
    ├── context/
    │   └── MissionContext.jsx      # Single source of truth — all state and mutations
    ├── utils/
    │   ├── audio.js                # Web Audio sonar ping/tick synthesiser
    │   └── export.js               # CSV / JSON generators + print-to-PDF trigger
    └── components/
        ├── layout/
        │   ├── TopBar.jsx          # Mission metadata, live ingestion badge, UTC clock, audio toggle
        │   ├── LeftNav.jsx         # View switcher with live badge counts
        │   ├── Inspector.jsx       # Persistent target detail + physics evidence + analyst actions
        │   └── Toast.jsx           # Transient notification banner
        ├── overview/
        │   ├── OverviewTab.jsx
        │   ├── KpiCards.jsx        # Survey KPIs; clickable shortcuts into filtered views
        │   ├── SonarViewer.jsx     # Canvas sonar viewer — beam sweep, bounding boxes, ripples
        │   ├── QualityReport.jsx   # SNR, coverage, noise-filtering gauges
        │   └── PipelineTracker.jsx # 6-stage pipeline with progressing state + packet animation
        ├── detection/
        │   └── DetectionFeedTab.jsx
        ├── investigation/
        │   ├── InvestigationTab.jsx
        │   └── PhysicsBadge.jsx    # PASS / PENDING / FAIL / FLAGGED badge
        ├── geo/
        │   ├── GeoMapTab.jsx       # SVG bathymetric chart with pan/zoom
        │   ├── MapControls.jsx     # Overlay layer switcher
        │   └── HazardRankTable.jsx # Ranked hazards with recommended actions
        └── reports/
            ├── ReportsTab.jsx      # Synthesis orchestration + staged animation
            ├── ReportPreview.jsx   # Rendered briefing document
            └── ReportHistory.jsx   # Archived briefings
```

---

## Architecture

### State flow

All application state lives in **one provider**: `src/context/MissionContext.jsx`. No component owns domain data; every view reads from context via the `useMission()` hook and mutates through the actions the provider exposes.

```
MissionProvider
   ├── state:    activeTab, selectedObjectId, detections, metrics, hazards,
   │             reportsHistory, toast, audioMuted, sonarPalette,
   │             sonarFrequency, utcTime, typeFilter, statusFilter
   │
   ├── actions:  selectObject, confirmHazard, reclassifyObject,
   │             escalateToCommand, dismissObject, updatePhysicsStatus,
   │             injectSimulatedAnomaly, jumpToFilteredView,
   │             toggleAudio, showToast
   │
   └── consumed by: TopBar, LeftNav, Inspector, all five tab views
```

This has a deliberate consequence: **an action taken anywhere propagates everywhere instantly.** Confirming a hazard in the Investigation Queue immediately updates the detection feed row, the Inspector panel, the map node colour, the nav badge count, and the next generated report — because they're all rendering the same array.

It also defines the integration seam for real data. Every component reads from context rather than importing `data.js` directly, so swapping the mock dataset for live API responses means changing initial state in one file:

```js
// Today
const [detections, setDetections] = useState(INITIAL_DETECTIONS);

// After model integration
const [detections, setDetections] = useState([]);
useEffect(() => {
  fetch('/api/detections').then(r => r.json()).then(setDetections);
}, []);
```

No component changes required, provided the API returns the documented detection shape.

### Component conventions

- **Styles are colocated.** Each component carries its own scoped `<style>` block; only tokens, resets, and shared utilities live in `index.css`.
- **Named exports** for components (`export const Inspector = ...`); `App.jsx` also has a default export for the root.
- **Canvas/SVG rendering is effect-driven.** `SonarViewer` runs a `requestAnimationFrame` loop inside `useEffect`, keyed on `[detections, selectedObjectId, sonarPalette, sonarFrequency, gain]`, with refs for animation state that shouldn't trigger re-renders.

---

## Data model

### Detection object

The core entity. Every target — known classification or unknown anomaly — uses this shape:

```js
{
  id: "ANOM-03",                          // Unique target identifier
  label: "Anomaly-03: Cylindrical Metallic Structure",
  class: "Unknown Cylinder",              // Taxonomy class
  type: "Unknown",                        // "Known" | "Unknown"
  confidence: 88.7,                       // Percentage
  depth: 1485.2,                          // Metres
  lat: "11°22'04.8\"N",
  lng: "142°12'45.1\"E",
  status: "PENDING_REVIEW",               // See status values below
  hazardScore: 85,                        // 0–100
  time: "22:42:19",

  // Normalised bounding box (0–1) — resolution-independent so the same
  // box renders correctly at any canvas size
  xRatio: 0.64, yRatio: 0.42,
  wRatio: 0.14, hRatio: 0.18,

  // Physics-fusion evidence
  physics: {
    shadowLengthExpected: "4.8m",
    shadowLengthMeasured: "5.1m",
    shadowMatchRatio: 93.7,
    crossPingCoherence: "8/8 pings",
    impedanceReflectivity: "0.78 (High Metallic Density)",
    sizePlausibility: "FLAGGED",          // PASS | FLAGGED
    shadowStatus: "PASS",                 // PASS | PENDING | FAIL
    crossPingStatus: "PASS"               // PASS | PENDING | FAIL
  },

  chipSvgType: "cylinder",                // Drives the Inspector chip rendering
  notes: "Unidentified high-reflectivity acoustic highlight..."
}
```

**Status values:** `CONFIRMED` · `PENDING_REVIEW` · `HIGH_HAZARD` · `RECLASSIFIED` · `ESCALATED` · `DISMISSED_NOISE`

Targets escalated to command also carry an `escalatedAt` ISO timestamp.

### Mission metrics

```js
{
  surveyedAreaKm2: 184.6,      pingsProcessed: 148920,
  totalDetections: 14,         knownObjects: 11,
  unknownAnomalies: 3,         flaggedQueueCount: 3,
  dataQualityScore: 96.4,      snrDb: 24.8,
  coverageCompleteness: 94.7,  noiseFilteredPercent: 98.2,
  gapsFlaggedKm2: 0.04,        missionConfidence: 98.1
}
```

`pingsProcessed` and `surveyedAreaKm2` increment once per second to simulate live ingestion, capped at 160,000 and 198 km² respectively so the figures stay plausible during a long demo.

### Hazard object

```js
{
  id: "HAZ-01",
  targetId: "ANOM-07",                    // Links back to a detection
  label: "Submerged Unexploded Ordnance (UXO) Risk Zone",
  lat: "11°20'59.1\"N", lng: "142°13'12.4\"E",
  hazardIndex: 94,                        // 0–100
  depth: 1390.8,
  ecologicalSensitivity: "CRITICAL (Deep Sea Coral Colony)",
  recommendedAction: "Establish 500m exclusion perimeter & deploy ROV optical verification",
  priority: "HIGH"                        // HIGH | MEDIUM | LOW
}
```

### Report object

```js
{
  id: "REP-2026-0914-A",
  title: "PACIFIC-ABYSS Sector 7-A Preliminary Bathymetric Survey",
  timestamp: "2026-09-14 18:30 UTC",
  author: "Chief Hydrographer Dr. V. Vance",
  detectionsCount: 10, highHazardsCount: 1,
  status: "ARCHIVED",                     // ARCHIVED | VERIFIED
  hash: "0x89f4a1c3d690e72f"              // Integrity hash
}
```

---

## Feature reference

### Top bar

Mission context strip: mission ID `PACIFIC-ABYSS-09`, vessel `R/V Oceanus Explorer`, sector `Sector 7-B (Mariana Ridge)`, sonar `SAS-X4` with the currently selected frequency. Includes a pulsing live-ingestion indicator, a UTC clock ticking every second, and an acoustic feed mute toggle (muted by default so the app never makes noise unprompted).

### Sonar viewer (`SonarViewer.jsx`)

The centrepiece. A canvas-rendered side-scan waterfall with:

- **Procedural acoustic texture** whose density responds to the selected frequency
- **Sweeping beam** that traverses the canvas, with speed scaled by frequency
- **Bounding boxes** — solid outline for known classifications, dashed for unknown anomalies
- **Beam-intersection ripples** that fire when the sweep crosses a target, tracked in a ref-based ripple pool and expired on completion
- **Click-to-select** — clicking a box locks that target into the Inspector
- **Controls** — palette selector (Deep Cyan / Amber Phosphor / Emerald Night), 450 kHz / 900 kHz frequency toggle, gain slider
- **Live telemetry chips** — range, frequency, swath width, all derived from the active frequency (900 kHz → 150 m range / 300 m swath; 450 kHz → 300 m / 600 m)

### Pipeline tracker

Six processing stages — Ingestion → Quality check → Tiling → Detection → Physics fusion → Trust & mapping — each in a `DONE` / `RUNNING` / `PENDING` state. The running stage advances on an interval and wraps around, with an animated packet dot travelling the chain to convey continuous throughput.

### KPI cards

Survey metrics rendered as instrument readouts. Cards are **interactive shortcuts**: clicking one calls `jumpToFilteredView()`, which sets the relevant filters and switches tabs — so "3 flagged" takes you straight to the filtered Investigation Queue rather than requiring manual navigation.

### Detection feed

Dense log table: ID, class, type, confidence, depth, coordinates, status, time, action. Filtering by free-text search (across ID, class, and label), type (All / Known / Unknown), status, and a minimum-confidence slider. Row click locks the target into the Inspector with audio feedback.

### Investigation queue

Forensic review cards for unknown returns. Each shows the acoustic chip, metadata, and a **physics-verification checklist**:

| Check | What it tests | States |
|---|---|---|
| Shadow consistency | Does the acoustic shadow length match the object's apparent height? | `PASS` / `PENDING` / `FAIL` |
| Cross-ping verification | Does the return persist coherently across consecutive pings? | `PASS` / `PENDING` / `FAIL` |
| Size plausibility | Are the dimensions physically plausible for the proposed class? | `PASS` / `FLAGGED` |

Analyst actions per card: **Confirm as hazard**, **Reclassify** (inline taxonomy selector), **Dismiss as noise**. An **Inject simulated anomaly** control generates a new randomised unknown target — useful for demonstrating live ingestion into the queue.

### Inspector

Persistent target detail panel:

- Target lock header with ID, class, and type
- Rendered acoustic chip with shadow profile (driven by `chipSvgType`)
- Confidence gauge, depth, coordinates, status badge
- **Physics-fusion evidence breakdown** — shadow length expected vs measured with match ratio, cross-ping coherence count, acoustic impedance/reflectivity. Shadow and cross-ping statuses are manually overridable, reflecting that the analyst, not the model, owns the verdict.
- **Actions** — Confirm high hazard · Reclassify · Escalate to command (fires a toast and stamps `escalatedAt`) · Dismiss · Export high-res chip (PNG, drawn to an offscreen canvas and downloaded)

**Reclassification taxonomy:** Subsea Cable · Subsea Pipeline · Submerged UXO / Mine · Shipwreck Hull · Deep Sea Coral Colony · Hydrothermal Vent Plume

### Geo & hazard map

Hand-rendered SVG bathymetric chart:

- Depth contour isolines and vessel swath trajectory
- Hazard nodes colour-coded by priority (high / medium / low)
- **Pan and zoom** via viewBox manipulation — drag to pan, scroll to zoom, clamped from roughly 400% in to 33% out, with a reset control. The wheel listener is attached non-passively so `preventDefault()` actually suppresses page scroll.
- **Overlay layers** — Hazard priority · Ecological sensitivity · Confidence & uncertainty heat
- Node click locks the target into the Inspector
- **Hazard ranking table** — hazard index, ecological sensitivity, recommended action, with rows linking back to their detection

### Mission reports

`GENERATE MISSION REPORT` runs a staged synthesis animation — `ANALYZING` → `FUSING` → `CALCULATING` → `COMPILING` → `COMPLETE` — each stage with a distinct audio tone, then renders a briefing document:

1. Executive summary
2. Key survey findings
3. Priority benthic hazards
4. Confidence and data-quality statement, with an integrity hash

Reports are generated from **current** state, so any confirmations, reclassifications, or escalations made during the session are reflected. Completed reports append to the archive list.

**Exports** (`src/utils/export.js`):
- `exportToCSV()` → `cyano_mission_detections.csv` — full detection table
- `exportToJSON()` → `cyano_mission_intelligence.json` — complete structured payload
- `triggerPrintPDF()` → browser print dialogue against the print stylesheet

### Audio feedback

`src/utils/audio.js` implements a small Web Audio synthesiser — no audio files. Oscillator-based pings at varying frequencies mark significant events (hazard confirmation, escalation, report stages) and short ticks mark selections. Muted by default; toggled from the top bar.

---

## Design system

Defined as CSS custom properties in `src/index.css`. The current theme is a **light professional marine-science workstation** palette, chosen for projector legibility and to read as scientific instrumentation rather than entertainment sci-fi.

```css
/* Surfaces */
--bg-app: #F5F8F8;        --bg-surface: #FFFFFF;
--bg-surface-alt: #EDF4F4; --bg-inset: #E6EEEF;

/* Brand teal */
--teal-primary: #087F8C;  --teal-bright: #13A7B5;  --teal-deep: #075B66;

/* Semantic */
--success: #31856B;  --warning: #B9852E;  --hazard: #C84A4A;

/* Text */
--text-primary: #183238;   --text-secondary: #60777B;
--text-muted: #8FA8AC;     --text-faint: #B0C8CB;

/* Borders */
--border-soft: #D6E3E4;  --border-dim: #E3ECEC;  --border-bright: #087F8C;
```

**Typography:** IBM Plex Sans for UI and display, JetBrains Mono for all telemetry, coordinates, IDs, and numeric readouts. Monospace for data is deliberate — it keeps columns aligned and signals machine-generated values.

> [!NOTE]
> The token block retains legacy dark-theme aliases (`--bg-deep`, `--cyan-primary`, `--green-success`, etc.) mapped onto the light palette. This is intentional: the instrument-panel components — sonar canvas, acoustic chips — still render on dark surfaces, since sonar imagery is conventionally displayed light-on-dark. The aliases keep those scoped styles compiling while the surrounding chrome stays light.

---

## Roadmap

The interface layer is complete. The substantive remaining work is making detection real.

### Phase 1 — Detection model
- Assemble a training set from public side-scan sonar datasets (KLSG, AI4Shipwrecks, SASSED)
- Fine-tune a YOLO-family detector via transfer learning from pretrained weights
- Record honest mAP@0.5 on held-out data — to be surfaced in the report's confidence statement rather than the current placeholder figures

### Phase 2 — Inference service
- `POST /detect` — accepts a sonar tile plus survey metadata, returns detections in the documented schema
- Pixel-to-geographic conversion from tow path, heading, altitude, and slant range
- Confidence thresholding and hard-negative filtering to control false positives

### Phase 3 — Integration
- Replace `INITIAL_DETECTIONS` with a fetch in `MissionContext` (see [Architecture](#architecture))
- Add a sonar tile upload flow feeding the live pipeline
- Wire the confidence slider to filter real model output
- Derive report confidence statements from actual model metrics

### Phase 4 — Physics fusion
Promote the physics-verification panel from presentational to computed:
- Shadow length measurement from the acoustic shadow region, compared against predicted height from platform geometry
- Cross-ping coherence from consecutive overlapping pings
- Size plausibility against per-class dimension priors

---

## Known limitations

Stated plainly, because overstating a prototype's capability is worse than scoping it honestly.

- **No machine learning.** No model is trained, loaded, or run. `label` fields referencing detector output describe intent, not execution.
- **All data is synthetic.** Detections, coordinates, depths, confidence scores, SNR, and coverage figures are authored fixtures. The physics-fusion numbers are illustrative, not measured.
- **Coordinates are not derived.** Lat/long values are static strings, not computed from platform geometry.
- **Confidence scores are not calibrated.** They are plausible-looking constants.
- **The pipeline tracker is presentational.** It animates a plausible processing sequence; no work is performed at any stage.
- **Acoustic texture is procedural noise,** not real sonar return data.
- **The report integrity hash is randomly generated,** not a cryptographic digest of report contents.
- **No persistence.** State is in-memory; a page reload restores the initial dataset.
- **Desktop-first.** The three-column shell targets wide viewports and is not responsive to small screens.

---

## Contributing

Conventions to preserve when extending the codebase:

1. **Domain state belongs in `MissionContext`.** Don't add `useState` for detections, metrics, or hazards inside a component — add it to the provider and expose an action. Purely local UI state (a dropdown's open flag, a filter input) stays local.
2. **Read from context, never import `data.js` in a component.** This keeps the model-integration seam clean.
3. **Colocate styles.** Component-specific CSS goes in that component's `<style>` block; only tokens and shared utilities go in `index.css`.
4. **Use tokens, not literal colours.** Hard-coded hex values break theming.
5. **Monospace for data.** Any telemetry, ID, coordinate, or numeric readout uses `--font-mono`.
6. **Normalised bounding boxes.** Keep box geometry in `xRatio`/`yRatio`/`wRatio`/`hRatio` (0–1) so canvas rendering stays resolution-independent.
7. **Verify before committing.** `npm run build` should complete with no errors or warnings.

### Commit convention

```
feat: add cross-ping coherence computation to physics panel
fix: clamp map zoom to prevent viewBox inversion
docs: document detection schema in README
```

Note in the commit body whether a change affects simulated versus real data — that distinction matters while the project straddles both.

---

## Acknowledgements

Built for **Smart India Hackathon 2026**, Problem Statement 26057.
