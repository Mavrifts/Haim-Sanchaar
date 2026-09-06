'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ActiveState = 'Himachal Pradesh' | 'Uttarakhand' | 'Ladakh' | 'Jammu & Kashmir';
export type UserMode = 'citizen' | 'official';
export type ForecastWindow = '0-3h' | '3-6h' | '6-24h';

export const GLOBAL_DICTIONARY: Record<string, Record<string, string>> = {
  en: {
    title: 'HEM SANCHAR',
    titleHindi: 'हेम संचार',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    dashboard: 'Situational Command',
    situationalCommand: 'Situational Command Center',
    map: 'Live GIS Map',
    telemetry: 'Telemetry Data',
    dataSources: 'Data Sources',
    emergency: 'Tactical Evacuation Directive',
    tacticalEvacuation: 'Tactical Evacuation Directive',
    helpline: 'MHA: 011-23438252 | NDRF: 1078 | SEOC: 1070',
    criticalSectors: 'Critical Sectors',
    populationAtRisk: 'Population At Risk',
    ndrfBattalions: 'Active Battalions',
    soilMoisture: 'Soil Moisture',
    peakSoilMoisture: 'Soil Saturation Rate',
    activeDangerZones: 'Active Danger Zones',
    reportIncident: 'Report Incident',
    citizenMode: 'Citizen Mode',
    officialMode: 'Official Command',
    forecastWindow: 'Forecast Horizon',
    riskExplainability: 'AI Risk Attribution & Explainability',
    sensorFallback: 'Sensor Status',
    primaryOnline: 'Primary IoT Telemetry Online',
    fallbackActive: 'Sensor Fallback Active: Satellite Runoff (IMD/ISRO)',
    impactAssessment: 'Impact Assessment',
    searchWatershed: 'Filter Micro-Watershed / Village...',
    capGenerator: 'CAP Geo-Alert Generator',
    evacuationRoutes: 'Terrain-Aware Evacuation Routes',
    citizenReports: 'Citizen Reports',
    infrastructureLayer: 'Critical Infrastructure',
    iotLayer: 'IoT Sensors & Gauges',
    waterLevel: 'Water Level',
    rainfallRate: 'Rainfall Rate',
    soilMoisturePct: 'Soil Saturation',
    startEvacuation: 'Start Safe Route Evacuation',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    realTimeTactical: 'Real-time tactical intelligence, AI directives, and active hydration telemetry for NDRF deployables.',
    aiSynthesized: 'AI-synthesized directives for mountain hazard sectors.'
  },
  hi: {
    title: 'हेम संचार',
    titleHindi: 'हेम संचार',
    subtitle: 'आपदा प्रबंधन प्रभाग | गृह मंत्रालय',
    minister: 'श्री अमित शाह — माननीय केंद्रीय गृह मंत्री',
    emblem: 'सत्यमेव जयते',
    dashboard: 'स्थितिजन्य कमान',
    situationalCommand: 'स्थितिजन्य कमान केंद्र',
    map: 'लाइव जीआईएस मानचित्र',
    telemetry: 'टेलीमेट्री डेटा',
    dataSources: 'डेटा स्रोत',
    emergency: 'सामरिक निकासी निर्देश',
    tacticalEvacuation: 'सामरिक निकासी निर्देश',
    helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078 | एसईओसी: 1070',
    criticalSectors: 'महत्वपूर्ण क्षेत्र',
    populationAtRisk: 'जोखिम में जनसंख्या',
    ndrfBattalions: 'सक्रिय बटालियन',
    soilMoisture: 'मृदा नमी',
    peakSoilMoisture: 'मृदा संतृप्ति दर',
    activeDangerZones: 'सक्रिय खतरे के क्षेत्र',
    reportIncident: 'घटना दर्ज करें',
    citizenMode: 'नागरिक मोड',
    officialMode: 'आधिकारिक कमान',
    forecastWindow: 'पूर्वानुमान सीमा',
    riskExplainability: 'एआई जोखिम व्याख्या',
    sensorFallback: 'सेंसर स्थिति',
    primaryOnline: 'प्राथमिक आईओटी ऑनलाइन',
    fallbackActive: 'सेंसर फॉलबैक सक्रिय: उपग्रह मॉडल (IMD/ISRO)',
    impactAssessment: 'प्रभाव आकलन',
    searchWatershed: 'सूक्ष्म-जलछाजन / गांव खोजें...',
    capGenerator: 'सीएपी भू-चेतावनी जनरेटर',
    evacuationRoutes: 'निकासी मार्ग',
    citizenReports: 'नागरिक रिपोर्ट',
    infrastructureLayer: 'महत्वपूर्ण बुनियादी ढांचा',
    iotLayer: 'आईओटी सेंसर और गेज',
    waterLevel: 'जल स्तर',
    rainfallRate: 'वर्षा दर',
    soilMoisturePct: 'मृदा नमी',
    startEvacuation: 'सुरक्षित निकासी शुरू करें',
    footer: 'टीम पावर पफ गर्ल्स द्वारा ❤️ के साथ विकसित | स्मार्ट इंडिया हैकथॉन 2026',
    language: 'भाषा',
    navHome: 'होम डैशबोर्ड',
    navGis: 'लाइव जीआईएस मैप',
    navTelemetry: 'टेलीमेट्री डेटा',
    navDataSources: 'डेटा स्रोत',
    navDirectives: 'आपातकालीन निर्देश',
    realTimeTactical: 'वास्तविक समय सामरिक बुद्धिमत्ता और एआई निर्देश।',
    aiSynthesized: 'पर्वतीय आपदा क्षेत्रों के लिए एआई निर्देश।'
  },
  doi: {
    title: 'HEM SANCHAR',
    titleHindi: 'हेम संचार',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Dogri)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    dashboard: 'Situational Command',
    situationalCommand: 'Situational Command Center',
    map: 'Live GIS Map',
    telemetry: 'Telemetry Data',
    dataSources: 'Data Sources',
    emergency: 'Tactical Evacuation Directive',
    tacticalEvacuation: 'Tactical Evacuation Directive',
    helpline: 'MHA: 011-23438252 | NDRF: 1078',
    criticalSectors: 'Critical Sectors',
    populationAtRisk: 'Population At Risk',
    ndrfBattalions: 'Active Battalions',
    soilMoisture: 'Soil Moisture',
    peakSoilMoisture: 'Soil Saturation Rate',
    activeDangerZones: 'Active Danger Zones',
    reportIncident: 'Report Incident',
    citizenMode: 'Citizen Mode',
    officialMode: 'Official Command',
    forecastWindow: 'Forecast Horizon',
    riskExplainability: 'AI Risk Attribution & Explainability',
    sensorFallback: 'Sensor Status',
    primaryOnline: 'Primary IoT Telemetry Online',
    fallbackActive: 'Sensor Fallback Active: Satellite Runoff (IMD/ISRO)',
    impactAssessment: 'Impact Assessment',
    searchWatershed: 'Search Village/Sector...',
    capGenerator: 'CAP Geo-Alert Generator',
    evacuationRoutes: 'Evacuation Routes',
    citizenReports: 'Citizen Reports',
    infrastructureLayer: 'Critical Infrastructure',
    iotLayer: 'IoT Sensors & Gauges',
    waterLevel: 'Water Level',
    rainfallRate: 'Rainfall Rate',
    soilMoisturePct: 'Soil Saturation',
    startEvacuation: 'Start Safe Route Evacuation',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    realTimeTactical: 'Real-time tactical intelligence and AI directives.',
    aiSynthesized: 'AI directives for disaster management.'
  },
  ks: {
    title: 'HEM SANCHAR',
    titleHindi: 'हेम संचार',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Kashmiri)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    dashboard: 'Situational Command',
    situationalCommand: 'Situational Command Center',
    map: 'Live GIS Map',
    telemetry: 'Telemetry Data',
    dataSources: 'Data Sources',
    emergency: 'Tactical Evacuation Directive',
    tacticalEvacuation: 'Tactical Evacuation Directive',
    helpline: 'MHA: 011-23438252 | NDRF: 1078',
    criticalSectors: 'Critical Sectors',
    populationAtRisk: 'Population At Risk',
    ndrfBattalions: 'Active Battalions',
    soilMoisture: 'Soil Moisture',
    peakSoilMoisture: 'Soil Saturation Rate',
    activeDangerZones: 'Active Danger Zones',
    reportIncident: 'Report Incident',
    citizenMode: 'Citizen Mode',
    officialMode: 'Official Command',
    forecastWindow: 'Forecast Horizon',
    riskExplainability: 'AI Risk Attribution & Explainability',
    sensorFallback: 'Sensor Status',
    primaryOnline: 'Primary IoT Telemetry Online',
    fallbackActive: 'Sensor Fallback Active: Satellite Runoff (IMD/ISRO)',
    impactAssessment: 'Impact Assessment',
    searchWatershed: 'Search Village...',
    capGenerator: 'CAP Geo-Alert Generator',
    evacuationRoutes: 'Evacuation Routes',
    citizenReports: 'Citizen Reports',
    infrastructureLayer: 'Critical Infrastructure',
    iotLayer: 'IoT Sensors & Gauges',
    waterLevel: 'Water Level',
    rainfallRate: 'Rainfall Rate',
    soilMoisturePct: 'Soil Saturation',
    startEvacuation: 'Start Safe Route Evacuation',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    realTimeTactical: 'Real-time tactical intelligence and AI directives.',
    aiSynthesized: 'AI directives for disaster management.'
  },
  lb: {
    title: 'HEM SANCHAR',
    titleHindi: 'हेम संचार',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Ladakhi)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    dashboard: 'Situational Command',
    situationalCommand: 'Situational Command Center',
    map: 'Live GIS Map',
    telemetry: 'Telemetry Data',
    dataSources: 'Data Sources',
    emergency: 'Tactical Evacuation Directive',
    tacticalEvacuation: 'Tactical Evacuation Directive',
    helpline: 'MHA: 011-23438252 | NDRF: 1078',
    criticalSectors: 'Critical Sectors',
    populationAtRisk: 'Population At Risk',
    ndrfBattalions: 'Active Battalions',
    soilMoisture: 'Soil Moisture',
    peakSoilMoisture: 'Soil Saturation Rate',
    activeDangerZones: 'Active Danger Zones',
    reportIncident: 'Report Incident',
    citizenMode: 'Citizen Mode',
    officialMode: 'Official Command',
    forecastWindow: 'Forecast Horizon',
    riskExplainability: 'AI Risk Attribution & Explainability',
    sensorFallback: 'Sensor Status',
    primaryOnline: 'Primary IoT Telemetry Online',
    fallbackActive: 'Sensor Fallback Active: Satellite Runoff (IMD/ISRO)',
    impactAssessment: 'Impact Assessment',
    searchWatershed: 'Search Village...',
    capGenerator: 'CAP Geo-Alert Generator',
    evacuationRoutes: 'Evacuation Routes',
    citizenReports: 'Citizen Reports',
    infrastructureLayer: 'Critical Infrastructure',
    iotLayer: 'IoT Sensors & Gauges',
    waterLevel: 'Water Level',
    rainfallRate: 'Rainfall Rate',
    soilMoisturePct: 'Soil Saturation',
    startEvacuation: 'Start Safe Route Evacuation',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    realTimeTactical: 'Real-time tactical intelligence and AI directives.',
    aiSynthesized: 'AI directives for disaster management.'
  },
  pa: {
    title: 'HEM SANCHAR',
    titleHindi: 'हेम संचार',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Pahari)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    dashboard: 'Situational Command',
    situationalCommand: 'Situational Command Center',
    map: 'Live GIS Map',
    telemetry: 'Telemetry Data',
    dataSources: 'Data Sources',
    emergency: 'Tactical Evacuation Directive',
    tacticalEvacuation: 'Tactical Evacuation Directive',
    helpline: 'MHA: 011-23438252 | NDRF: 1078',
    criticalSectors: 'Critical Sectors',
    populationAtRisk: 'Population At Risk',
    ndrfBattalions: 'Active Battalions',
    soilMoisture: 'Soil Moisture',
    peakSoilMoisture: 'Soil Saturation Rate',
    activeDangerZones: 'Active Danger Zones',
    reportIncident: 'Report Incident',
    citizenMode: 'Citizen Mode',
    officialMode: 'Official Command',
    forecastWindow: 'Forecast Horizon',
    riskExplainability: 'AI Risk Attribution & Explainability',
    sensorFallback: 'Sensor Status',
    primaryOnline: 'Primary IoT Telemetry Online',
    fallbackActive: 'Sensor Fallback Active: Satellite Runoff (IMD/ISRO)',
    impactAssessment: 'Impact Assessment',
    searchWatershed: 'Search Village...',
    capGenerator: 'CAP Geo-Alert Generator',
    evacuationRoutes: 'Evacuation Routes',
    citizenReports: 'Citizen Reports',
    infrastructureLayer: 'Critical Infrastructure',
    iotLayer: 'IoT Sensors & Gauges',
    waterLevel: 'Water Level',
    rainfallRate: 'Rainfall Rate',
    soilMoisturePct: 'Soil Saturation',
    startEvacuation: 'Start Safe Route Evacuation',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    realTimeTactical: 'Real-time tactical intelligence and AI directives.',
    aiSynthesized: 'AI directives for disaster management.'
  },
  gbm: {
    title: 'HEM SANCHAR',
    titleHindi: 'हेम संचार',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Garhwali)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    dashboard: 'Situational Command',
    situationalCommand: 'Situational Command Center',
    map: 'Live GIS Map',
    telemetry: 'Telemetry Data',
    dataSources: 'Data Sources',
    emergency: 'Tactical Evacuation Directive',
    tacticalEvacuation: 'Tactical Evacuation Directive',
    helpline: 'MHA: 011-23438252 | NDRF: 1078',
    criticalSectors: 'Critical Sectors',
    populationAtRisk: 'Population At Risk',
    ndrfBattalions: 'Active Battalions',
    soilMoisture: 'Soil Moisture',
    peakSoilMoisture: 'Soil Saturation Rate',
    activeDangerZones: 'Active Danger Zones',
    reportIncident: 'Report Incident',
    citizenMode: 'Citizen Mode',
    officialMode: 'Official Command',
    forecastWindow: 'Forecast Horizon',
    riskExplainability: 'AI Risk Attribution & Explainability',
    sensorFallback: 'Sensor Status',
    primaryOnline: 'Primary IoT Telemetry Online',
    fallbackActive: 'Sensor Fallback Active: Satellite Runoff (IMD/ISRO)',
    impactAssessment: 'Impact Assessment',
    searchWatershed: 'Search Village...',
    capGenerator: 'CAP Geo-Alert Generator',
    evacuationRoutes: 'Evacuation Routes',
    citizenReports: 'Citizen Reports',
    infrastructureLayer: 'Critical Infrastructure',
    iotLayer: 'IoT Sensors & Gauges',
    waterLevel: 'Water Level',
    rainfallRate: 'Rainfall Rate',
    soilMoisturePct: 'Soil Saturation',
    startEvacuation: 'Start Safe Route Evacuation',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    realTimeTactical: 'Real-time tactical intelligence and AI directives.',
    aiSynthesized: 'AI directives for disaster management.'
  },
  bn: {
    title: 'হেম সঞ্চার',
    titleHindi: 'हेम संचार',
    subtitle: 'দুর্যোগ ব্যবস্থাপনা বিভাগ | স্বরাষ্ট্র মন্ত্রণালয়',
    minister: 'শ্রী অমিত শাহ — মাননীয় কেন্দ্রীয় স্বরাষ্ট্রমন্ত্রী',
    emblem: 'সত্যমেব জয়তে',
    dashboard: 'পরিস্থিতিগত কমান্ড',
    situationalCommand: 'পরিস্থিতিগত কমান্ড সেন্টার',
    map: 'লাইভ জিআইএস মানচিত্র',
    telemetry: 'টেলিমেট্রি ডেটা',
    dataSources: 'ডেটা উৎস',
    emergency: 'কৌশলগত উচ্ছেদ নির্দেশিকা',
    tacticalEvacuation: 'কৌশলগত উচ্ছেদ নির্দেশিকা',
    helpline: 'এমএইচএ: 011-23438252 | এনডিআরএফ: 1078 | এসইओसी: 1070',
    criticalSectors: 'গুরুত্বপূর্ণ খাত',
    populationAtRisk: 'ঝুঁকিপূর্ণ জনসংখ্যা',
    ndrfBattalions: 'সক্রিয় ব্যাটালিয়ন',
    soilMoisture: 'মাটির আর্দ্রতা',
    peakSoilMoisture: 'মাটির সম্পৃক্ততার হার',
    activeDangerZones: 'সক্রিয় বিপদ অঞ্চল',
    reportIncident: 'ঘটনা রিপোর্ট করুন',
    citizenMode: 'নাগরিক মোড',
    officialMode: 'অফিসিয়াল কমান্ড',
    forecastWindow: 'পূর্বাভাস সময়সীমা',
    riskExplainability: 'এআই ঝুঁকি ব্যাখ্যা',
    sensorFallback: 'সেন্সর স্থিতি',
    primaryOnline: 'প্রাথমিক আইওটি অনলাইন',
    fallbackActive: 'সেন্সর ফলব্যাক সক্রিয়: স্যাটেলাইট রানঅফ (IMD/ISRO)',
    impactAssessment: 'প্রভাব মূল্যায়ন',
    searchWatershed: 'মাইক্রো-ওয়াটারশেড / গ্রাম খুঁজুন...',
    capGenerator: 'সিএপি ভূ-সতর্কতা জেনারেটর',
    evacuationRoutes: 'উচ্ছেদ রুট',
    citizenReports: 'নাগরিক রিপোর্ট',
    infrastructureLayer: 'গুরুত্বপূর্ণ পরিকাঠামো',
    iotLayer: 'আইওটি সেন্সর এবং গেজ',
    waterLevel: 'পানির স্তর',
    rainfallRate: 'বৃষ্টিপাতের হার',
    soilMoisturePct: 'মাটির আর্দ্রতা',
    startEvacuation: 'নিরাপদ রুট উচ্ছেদ শুরু করুন',
    footer: 'টিম পাওয়ার পাফ গার্লস দ্বারা ❤️ এর সাথে তৈরি | স্মার্ট ইন্ডিয়া হ্যাকাথন 2026',
    language: 'ভাষা',
    navHome: 'হোম ড্যাশবোর্ড',
    navGis: 'লাইভ জিআইএস ম্যাপ',
    navTelemetry: 'টেলিমেট্রি ডেটা',
    navDataSources: 'ডেটা উৎস',
    navDirectives: 'জরুরী নির্দেশাবলী',
    realTimeTactical: 'রিয়েল-টাইম কৌশলগত তথ্য এবং এআই নির্দেশিকা।',
    aiSynthesized: 'দুর্যোগ ব্যবস্থাপনা এলাকার জন্য এআই নির্দেশিকা।'
  }
};

interface StateContextType {
  selectedState: ActiveState;
  setSelectedState: (state: ActiveState) => void;
  activeState: ActiveState;
  setActiveState: (state: ActiveState) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (value: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  forecastTime: ForecastWindow;
  setForecastTime: (time: ForecastWindow) => void;
  t: Record<string, string>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState<ActiveState>('Himachal Pradesh');
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [mode, setMode] = useState<UserMode>('official');
  const [forecastTime, setForecastTime] = useState<ForecastWindow>('0-3h');

  useEffect(() => {
    const savedState = localStorage.getItem('ndrf_selected_state');
    if (
      savedState === 'Himachal Pradesh' ||
      savedState === 'Uttarakhand' ||
      savedState === 'Ladakh' ||
      savedState === 'Jammu & Kashmir'
    ) {
      setSelectedState(savedState as ActiveState);
    }
    const savedLowBandwidth = localStorage.getItem('ndrf_low_bandwidth');
    if (savedLowBandwidth === 'true') {
      setLowBandwidth(true);
    }
    const savedLang = localStorage.getItem('ndrf_language');
    if (savedLang && GLOBAL_DICTIONARY[savedLang]) {
      setLanguage(savedLang);
    }
    const savedMode = localStorage.getItem('ndrf_user_mode');
    if (savedMode === 'citizen' || savedMode === 'official') {
      setMode(savedMode as UserMode);
    }
  }, []);

  const handleSetSelectedState = (state: ActiveState) => {
    setSelectedState(state);
    localStorage.setItem('ndrf_selected_state', state);
  };

  const handleSetLowBandwidth = (val: boolean) => {
    setLowBandwidth(val);
    localStorage.setItem('ndrf_low_bandwidth', String(val));
  };

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('ndrf_language', lang);
  };

  const handleSetMode = (m: UserMode) => {
    setMode(m);
    localStorage.setItem('ndrf_user_mode', m);
  };

  const currentDict = GLOBAL_DICTIONARY[language] || GLOBAL_DICTIONARY['en'];

  return (
    <StateContext.Provider
      value={{
        selectedState,
        setSelectedState: handleSetSelectedState,
        activeState: selectedState,
        setActiveState: handleSetSelectedState,
        lowBandwidth,
        setLowBandwidth: handleSetLowBandwidth,
        language,
        setLanguage: handleSetLanguage,
        mode,
        setMode: handleSetMode,
        forecastTime,
        setForecastTime,
        t: currentDict,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
}

export const useActiveState = useAppState;
