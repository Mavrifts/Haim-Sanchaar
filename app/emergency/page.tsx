'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppState } from '@/context/StateContext';

export default function EmergencyPage() {
  const { t } = useAppState();

  const HELPLINES = [
    { agency: 'NDRF HQ', number: '1078', alt: '011-24363260' },
    { agency: 'MHA Control Room', number: '011-23438252', alt: '011-23438253' },
    { agency: 'SEOC Line', number: '1070', alt: 'Regional' },
    { agency: 'IMD Alert Line', number: '1800-180-1717', alt: 'Toll Free' },
    { agency: 'CWC Flood Cell', number: '011-26106523', alt: 'Flood Monitoring' },
    { agency: 'Indian Coast Guard', number: '1554', alt: 'Maritime/Coastal' },
    { agency: 'Armed Forces Disaster Cell', number: '011-23013822', alt: 'Military Coordination' },
    { agency: 'Medical Evacuation', number: '108', alt: 'Emergency Response' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">{t.emergencyDirectives || 'Emergency Helpline Directory'}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HELPLINES.map((h, i) => (
            <div key={i} className="bg-white p-4 border border-slate-300 rounded shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 text-sm">{h.agency}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-mono font-black text-rose-700">{h.number}</p>
                <p className="text-[10px] text-slate-400">{h.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

