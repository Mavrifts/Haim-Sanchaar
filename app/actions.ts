'use server';

export interface LocationData {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  water_level: string;
  flow_rate_cumecs: number;
  battery_level: number;
  status: 'HIGH' | 'CRITICAL' | 'NORMAL';
  risk_status: 'CRITICAL' | 'WARNING' | 'NORMAL';
  safe_shelter?: string;
  emergency_numbers?: string[];
}

export const MULTI_STATE_LOCATIONS: LocationData[] = [
  // Himachal Pradesh
  { id: 'HP-01', name: 'Beas River Main', district: 'Kullu', state: 'Himachal Pradesh', latitude: 31.9579, longitude: 77.1095, water_level: '2100', flow_rate_cumecs: 12400, battery_level: 98, status: 'CRITICAL', risk_status: 'CRITICAL', safe_shelter: 'Manali Higher Ground Staging Area', emergency_numbers: ['NDRF HQ: 1078', 'Kullu SEOC: 01902-222330'] },
  { id: 'HP-02', name: 'Pandoh Hydro Power Substation', district: 'Mandi', state: 'Himachal Pradesh', latitude: 31.6720, longitude: 77.0422, water_level: '1420', flow_rate_cumecs: 9800, battery_level: 95, status: 'HIGH', risk_status: 'WARNING', safe_shelter: 'Sundernagar Polytechnic High Grounds', emergency_numbers: ['Mandi SEOC: 01905-226201'] },
  { id: 'HP-03', name: 'Shimla SEOC Command Base', district: 'Shimla', state: 'Himachal Pradesh', latitude: 31.1048, longitude: 77.1734, water_level: '450', flow_rate_cumecs: 2100, battery_level: 100, status: 'NORMAL', risk_status: 'NORMAL', safe_shelter: 'Ridge Assembly Center', emergency_numbers: ['HP SEOC: 1070'] },
  
  // Uttarakhand
  { id: 'UK-01', name: 'Alaknanda Confluence Gauge', district: 'Chamoli', state: 'Uttarakhand', latitude: 30.5595, longitude: 79.3267, water_level: '1890', flow_rate_cumecs: 11200, battery_level: 92, status: 'CRITICAL', risk_status: 'CRITICAL', safe_shelter: 'Joshimath Army Helipad Grounds', emergency_numbers: ['Uttarakhand SEOC: 1070', 'Chamoli Control: 01372-251437'] },
  { id: 'UK-02', name: 'Bhagirathi Sector 4', district: 'Uttarkashi', state: 'Uttarakhand', latitude: 30.7268, longitude: 78.4354, water_level: '1200', flow_rate_cumecs: 7400, battery_level: 96, status: 'HIGH', risk_status: 'WARNING', safe_shelter: 'Uttarkashi ITBP Camp', emergency_numbers: ['Uttarkashi Control: 01374-222744'] },

  // Jammu & Kashmir
  { id: 'JK-01', name: 'Srinagar Jhelum Banks', district: 'Srinagar', state: 'Jammu & Kashmir', latitude: 34.0837, longitude: 74.7973, water_level: '2250', flow_rate_cumecs: 14100, battery_level: 91, status: 'CRITICAL', risk_status: 'CRITICAL', safe_shelter: 'Hari Parbat Staging Station', emergency_numbers: ['J&K SEOC: 0194-2452138'] },
  { id: 'JK-02', name: 'Jammu Tawi Front', district: 'Jammu', state: 'Jammu & Kashmir', latitude: 32.7266, longitude: 74.8570, water_level: '850', flow_rate_cumecs: 4200, battery_level: 99, status: 'NORMAL', risk_status: 'NORMAL', safe_shelter: 'Jammu University High Grounds', emergency_numbers: ['Jammu Control: 0191-2571616'] },

  // Ladakh
  { id: 'LA-01', name: 'Indus River Leh Basin', district: 'Leh', state: 'Ladakh', latitude: 34.1526, longitude: 77.5771, water_level: '1100', flow_rate_cumecs: 5600, battery_level: 94, status: 'HIGH', risk_status: 'WARNING', safe_shelter: 'Leh Fortress Assembly Point', emergency_numbers: ['Ladakh SEOC: 01982-255555'] },
  { id: 'LA-02', name: 'Suru River Hydro Desk', district: 'Kargil', state: 'Ladakh', latitude: 34.5539, longitude: 76.1349, water_level: '620', flow_rate_cumecs: 3100, battery_level: 97, status: 'NORMAL', risk_status: 'NORMAL', safe_shelter: 'Kargil Stadium Complex', emergency_numbers: ['Kargil Control: 01985-232216'] }
];

export const DATA_SOURCES_PROVENANCE = [
  { org: 'Central Water Commission (CWC)', name: 'Hydro-Gauge Network', url: 'https://ffs.rcmcwc.org', frequency: 'Hourly' },
  { org: 'Open-Meteo', name: 'Global Flood API', url: 'https://open-meteo.com/en/docs/flood-api', frequency: '6-Hour' },
  { org: 'India Meteorological Department (IMD)', name: 'AWS Rainfall Telemetry', url: 'https://mausam.imd.gov.in', frequency: '15-Min' },
  { org: 'National Disaster Management Authority (NDMA)', name: 'SACHET CAP Alerts', url: 'https://sachet.ndma.gov.in', frequency: 'Real-time' }
];

export async function fetchTelemetryData() {
  return MULTI_STATE_LOCATIONS;
}

export function getVillagesByState(state: string) {
  if (!state || state === 'ALL') return MULTI_STATE_LOCATIONS;
  return MULTI_STATE_LOCATIONS.filter(item => item.state.toLowerCase() === state.toLowerCase());
}

export async function fetchDashboardData(state?: string) {
  const locations = getVillagesByState(state || 'ALL');
  return {
    locations,
    totalActiveSensors: locations.length,
    criticalAlertsCount: locations.filter(l => l.risk_status === 'CRITICAL').length,
    lastSyncTimestamp: new Date().toISOString()
  };
}

export async function dispatchORT(payload: any) {
  console.log('Dispatching Quick Operational Response Team:', payload);
  return { success: true, timestamp: new Date().toISOString() };
}

