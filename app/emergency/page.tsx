'use client';

import React from 'react';
import { useAppState } from '@/context/StateContext';
import { PhoneCall, ShieldAlert, Radio, Building2, MapPin, ExternalLink } from 'lucide-react';

export default function EmergencyPage() {
  const { selectedState, t } = useAppState();

  const HELPLINES = [
    {
      agency: 'National Disaster Response Force (NDRF)',
      number: '1078',
      alt: '011-24363260',
      url: 'https://ndrf.gov.in',
      description: 'Toll-free 24x7 National Flood & Disaster Response Dispatch',
      badge: 'National HQ',
    },
    {
      agency: 'Ministry of Home Affairs Control Room (MHA)',
      number: '011-23438252',
      alt: '011-23438253',
      url: 'https://mha.gov.in',
      description: 'National Central Emergency Coordination & Control Desk (New Delhi)',
      badge: 'MHA Control',
    },
    {
      agency: 'State Emergency Operation Center (SEOC)',
      number: '1070',
      alt: 'Regional Helpline',
      url: 'https://ndma.gov.in',
      description: 'State Level Incident Command & Evacuation Control Center',
      badge: 'State SEOC',
    },
    {
      agency: 'India Meteorological Department (IMD Alert Line)',
      number: '1800-180-1717',
      alt: 'Toll Free',
      url: 'https://mausam.imd.gov.in',
      description: 'Official Weather, Rain & Cloudburst Early Warning Information',
      badge: 'IMD Alert',
    },
  ];

  const STATE_HELPLINES: Record<string, Array<{ name: string; number: string; loc: string }>> = {
    'Himachal Pradesh': [
      { name: 'HP SEOC Shimla', number: '0177-2812344', loc: 'Shimla' },
      { name: 'Kullu District Control Room', number: '01902-224300', loc: 'Kullu' },
      { name: 'Mandi Emergency Cell', number: '01905-226201', loc: 'Mandi' },
      { name: 'Kangra Disaster Desk', number: '01892-229060', loc: 'Dharamshala' },
    ],
    'Uttarakhand': [
      { name: 'Uttarakhand SEOC Dehradun', number: '0135-2710334', loc: 'Dehradun' },
      { name: 'Chamoli Incident Command', number: '01372-251077', loc: 'Gopeshwar' },
      { name: 'Rudraprayag Control Room', number: '01364-233727', loc: 'Rudraprayag' },
    ],
    'Assam': [
      { name: 'Assam State Disaster Management (ASDMA)', number: '1079 / 0361-2237011', loc: 'Guwahati' },
      { name: 'Jorhat / Majuli Control Room', number: '0376-2320020', loc: 'Jorhat' },
    ],
    'Jammu & Kashmir': [
      { name: 'JK SDMA Srinagar HQ', number: '0194-2472499', loc: 'Srinagar' },
      { name: 'Jammu Divisional Control Room', number: '0191-2478996', loc: 'Jammu' },
    ],
    'Ladakh': [
      { name: 'Leh Disaster Emergency Operations', number: '01982-252010', loc: 'Leh' },
      { name: 'Kargil District Disaster Cell', number: '01985-232216', loc: 'Kargil' },
    ],
    'Kerala': [
      { name: 'Kerala KSDMA Control Room', number: '1077 / 0471-2331645', loc: 'Thiruvananthapuram' },
      { name: 'Wayanad Emergency Operations', number: '04936-204151', loc: 'Kalpetta' },
    ],
    'Bihar': [
      { name: 'Bihar BSDMA Control Room', number: '0612-2547041', loc: 'Patna' },
    ],
    'Odisha': [
      { name: 'Odisha OSDMA Control Desk', number: '0674-2534177', loc: 'Bhubaneswar' },
    ],
  };

  const stateContacts = STATE_HELPLINES[selectedState] || STATE_HELPLINES['Himachal Pradesh'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-7 h-7 text-emerald-600" /> {t.emergencyDirectives || 'Emergency Helpline Directory'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified 24x7 helpline numbers for MHA, NDRF, IMD, SEOC, and Regional Disaster Command posts.
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800 shadow-2xs self-start md:self-auto flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Active Command Link: {selectedState}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HELPLINES.map((h, i) => (
          <div key={i} className="bg-white p-5 border border-slate-300 rounded-xl shadow-xs flex justify-between items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 inline-block">
                {h.badge}
              </span>
              <p className="font-bold text-slate-900 text-sm">{h.agency}</p>
              <p className="text-xs text-slate-500">{h.description}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                <span>Official Web:</span>
                <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium flex items-center gap-0.5">
                  {h.url} <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
            <div className="text-right shrink-0">
              <a href={`tel:${h.number.replace(/[^0-9]/g, '')}`} className="text-xl font-mono font-black text-rose-700 block hover:underline">
                {h.number}
              </a>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{h.alt}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Regional & District Disaster Operations: {selectedState}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct landlines for district incident commanders and field battalion posts in {selectedState}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stateContacts.map((sc, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" /> {sc.loc}
              </span>
              <h4 className="text-xs font-bold text-slate-900">{sc.name}</h4>
              <a
                href={`tel:${sc.number}`}
                className="font-mono text-sm font-bold text-emerald-700 block hover:underline"
              >
                📞 {sc.number}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
