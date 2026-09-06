'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/context/StateContext';

import MhaHeader from './MhaHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useAppState();
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);


  // ... [Keep existing handleReportSubmit logic]


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <MhaHeader />

      {/* Navigation Bar */}
      <nav className="bg-[#005a9c] text-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-wrap text-sm md:text-base font-semibold">
            <li>
              <Link href="/" className="block py-3 px-4 hover:bg-blue-800 transition-colors">
                {t.navHome || 'Home Dashboard'}
              </Link>
            </li>
            <li>
              <Link href="/map" className="block py-3 px-4 hover:bg-blue-800 transition-colors">
                {t.navGis || 'Live GIS Map'}
              </Link>
            </li>
            <li>
              <Link href="/telemetry" className="block py-3 px-4 hover:bg-blue-800 transition-colors">
                {t.navTelemetry || 'Telemetry Data'}
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="block py-3 px-4 hover:bg-blue-800 transition-colors text-left"
              >
                {t.navDataSources || 'Data Sources'}
              </button>
            </li>

          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-6 text-center text-sm border-t-4 border-slate-950">
        <p className="font-medium opacity-90">{t.footer || 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026'}</p>
      </footer>


      {/* Data Sources Modal */}
      {isDataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{t.navDataSources || 'Data Sources'}</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              HEM SANCHAR integrates live hydrological telemetry feeds from Central Water Commission (CWC), IMD Doppler Radar, ISRO Bhuvan runoff models, and Supabase real-time sensor tables.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDataModalOpen(false)}
                className="px-4 py-2 bg-[#005a9c] text-white rounded-lg text-xs font-bold hover:bg-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
