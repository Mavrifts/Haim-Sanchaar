'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppState } from '@/context/StateContext';

const TELEMETRY_DATA = [
  // Himachal Pradesh
  { id: 'HP-01', name: 'Beas River Main', district: 'Kullu', state: 'Himachal Pradesh', water_level: '2100 mm', rainfall: '48.5 mm/h', saturation: '94.0%', status: 'CRITICAL' },
  { id: 'HP-02', name: 'Pandoh Hydro Power Substation', district: 'Mandi', state: 'Himachal Pradesh', water_level: '1420 mm', rainfall: '32.1 mm/h', saturation: '81.2%', status: 'WARNING' },
  { id: 'HP-03', name: 'Shimla SEOC Command Base', district: 'Shimla', state: 'Himachal Pradesh', water_level: '450 mm', rainfall: '12.0 mm/h', saturation: '45.0%', status: 'NORMAL' },
  
  // Uttarakhand
  { id: 'UK-01', name: 'Alaknanda Confluence Gauge', district: 'Chamoli', state: 'Uttarakhand', water_level: '1890 mm', rainfall: '52.0 mm/h', saturation: '91.5%', status: 'CRITICAL' },
  { id: 'UK-02', name: 'Bhagirathi Sector 4', district: 'Uttarkashi', state: 'Uttarakhand', water_level: '1200 mm', rainfall: '28.4 mm/h', saturation: '76.8%', status: 'WARNING' },

  // Jammu & Kashmir
  { id: 'JK-01', name: 'Srinagar Jhelum Banks', district: 'Srinagar', state: 'Jammu & Kashmir', water_level: '2250 mm', rainfall: '60.1 mm/h', saturation: '96.2%', status: 'CRITICAL' },
  { id: 'JK-02', name: 'Jammu Tawi Front', district: 'Jammu', state: 'Jammu & Kashmir', water_level: '850 mm', rainfall: '14.2 mm/h', saturation: '50.1%', status: 'NORMAL' },

  // Ladakh
  { id: 'LA-01', name: 'Indus River Leh Basin', district: 'Leh', state: 'Ladakh', water_level: '1100 mm', rainfall: '22.0 mm/h', saturation: '68.4%', status: 'WARNING' },
  { id: 'LA-02', name: 'Suru River Hydro Desk', district: 'Kargil', state: 'Ladakh', water_level: '620 mm', rainfall: '8.5 mm/h', saturation: '38.0%', status: 'NORMAL' }
];

export default function TelemetryPage() {
  const { activeState } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');

  const currentState = (activeState as string) || 'Himachal Pradesh';

  const filtered = TELEMETRY_DATA.filter((item) => {
    const matchesState =
      !currentState ||
      currentState === 'ALL' ||
      item.state.toLowerCase().includes(currentState.toLowerCase()) ||
      currentState.toLowerCase().includes(item.state.toLowerCase());

    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesState && matchesSearch;
  });

  const displayRows = filtered.length > 0 ? filtered : TELEMETRY_DATA;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Live Hydrological Telemetry</h1>
            <p className="text-xs text-slate-500">Real-time sensor feeds across mountain basins.</p>
          </div>
          <input
            type="text"
            placeholder="Filter by name, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="font-semibold text-sm text-slate-800">Sensor Telemetry & Soil Hydration Matrix</span>
            <span className="text-xs font-mono text-slate-500">Region: {currentState}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Station / Sector</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Water Level</th>
                  <th className="px-4 py-3">Rainfall Rate</th>
                  <th className="px-4 py-3">Soil Saturation</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.district}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{row.state}</td>
                    <td className="px-4 py-3 font-mono text-slate-800">{row.water_level}</td>
                    <td className="px-4 py-3 font-mono text-slate-800">{row.rainfall}</td>
                    <td className="px-4 py-3 font-mono text-slate-800">{row.saturation}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                          row.status === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700'
                            : row.status === 'WARNING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}