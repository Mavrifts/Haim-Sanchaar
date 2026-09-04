'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ActiveState = 'Himachal Pradesh' | 'Uttarakhand' | 'Ladakh' | 'Jammu & Kashmir';

export const GLOBAL_DICTIONARY: Record<string, Record<string, string>> = {
  en: { title: 'HEM SANCHAR', subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS', dashboard: 'Situational Command', map: 'Live GIS Map', telemetry: 'Telemetry Data', dataSources: 'Data Sources', emergency: 'Tactical Evacuation Directive', helpline: 'MHA: 011-23438252 | NDRF: 1078 | SEOC: 1070', criticalSectors: 'Critical Sectors', populationAtRisk: 'Population At Risk', soilMoisture: 'Soil Moisture' },
  hi: { title: 'हेम संचार', subtitle: 'आपदा प्रबंधन प्रभाग | गृह मंत्रालय | भारत सरकार', dashboard: 'स्थितिजन्य कमान', map: 'लाइव जीआईएस मानचित्र', telemetry: 'टेलीमेट्री डेटा', dataSources: 'डेटा स्रोत', emergency: 'सामरिक निकासी निर्देश', helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078 | एसईओसी: 1070', criticalSectors: 'महत्वपूर्ण क्षेत्र', populationAtRisk: 'जोखिम में जनसंख्या', soilMoisture: 'मृदा नमी' },
  doi: { title: 'हेम संचार', subtitle: 'आपदा प्रबंधन विभाग | गृह मंत्रालय', dashboard: 'स्थितिजन्य कमान', map: 'लाइव जीआईएस नक्शा', telemetry: 'टेलीमेट्री डेटा', dataSources: 'डेटा सोर्स', emergency: 'सामरिक निकासी निर्देश', helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078', criticalSectors: 'महत्वपूर्ण क्षेत्र', populationAtRisk: 'जोखिम विच जनसंख्या', soilMoisture: 'मृदा नमी' },
  ks: { title: 'हेम संचार', subtitle: 'आपदा प्रबंधन डिवीजन | गृह मंत्रालय', dashboard: 'अहम कमान', map: 'लाइव नक्शा', telemetry: 'टेलीमेट्री', dataSources: 'डेटा जरिया', emergency: 'सामरिक इख़राज हिदायत', helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078', criticalSectors: 'अहम शोब', populationAtRisk: 'खतरे में आबादी', soilMoisture: 'मिट्टी की नमी' },
  lb: { title: 'हेम संचार', subtitle: 'आपदा प्रबंधन विभाग | गृह मंत्रालय', dashboard: 'स्थितिजन्य कमान', map: 'जीआईएस नक्शा', telemetry: 'टेलीमेट्री', dataSources: 'डेटा', emergency: 'सामरिक निकासी निर्देश', helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078', criticalSectors: 'महत्वपूर्ण क्षेत्र', populationAtRisk: 'जोखिम में आबादी', soilMoisture: 'मिट्टी की नमी' },
  pa: { title: 'हेम संचार', subtitle: 'आपदा प्रबंधन प्रभाग | गृह मंत्रालय', dashboard: 'स्थितिजन्य कमान', map: 'लाइव जीआईएस नक्शा', telemetry: 'टेलीमेट्री डेटा', dataSources: 'डेटा स्रोत', emergency: 'सामरिक निकासी हिदायतां', helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078', criticalSectors: 'महत्वपूर्ण क्षेत्र', populationAtRisk: 'जोखिम विच आबादी', soilMoisture: 'मिट्टी दी नमी' },
  gbm: { title: 'हेम संचार', subtitle: 'आपदा प्रबंधन विभाग | गृह मंत्रालय', dashboard: 'स्थितिजन्य कमान', map: 'जीआईएस नक्शा', telemetry: 'टेलीमेट्री डेटा', dataSources: 'डेटा स्रोत', emergency: 'सामरिक निकासी निर्देश', helpline: 'एमएचए: 011-23438252 | एनडीआरएफ: 1078', criticalSectors: 'महत्वपूर्ण क्षेत्र', populationAtRisk: 'जोखिम में आबादी', soilMoisture: 'मृदा नमी' },
  bn: { title: 'হেম সঞ্চার', subtitle: 'দুর্যোগ ব্যবস্থাপনা বিভাগ | স্বরাষ্ট্র মন্ত্রণালয়', dashboard: 'পরিস্থিতিগত কমান্ড', map: 'লাইভ জিআইএস মানচিত্র', telemetry: 'টেলিমেট্রি ডেটা', dataSources: 'ডেটা উৎস', emergency: 'কৌশলগত উচ্ছেদ নির্দেশিকা', helpline: 'এমএইচএ: 011-23438252 | এনডিআরএফ: 1078', criticalSectors: 'গুরুত্বপূর্ণ খাত', populationAtRisk: 'ঝুঁকিপূর্ণ জনসংখ্যা', soilMoisture: 'মাটির আর্দ্রতা' },
};

interface StateContextType {
  selectedState: ActiveState;
  setSelectedState: (state: ActiveState) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (value: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  t: Record<string, string>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function StateProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedState] = useState<ActiveState>('Himachal Pradesh');
  const [lowBandwidth, setLowBandwidth] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');

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

  return (
    <StateContext.Provider
      value={{
        selectedState,
        setSelectedState: handleSetSelectedState,
        lowBandwidth,
        setLowBandwidth: handleSetLowBandwidth,
        language,
        setLanguage: handleSetLanguage,
        t: GLOBAL_DICTIONARY[language] || GLOBAL_DICTIONARY['en'],
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

