import React, { useState } from 'react';

export default function MhaHeader() {
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'doi', label: 'डोगरी (Dogri)' },
    { code: 'ks', label: 'कश्मीरी (Kashmiri)' },
    { code: 'lb', label: 'लाद्दाखी (Ladakhi)' },
    { code: 'pa', label: 'पहाड़ी (Pahari)' },
    { code: 'gbm', label: 'गढ़वाली (Garhwali)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
  ];

  return (
    <header className="bg-white border-b border-slate-300 text-slate-800">
      {/* Top Gold Accent Line */}
      <div className="h-1 bg-amber-500 w-full" />

      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: National Emblem & Primary Branding */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-12 border border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-600 text-center leading-tight p-1">
            सत्यमेव जयते
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase font-bold text-slate-500">
              DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS
            </p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              HEM SANCHAR <span className="text-sm font-normal text-slate-600">(हेम संचार)</span>
            </h1>
          </div>
        </div>

        {/* Right: Leadership Visual & Language Selection */}
        <div className="flex items-center gap-4">
          {/* Minister Profile Card */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded text-xs">
            <img
              src="https://www.mha.gov.in/sites/default/files/styles/small_50x50/public/2023-08/AmitShah_Official.jpg"
              alt="Shri Amit Shah"
              className="w-10 h-12 object-cover rounded border border-slate-300"
              onError={(e) => {
                // Fallback text frame if direct image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 leading-tight">Shri Amit Shah</p>
              <p className="text-[10px] text-slate-600">Hon'ble Union Home Minister</p>
            </div>
          </div>

          {/* Regional Language Select */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
