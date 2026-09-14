// Export Generators for CyanO Deep Ocean Intelligence Reports

export const exportToCSV = (detections, filename = 'cyano_mission_detections.csv') => {
  const headers = ['ID', 'Label', 'Class', 'Type', 'Confidence (%)', 'Depth (m)', 'Latitude', 'Longitude', 'Status', 'Hazard Score', 'Time'];
  
  const rows = detections.map(d => [
    `"${d.id}"`,
    `"${d.label}"`,
    `"${d.class}"`,
    `"${d.type}"`,
    d.confidence,
    d.depth,
    `"${d.lat}"`,
    `"${d.lng}"`,
    `"${d.status}"`,
    d.hazardScore,
    `"${d.time}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'cyano_mission_intelligence.json') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const triggerPrintPDF = () => {
  window.print();
};
