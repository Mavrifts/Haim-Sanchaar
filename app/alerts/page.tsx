'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useAppState } from '@/context/StateContext';
import { getVillagesByState, DashboardResponse } from '@/app/actions';
import { triggerContinuousSiren, stopContinuousSiren } from '@/utils/sound';
import {
  Bell,
  Radio,
  Volume2,
  VolumeX,
  PhoneCall,
  Mail,
  Send,
  AlertOctagon,
  RefreshCw,
  CheckCircle,
  Building,
  Users,
  Code,
  MessageSquare,
  Smartphone,
  Share2
} from 'lucide-react';

export default function AlertsPage() {
  const { selectedState, t } = useAppState();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Audio Siren State
  const [sirenActive, setSirenActive] = useState<boolean>(false);

  // CAP Message Generator Form State
  const [eventType, setEventType] = useState('Flash Flood / Cloudburst Warning');
  const [urgency, setUrgency] = useState('Immediate');
  const [severity, setSeverity] = useState('Extreme');
  const [targetZone, setTargetZone] = useState('Beas & Sutlej River Valleys');
  const [instructionText, setInstructionText] = useState(
    'MANDATORY EVACUATION: All residents in low-lying areas move to designated high-ground staging pavilions immediately.'
  );

  const [disseminationTab, setDisseminationTab] = useState<'xml' | 'sms' | 'whatsapp' | 'cell'>('cell');
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  const loadData = (stateToLoad: string) => {
    setLoading(true);
    startTransition(async () => {
      try {
        const res = await getVillagesByState(stateToLoad);
        setData(res);
      } catch (err) {
        console.error('Error fetching alerts data:', err);
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData(selectedState);
  }, [selectedState]);

  // Clean up siren audio on unmount
  useEffect(() => {
    return () => {
      stopContinuousSiren();
    };
  }, []);

  const handleSirenToggle = () => {
    if (sirenActive) {
      stopContinuousSiren();
      setSirenActive(false);
    } else {
      triggerContinuousSiren();
      setSirenActive(true);
    }
  };

  const handlePublishCAP = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishStatus('publishing');

    // Trigger siren audio alert if severity is Extreme
    if (severity === 'Extreme' && !sirenActive) {
      triggerContinuousSiren();
      setSirenActive(true);
    }

    setTimeout(() => {
      setPublishStatus('published');
      setTimeout(() => setPublishStatus(null), 4000);
    }, 1200);
  };

  const capXmlSnippet = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>HEM-SANCHAR-${Date.now()}</identifier>
  <sender>mha.ndrf.gov.in</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <info>
    <category>Met</category>
    <event>${eventType}</event>
    <urgency>${urgency}</urgency>
    <severity>${severity}</severity>
    <area>
      <areaDesc>${targetZone}, ${selectedState}</areaDesc>
    </area>
    <instruction>${instructionText}</instruction>
  </info>
</alert>`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#005a9c]" /> {t.capGenerator || 'CAP Geo-Alert Generator & Directives'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Common Alerting Protocol (CAP / SACHET) multi-channel broadcast node for {selectedState}.
          </p>
        </div>

        <button
          onClick={() => loadData(selectedState)}
          disabled={loading || isPending}
          className="rounded-full px-4 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 shadow-2xs transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading || isPending ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh Comms</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CAP Form & Multi-Channel Simulation (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Mass Siren Control Box */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-600" /> Ground Warning Siren Control
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Remotely trigger frequency-sweeping emergency warning audio horns across critical mountain sectors.
                </p>
              </div>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Direct Line
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-slate-900 block">Frequency-Sweeping Warning Horns</strong>
                <span className="text-[11px] text-slate-500">
                  Synthesizes 700Hz–1200Hz continuous audio alert for civil defense testing.
                </span>
              </div>

              <button
                onClick={handleSirenToggle}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition active:scale-95 shadow-2xs flex items-center gap-2 cursor-pointer ${
                  sirenActive
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'
                    : 'bg-white hover:bg-slate-100 text-red-600 border border-red-300'
                }`}
              >
                {sirenActive ? (
                  <>
                    <Volume2 className="w-4 h-4 text-white animate-bounce" />
                    <span>SIREN ACTIVE (CLICK TO KILL)</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>TEST MASS SIREN</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* CAP Alert Generator Form */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#005a9c]" /> Multi-Channel CAP Alert Composer
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate ITU-T X.1303 CAP XML and broadcast across Cell Broadcast, SMS, and WhatsApp integrations.
              </p>
            </div>

            <form onSubmit={handlePublishCAP} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  >
                    <option value="Flash Flood / Cloudburst Warning">Flash Flood / Cloudburst Warning</option>
                    <option value="Glacial Lake Outburst (GLOF)">Glacial Lake Outburst (GLOF)</option>
                    <option value="Landslide Highway Blockade">Landslide Highway Blockade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Micro-Zone</label>
                  <input
                    type="text"
                    value={targetZone}
                    onChange={(e) => setTargetZone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  >
                    <option value="Immediate">Immediate (Take Action Now)</option>
                    <option value="Expected">Expected (Prepare Within 1 Hour)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  >
                    <option value="Extreme">Extreme (Life Safety Risk)</option>
                    <option value="Severe">Severe (Significant Property Risk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instruction / Action Message</label>
                <textarea
                  rows={3}
                  value={instructionText}
                  onChange={(e) => setInstructionText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>

              {/* Multi-Channel Preview Tabs */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700">Preview Formats:</span>
                  <div className="flex gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setDisseminationTab('cell')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        disseminationTab === 'cell' ? 'bg-[#005a9c] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Smartphone className="w-3 h-3 inline mr-1" /> Cell Broadcast
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisseminationTab('xml')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        disseminationTab === 'xml' ? 'bg-[#005a9c] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Code className="w-3 h-3 inline mr-1" /> CAP XML
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisseminationTab('sms')}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        disseminationTab === 'sms' ? 'bg-[#005a9c] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3 inline mr-1" /> SMS Text
                    </button>
                  </div>
                </div>

                {disseminationTab === 'xml' && (
                  <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40">
                    {capXmlSnippet}
                  </pre>
                )}

                {disseminationTab === 'cell' && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-xl text-amber-950 text-xs space-y-1">
                    <strong className="font-extrabold block text-red-700">🚨 EMERGENCY CELL BROADCAST (SACHET)</strong>
                    <p className="font-semibold">{instructionText}</p>
                    <span className="text-[10px] text-amber-800 block">Target: All active mobile towers in {targetZone}.</span>
                  </div>
                )}

                {disseminationTab === 'sms' && (
                  <div className="p-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800">
                    [MHA-ALERT] {eventType}: {instructionText} - Emergency Helpline: 1078
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={publishStatus === 'publishing'}
                  className="px-6 py-2.5 bg-[#005a9c] hover:bg-blue-800 text-white rounded-full font-bold text-xs shadow-xs flex items-center gap-2 transition cursor-pointer"
                >
                  {publishStatus === 'publishing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitting Multi-Channel CAP...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Transmit Multi-Channel Alert</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {publishStatus === 'published' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>CAP Alert successfully transmitted to SACHET national relay & audio sirens activated!</span>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Helplines (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" /> Command Direct Lines
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">NDRF HQ Command</span>
                <span className="font-mono text-xs font-extrabold text-slate-900 block">1078 / 011-23438017</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">State SEOC ({selectedState})</span>
                <span className="font-mono text-xs font-extrabold text-slate-900 block">1070 / 0177-2812344</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
