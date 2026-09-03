'use client';

import React from 'react';
import { useActiveState } from '@/context/StateContext';

export default function SectorSelector() {
  const { selectedState, setSelectedState } = useActiveState();
  const sectors = ['Himachal Pradesh', 'Uttarakhand', 'Ladakh', 'Jammu & Kashmir'];

  return (
    <div className="flex gap-2 p-1 bg-white border border-slate-300 rounded-lg w-fit shadow-sm">
      {sectors.map((sector) => (
        <button
          key={sector}
          onClick={() => setSelectedState(sector as any)}
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
            selectedState === sector
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {sector}
        </button>
      ))}
    </div>
  );
}