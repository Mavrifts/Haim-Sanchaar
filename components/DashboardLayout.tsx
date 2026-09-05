'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type LanguageCode = 'en' | 'hi' | 'doi' | 'ks' | 'lad' | 'pah' | 'gar' | 'bn';

const dictionary = {
  en: {
    title: 'HEM SANCHAR (हेम संचार)',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language'
  },
  hi: {
    title: 'HEM SANCHAR (हेम संचार)',
    subtitle: 'आपदा प्रबंधन प्रभाग | गृह मंत्रालय',
    minister: 'श्री अमित शाह — माननीय केंद्रीय गृह मंत्री',
    emblem: 'सत्यमेव जयते',
    navHome: 'होम डैशबोर्ड',
    navGis: 'लाइव जीआईएस मैप',
    navTelemetry: 'टेलीमेट्री डेटा',
    navDataSources: 'डेटा स्रोत',
    navDirectives: 'आपातकालीन निर्देश',
    footer: 'टीम पावर पफ गर्ल्स द्वारा ❤️ के साथ विकसित | स्मार्ट इंडिया हैकथॉन 2026',
    language: 'भाषा'
  },
  doi: {
    title: 'HEM SANCHAR (हेम संचार)',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Dogri)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language'
  },
  ks: {
    title: 'HEM SANCHAR (हेम संचार)',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Kashmiri)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language'
  },
  lad: {
    title: 'HEM SANCHAR (हेम संचार)',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Ladakhi)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language'
  },
  pah: {
    title: 'HEM SANCHAR (हेम संचार)',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Pahari)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language'
  },
  gar: {
    title: 'HEM SANCHAR (हेम संचार)',
    subtitle: 'DISASTER MANAGEMENT DIVISION | MINISTRY OF HOME AFFAIRS (Garhwali)',
    minister: "Shri Amit Shah — Hon'ble Union Minister of Home Affairs",
    emblem: 'सत्यमेव जयते',
    navHome: 'Home Dashboard',
    navGis: 'Live GIS Map',
    navTelemetry: 'Telemetry Data',
    navDataSources: 'Data Sources',
    navDirectives: 'Emergency Directives',
    footer: 'Developed with ❤️ by Team Power Puff Girls | Smart India Hackathon 2026',
    language: 'Language'
  },
  bn: {
    title: 'HEM SANCHAR (হেম সঞ্চার)',
    subtitle: 'বিপর্যয় ব্যবস্থাপনা বিভাগ | স্বরাষ্ট্র মন্ত্রণালয়',
    minister: 'শ্রী অমিত শাহ — মাননীয় কেন্দ্রীয় স্বরাষ্ট্রমন্ত্রী',
    emblem: 'সত‍্যমেব জয়তে',
    navHome: 'হোম ড্যাশবোর্ড',
    navGis: 'লাইভ জিআইএস ম্যাপ',
    navTelemetry: 'টেলিমেট্রি ডেটা',
    navDataSources: 'ডেটা উৎস',
    navDirectives: 'জরুরী নির্দেশাবলী',
    footer: 'টিম পাওয়ার পাফ গার্লস দ্বারা ❤️ এর সাথে তৈরি | স্মার্ট ইন্ডিয়া হ্যাকাথন 2026',
    language: 'ভাষা'
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = dictionary[lang];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header - Language Selector */}
      <div className="bg-gray-200 py-1 px-4 flex justify-end items-center text-sm border-b border-gray-300">
        <label htmlFor="language-select" className="mr-2 font-medium text-gray-700">
          {t.language}:
        </label>
        <select
          id="language-select"
          value={lang}
          onChange={(e) => setLang(e.target.value as LanguageCode)}
          className="p-1 border border-gray-400 rounded bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="doi">डोगरी (Dogri)</option>
          <option value="ks">کأشُر (Kashmiri)</option>
          <option value="lad">ལྡ་སྐད (Ladakhi)</option>
          <option value="pah">पहाड़ी (Pahari)</option>
          <option value="gar">गढ़वाली (Garhwali)</option>
          <option value="bn">বাংলা (Bengali)</option>
        </select>
      </div>

      {/* MHA Header */}
      <header className="bg-white py-4 px-6 flex flex-col md:flex-row items-center justify-between border-b-4 border-[#005a9c] shadow-sm">
        <div className="flex items-center gap-4">
          {/* Emblem representation */}
          <div className="flex flex-col items-center justify-center text-[#d97706] font-bold">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-yellow-600 mb-1">
               <span className="text-xs">🦁</span>
             </div>
             <span className="text-xs">{t.emblem}</span>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#005a9c] tracking-tight">
              {t.title}
            </h1>
            <h2 className="text-xs md:text-sm font-semibold text-gray-600 tracking-wider">
              {t.subtitle}
            </h2>
          </div>
        </div>

        <div className="mt-4 md:mt-0 text-right">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-2 rounded shadow-sm">
            <p className="text-sm font-semibold text-blue-900">{t.minister}</p>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#005a9c] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-wrap text-sm md:text-base">
            <li>
              <Link href="/" className="block py-3 px-4 hover:bg-blue-800 transition-colors duration-200">
                {t.navHome}
              </Link>
            </li>
            <li>
              <Link href="/map" className="block py-3 px-4 hover:bg-blue-800 transition-colors duration-200">
                {t.navGis}
              </Link>
            </li>
            <li>
              <Link href="/telemetry" className="block py-3 px-4 hover:bg-blue-800 transition-colors duration-200">
                {t.navTelemetry}
              </Link>
            </li>
            <li>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="block py-3 px-4 hover:bg-blue-800 transition-colors duration-200 h-full w-full text-left"
              >
                {t.navDataSources}
              </button>
            </li>
            <li>
              <Link href="/directives" className="block py-3 px-4 hover:bg-blue-800 transition-colors duration-200">
                {t.navDirectives}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center text-sm border-t-4 border-gray-900">
        <p className="font-medium opacity-80">{t.footer}</p>
      </footer>

      {/* Data Sources Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t.navDataSources}</h3>
            <p className="text-gray-600 mb-6">
              Data source integrations are currently being configured for HEM SANCHAR. 
              Live API feeds will be displayed here.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#005a9c] text-white rounded hover:bg-blue-800 transition-colors"
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
