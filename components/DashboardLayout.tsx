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
            <div className="space-y-4 text-left py-2">
              <p className="text-sm text-slate-600 font-medium">
                HEM SANCHAR integrates real-time telemetry and hydrological feeds from official government and open-data APIs:
              </p>

              <ul className="space-y-3 text-sm">
                <li className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">Central Water Commission (CWC)</p>
                    <p className="text-xs text-slate-500">Flood Forecasting &amp; Hydro-Gauge Network</p>
                  </div>
                  <a href="https://ffs.rcmcwc.org" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    ffs.rcmcwc.org ↗
                  </a>
                </li>

                <li className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">India Meteorological Department (IMD)</p>
                    <p className="text-xs text-slate-500">AWS Rainfall &amp; Doppler Weather Radar</p>
                  </div>
                  <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    mausam.imd.gov.in ↗
                  </a>
                </li>

                <li className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">ISRO Bhuvan Portal</p>
                    <p className="text-xs text-slate-500">Satellite Runoff Models &amp; Terrain Elevation</p>
                  </div>
                  <a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    bhuvan.nrsc.gov.in ↗
                  </a>
                </li>

                <li className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">Open-Meteo Global Flood API</p>
                    <p className="text-xs text-slate-500">River Discharge Forecast Telemetry</p>
                  </div>
                  <a href="https://open-meteo.com/en/docs/flood-api" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    open-meteo.com ↗
                  </a>
                </li>
              </ul>
            </div>
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
