export interface OpenMeteoFloodResponse {
  latitude: number;
  longitude: number;
  daily?: {
    time: string[];
    river_discharge?: number[];
  };
}

export interface FloodRiskAssessment {
  latitude: number;
  longitude: number;
  currentDischarge: number;
  peakDischarge7d: number;
  riskStatus: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE';
  isFallback: boolean;
}

/**
 * Fetch river discharge forecast from Open-Meteo Flood API & classify risk.
 */
export async function getOpenMeteoFloodForecast(
  lat: number,
  lng: number
): Promise<FloodRiskAssessment> {
  try {
    const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lng}&daily=river_discharge`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Open-Meteo API returned status ${res.status}`);
    }

    const data: OpenMeteoFloodResponse = await res.json();
    const discharges = data.daily?.river_discharge || [];

    const currentDischarge = discharges[0] ?? 1250;
    const peakDischarge7d = discharges.length > 0 ? Math.max(...discharges) : 1800;

    let riskStatus: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE' = 'SAFE';
    if (peakDischarge7d > 15000) {
      riskStatus = 'CRITICAL';
    } else if (peakDischarge7d > 8000) {
      riskStatus = 'HIGH';
    } else if (peakDischarge7d > 3000) {
      riskStatus = 'MODERATE';
    }

    return {
      latitude: lat,
      longitude: lng,
      currentDischarge,
      peakDischarge7d,
      riskStatus,
      isFallback: false,
    };
  } catch (err: any) {
    console.warn(`Open-Meteo Flood API fallback activated for (${lat}, ${lng}):`, err?.message || err);
    return {
      latitude: lat,
      longitude: lng,
      currentDischarge: 14500,
      peakDischarge7d: 18400,
      riskStatus: 'CRITICAL',
      isFallback: true,
    };
  }
}
