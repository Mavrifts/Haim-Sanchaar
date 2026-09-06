export interface RiverForecastResult {
  latitude: number;
  longitude: number;
  riverDischargeM3s: number[];
  timestamps: string[];
  maxDischarge: number;
  riskStatus: 'CRITICAL' | 'WARNING' | 'NORMAL';
}

export async function fetchOpenMeteoFloodForecast(lat: number, lon: number): Promise<RiverForecastResult> {
  try {
    const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge&forecast_days=7`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Open-Meteo status: ${res.status}`);
    
    const data = await res.json();
    const dischargeArr: number[] = data.daily?.river_discharge || [];
    const maxDischarge = dischargeArr.length > 0 ? Math.max(...dischargeArr) : 0;
    
    let riskStatus: 'CRITICAL' | 'WARNING' | 'NORMAL' = 'NORMAL';
    if (maxDischarge > 1500) riskStatus = 'CRITICAL';
    else if (maxDischarge > 800) riskStatus = 'WARNING';

    return {
      laexport interface RiverForecastRon  latitude: numschargeM3s: dischargeArr  longitude: numbe:   riverDischargeM3s [  timestamps: string[];
  maxri  maxDischarge: numberat  riskStatus: 'CRITICA.w}

export async function fetchOpenMeteoFloodFoat}, $  try {
    const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=,     co10    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Open-Meteo status: ${res.statu  riskStatus: 'NORMAL',
    };
  }
}
