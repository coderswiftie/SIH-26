import React from 'react';
import { MissionProvider, useMission } from './context/MissionContext';
import { TopBar } from './components/layout/TopBar';
import { LeftNav } from './components/layout/LeftNav';
import { Inspector } from './components/layout/Inspector';
import { OverviewTab } from './components/overview/OverviewTab';
import { DetectionFeedTab } from './components/detection/DetectionFeedTab';
import { InvestigationTab } from './components/investigation/InvestigationTab';
import { GeoMapTab } from './components/geo/GeoMapTab';
import { ReportsTab } from './components/reports/ReportsTab';

const MainContent = () => {
  const { activeTab } = useMission();

  return (
    <main className="main-content">
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'detection' && <DetectionFeedTab />}
      {activeTab === 'investigation' && <InvestigationTab />}
      {activeTab === 'geo' && <GeoMapTab />}
      {activeTab === 'reports' && <ReportsTab />}

      <style>{`
        .main-content {
          overflow-y: auto;
          padding: 16px 20px;
          height: 100%;
        }
      `}</style>
    </main>
  );
};

export function App() {
  return (
    <MissionProvider>
      <div className="app-shell">
        <div className="scanline-overlay"></div>
        <TopBar />
        <div className="body-layout">
          <LeftNav />
          <MainContent />
          <Inspector />
        </div>
      </div>
    </MissionProvider>
  );
}

export default App;
