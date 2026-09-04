'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/context/StateContext';
import { triggerContinuousSiren, stopContinuousSiren } from '@/utils/sound';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useAppState();
  const [showDataModal, setShowDataModal] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const toggleEmergency = () => {
    if (emergencyActive) {
      stopContinuousSiren();
    } else {
      triggerContinuousSiren();
    }
    setEmergencyActive(!emergencyActive);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#005a9c] text-white p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem of India" className="w-12 h-12" />
          <div>
            <h1 className="text-xl font-bold">{t.title}</h1>
            <p className="text-xs text-blue-100">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-blue-800 text-white text-sm p-1 rounded"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="doi">Dogri</option>
            <option value="ks">Kashmiri</option>
            <option value="lb">Ladakhi</option>
            <option value="pa">Pahari</option>
            <option value="gbm">Garhwali</option>
            <option value="bn">Bengali</option>
          </select>
          <div className="flex items-center gap-2 border-l border-blue-700 pl-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/07/Amit_Shah_in_2024.jpg" alt="Amit Shah" className="w-10 h-10 rounded-full" />
            <div className="text-[10px]">
              <p className="font-bold">Shri Amit Shah</p>
              <p>Hon'ble Union Minister of Home Affairs</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-[#00487c] text-white p-3 flex items-center justify-between shadow-md text-sm">
        <div className="flex items-center gap-6">
          <Link className="hover:text-amber-300 transition-colors" href="/">{t.dashboard}</Link>
          <Link className="hover:text-amber-300 transition-colors" href="/map">{t.map}</Link>
          <button onClick={() => setShowDataModal(true)} className="hover:text-amber-300 transition-colors cursor-pointer">{t.dataSources}</button>
          <Link className="hover:text-amber-300 transition-colors" href="/alerts">{t.emergency}</Link>
          <button
            onClick={toggleEmergency}
            className={`transition-colors ${emergencyActive ? 'text-amber-300 font-bold' : 'hover:text-amber-300'}`}
          >
            Siren
          </button>
        </div>
        <div className="hidden sm:block text-[11px] text-amber-200 font-mono">{t.helpline}</div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">{children}</main>

      {showDataModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDataModal(false)}>
          <div className="bg-white border border-slate-300 rounded-lg max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Official Government Data Feeds</h2>
            <button onClick={() => setShowDataModal(false)} className="mt-6 w-full bg-[#005a9c] text-white py-2 rounded text-xs font-bold hover:bg-[#00487c]">Close Panel</button>
          </div>
        </div>
      )}
    </div>
  );
}

