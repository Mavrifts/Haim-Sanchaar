'use client';

import React from 'react';
import { useAppState } from '@/context/StateContext';
import { PhoneCall, ShieldAlert, Radio, Building2, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export default function EmergencyPage() {
  const { selectedState, t } = useAppState();

  const HELPLINES = [
    {
      agency: 'Ministry of Home Affairs (MHA) Control Room',
      number: '011-23438252',
      description: 'National Central Emergency Coordination & Control Desk (New Delhi)',
      badge: 'National HQ',
      priority: true,
    },
    {
      agency: 'National Disaster Response Force (NDRF)',
      number: '1078',
      description: 'Toll-free 24x7 National Flood & Disaster Response Dispatch',
      badge: 'Toll Free / 24x7',
      priority: true,
    },
    {
      agency: 'State Emergency Operations Center (SEOC)',
      number: '1070',
      description: 'State Level Incident Command & Evacuation Control Center',
      badge: 'State SEOC',
      priority: true,
    },
    {
      agency: 'India Meteorological Department (IMD)',
      number: '1800-180-1717',
      description: 'Official Weather & Cloudburst Early Warning Information',
      badge: 'Met Warning',
      priority: true,
    },
    {
      agency: 'Indian Coast Guard / Maritime Emergency',
      number: '1554',
      description: 'Coastal and Estuary Flood Evacuation Unit',
      badge: 'Coastal Search',
      priority: false,
    },
    {
      agency: 'National Emergency Unified Support',
      number: '112',
      description: 'Single Emergency Response Support System (ERSS)',
      badge: 'Police & Ambulance',
      priority: false,
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
      { name: 'Uttarkashi Disaster Desk', number: '01374-222744', loc: 'Uttarkashi' },
    ],
    'Assam': [
      { name: 'Assam State Disaster Management (ASDMA)', number: '1079 / 0361-2237011', loc: 'Guwahati' },
      { name: 'Jorhat / Majuli Control Room', number: '0376-2320020', loc: 'Jorhat' },
      { name: 'Cachar Flood Control', number: '03842-245866', loc: 'Silchar' },
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
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-7 h-7 text-emerald-600" /> Official Emergency Contacts Directory
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

      {/* Primary National Helplines Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#005a9c]" /> Key National Helplines (24x7 Open Lines)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HELPLINES.map((h, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border ${
                h.priority ? 'bg-white border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200'
              } space-y-3 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    {h.badge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{h.agency}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{h.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${h.number.replace(/[^0-9]/g, '')}`}
                  className="font-mono text-base font-extrabold text-[#005a9c] hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>{h.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regional State EOC Helplines */}
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
