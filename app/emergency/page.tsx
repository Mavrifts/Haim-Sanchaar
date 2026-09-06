'use client';

import React from 'react';
import { useAppState } from '@/context/StateContext';

export default function EmergencyPage() {
  const { t } = useAppState();

  const HELPLINES = [
    { agency: 'National Disaster Response Force (NDRF)', number: '1078', alt: '011-24363260', url: 'https://ndrf.gov.in' },
    { agency: 'Ministry of Home Affairs Control Room (MHA)', number: '011-23438252', alt: '011-23438253', url: 'https://mha.gov.in' },
    { agency: 'State Emergency Operation Center (SEOC)', number: '1070', alt: 'Regional Helpline', url: 'https://ndma.gov.in' },
    { agency: 'India Meteorological Department (IMD Alert Line)', number: '1800-180-1717', alt: 'Toll Free', url: 'https://mausam.imd.gov.in' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t?.emergencyDirectives || 'Emergency Helpline Directory'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HELPLINES.map((h, i) => (
          <div key={i} className="bg-white p-4 border border-slate-300 rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800 text-sm">{h.agency}</p>
              <p className="text-xs text-slate-500">Official Web: <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{h.url}</a></p>
            </div>
            <div className="text-right">
              <p className="text-base font-mono font-black text-rose-700">{h.number}</p>
              <p className="text-[10px] text-slate-400">{h.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

