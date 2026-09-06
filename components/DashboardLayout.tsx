'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppState, UserMode } from '@/context/StateContext';
import { AlertTriangle, Shield, CheckCircle, X, Users, MapPin, Radio, Send } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage, mode, setMode, t } = useAppState();
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Form state for incident report
  const [incidentType, setIncidentType] = useState('Flood Water Surge');
  const [locationName, setLocationName] = useState('');
  const [severity, setSeverity] = useState('High');
  const [details, setDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) return;

    // Store report in localStorage for offline persistence / Map layer rendering
    const existing = JSON.parse(localStorage.getItem('ndrf_citizen_reports') || '[]');
    const newReport = {
      id: Date.now(),
      type: incidentType,
      location: locationName,
      severity,
      details,
      timestamp: new Date().toLocaleTimeString(),
    };
    localStorage.setItem('ndrf_citizen_reports', JSON.stringify([newReport, ...existing]));

    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setIsReportModalOpen(false);
      setLocationName('');
      setDetails('');
    }, 1800);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans ${mode === 'citizen' ? 'text-lg' : ''}`}>
      {/* Top Header - Language Selector & Mode Switcher */}
      <div className="bg-slate-200 py-1.5 px-4 flex flex-wrap justify-between items-center text-xs md:text-sm border-b border-slate-300 gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.reportIncident || 'Report Incident'}</span>
          </button>

          <span className="hidden sm:inline-block text-slate-400">|</span>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-300/80 p-0.5 rounded-full">
            <button
              onClick={() => setMode('citizen')}
              className={`px-3 py-0.5 rounded-full font-semibold transition ${
                mode === 'citizen'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {t.citizenMode || 'Citizen Mode'}
            </button>
            <button
              onClick={() => setMode('official')}
              className={`px-3 py-0.5 rounded-full font-semibold transition ${
                mode === 'official'
                  ? 'bg-[#005a9c] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {t.officialMode || 'Official Command'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="font-semibold text-slate-700">
            {t.language || 'Language'}:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-1 border border-slate-400 rounded bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm font-medium"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="doi">डोगरी (Dogri)</option>
            <option value="ks">کأشُر (Kashmiri)</option>
            <option value="lb">ལ་དྭགས་ (Ladakhi)</option>
            <option value="pa">पहाड़ी (Pahari)</option>
            <option value="gbm">गढ़वाली (Garhwali)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>
      </div>

      {/* MHA Header */}
      <header className="bg-white py-4 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between border-b-4 border-[#005a9c] shadow-xs gap-4">
        <div className="flex items-center gap-4">
          {/* National Emblem SVG */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="National Emblem of India"
              className="w-12 h-14 object-contain"
            />
            <span className="text-[10px] font-bold text-amber-700 mt-0.5">{t.emblem || 'सत्यमेव जयते'}</span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#005a9c] tracking-tight flex items-center gap-2">
              {t.title || 'HEM SANCHAR'}
            </h1>
            <h2 className="text-xs md:text-sm font-semibold text-slate-600 tracking-wider">
              {t.subtitle || 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS'}
            </h2>
          </div>
        </div>

        {/* Minister Card with Portrait */}
        <div className="flex items-center gap-3 bg-blue-50 border-l-4 border-[#005a9c] p-2 rounded shadow-xs shrink-0">
          <img
            src="https://www.mha.gov.in/sites/default/files/styles/small_50x50/public/2023-08/AmitShah_Official.jpg"
            alt="Shri Amit Shah"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
            onError={(e) => {
              // Graceful fallback to Wikipedia portrait if official portal blocks CORS
              (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/0/07/Amit_Shah_in_2024.jpg';
            }}
          />
          <div className="text-left">
            <p className="text-xs md:text-sm font-bold text-blue-950">
              {t.minister || "Shri Amit Shah — Hon'ble Union Minister of Home Affairs"}
            </p>
            <p className="text-[10px] text-blue-800 font-medium">{t.helpline || 'MHA Helpline: 011-23438252'}</p>
          </div>
        </div>
      </header>

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
              <Link href="/emergency" className="block py-3 px-4 hover:bg-blue-800 transition-colors">
                Emergency Directory
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
            <li>
              <Link href="/directives" className="block py-3 px-4 hover:bg-blue-800 transition-colors">
                {t.navDirectives || 'Emergency Directives'}
              </Link>
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

      {/* Two-Way Citizen Incident Reporting Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                {t.reportIncident || 'Report Incident / Hazard'}
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-base">Incident Report Transmitted!</h4>
                <p className="text-xs text-emerald-700">Logged to local field dispatch and GIS map overlays.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Incident Type
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-slate-900"
                  >
                    <option value="Flood Water Surge">Flood Water Surge</option>
                    <option value="Blocked Road / Landslide">Blocked Road / Landslide</option>
                    <option value="Stranded Citizens">Stranded Citizens</option>
                    <option value="IoT Sensor Outage">IoT Sensor Outage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location / Village / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Near Beas River Bridge, Old Manali"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-slate-900"
                  >
                    <option value="Critical">Critical (Immediate Evac Needed)</option>
                    <option value="High">High (Substantial Hazard)</option>
                    <option value="Moderate">Moderate (Cautionary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Details / Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Water level rising rapidly, ~15 houses affected..."
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Field Report</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
