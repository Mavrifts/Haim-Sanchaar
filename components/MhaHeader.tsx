'use client';

import React from 'react';
import { useAppState } from '@/context/StateContext';

export default function MhaHeader() {
  const { language, setLanguage, t } = useAppState();

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
          <div className="flex flex-col items-center justify-center shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="National Emblem of India"
              className="w-10 h-12 object-contain"
            />
            <span className="text-[8px] font-bold text-amber-700 mt-0.5">{t.emblem || 'सत्यमेव जयते'}</span>
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase font-bold text-slate-500">
              {t.subtitle || 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS'}
            </p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {t.title || 'HEM SANCHAR'} <span className="text-sm font-normal text-slate-600">({t.titleHindi || 'हेम संचार'})</span>
            </h1>
          </div>
        </div>

        {/* Right: Language Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="language-select-header" className="text-xs font-semibold text-slate-700">
              {t.language || 'Language'}:
            </label>
            <select
              id="language-select-header"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
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
      </div>
    </header>
  );
}

