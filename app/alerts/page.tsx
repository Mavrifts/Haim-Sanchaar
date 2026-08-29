'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useActiveState } from '@/context/StateContext';
import { getVillagesByState, DashboardResponse } from '@/app/actions';
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
  Users
} from 'lucide-react';

export default function AlertsPage() {
  const { selectedState } = useActiveState();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Alert State Variables
  const [sirenActive, setSirenActive] = useState<boolean>(false);
  const [sirenAudio, setSirenAudio] = useState<HTMLAudioElement | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

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

  const handleSirenToggle = () => {
    setSirenActive(!sirenActive);
    // Simple mock audio alert or notification sound can be added here
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setBroadcastStatus('sending');
    setTimeout(() => {
      setBroadcastStatus('sent');
      setMessageText('');
      setTimeout(() => setBroadcastStatus(null), 4000);
    }, 1500);
  };

  const villages = data?.villages || [];
  const criticalVillages = villages.filter((v) => v.risk_status === 'CRITICAL');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0071E3]" /> Emergency Communications Center
          </h1>
          <p className="text-xs text-[#86868B] mt-0.5">
            Active communications node for {selectedState}. Broadcast cell-broadcast alerts, control field sirens, and coordinate with ground response teams.
          </p>
        </div>
        
        <button
          onClick={() => loadData(selectedState)}
          disabled={loading || isPending}
          className="rounded-full px-4 py-1.5 text-xs font-semibold bg-white hover:bg-neutral-50 text-[#1D1D1F] border border-black/[0.08] shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading || isPending ? 'animate-spin text-[#0071E3]' : ''}`} />
          <span>Refresh Comms</span>
        </button>
      </div>

      {/* Grid containing composition and helplines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comms Console & Broadcast (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tactical Sirens Controls */}
          <section className="bg-white border border-black/[0.08] rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-500" /> Ground Siren Control & Alarms
                </h2>
                <p className="text-[11px] text-[#86868B] mt-0.5">
                  Remotely trigger emergency warning sirens in high-risk sectors across {selectedState}.
                </p>
              </div>
              <span className="text-[10px] bg-red-500/10 text-red-600 border border-red-500/15 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Direct Line
              </span>
            </div>

            <div className="p-5 bg-neutral-50 rounded-2xl border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <strong className="text-xs text-neutral-800 block">Civil Defense Warning Siren</strong>
                <span className="text-[11px] text-[#86868B]">
                  Triggers 130dB high-intensity mountain hazard horns in {criticalVillages.length} critical sectors.
                </span>
              </div>

              <button
                onClick={handleSirenToggle}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer flex items-center gap-2 ${
                  sirenActive
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/35'
                    : 'bg-white hover:bg-neutral-50 text-red-600 border border-red-500/20'
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

          {/* Citizen Emergency Broadcast Composer */}
          <section className="bg-white border border-black/[0.08] rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#0071E3]" /> Broadcast Tactical Alert
              </h2>
              <p className="text-[11px] text-[#86868B] mt-0.5">
                Send cell-broadcast text alerts directly to mobile devices connected to tower relays in {selectedState}.
              </p>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Type immediate alert message (e.g., "MANDATORY EVACUATION: Old Manali area residents must immediately move to Atal Mountaineering Institute high grounds via Log Huts Ridge road...")`}
                rows={4}
                className="w-full p-4 bg-neutral-50 border border-black/[0.06] rounded-2xl text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3]/20 transition"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#86868B] font-medium">
                  Targets ~{(criticalVillages.length * 12000).toLocaleString('en-IN')} citizens across critical zones.
                </span>

                <button
                  type="submit"
                  disabled={broadcastStatus === 'sending'}
                  className="rounded-full px-5 py-2 bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {broadcastStatus === 'sending' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Cell Alert</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {broadcastStatus === 'sent' && (
              <div className="p-3 bg-blue-50 border border-blue-200/50 rounded-2xl text-blue-800 text-[11px] font-semibold flex items-center gap-2 animate-in fade-in duration-300">
                <CheckCircle className="w-4 h-4 text-[#0071E3]" />
                <span>Cell-broadcast successfully transmitted via NDRF central tower multiplexers.</span>
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Helplines & Ground Stations (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Official Emergency Contact Helplines */}
          <section className="bg-white border border-black/[0.08] rounded-3xl p-6 space-y-4 shadow-xs h-full">
            <div>
              <h2 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-600" /> Command Helplines
              </h2>
              <p className="text-[11px] text-[#86868B] mt-0.5">
                Emergency direct telephone channels for field battalions and local emergency operations centers.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">NDRF HQ</span>
                <span className="font-mono text-xs font-bold text-[#1D1D1F] block">1078 / +91-11-23438017</span>
                <span className="text-[9px] text-[#86868B]">New Delhi Emergency Cell</span>
              </div>

              {selectedState === 'Himachal Pradesh' ? (
                <>
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">HP State EOC</span>
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] block">1070 / 0177-2812344</span>
                    <span className="text-[9px] text-[#86868B]">Shimla State Command Center</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">Kullu Dist Ops</span>
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] block">01902-224300</span>
                    <span className="text-[9px] text-[#86868B]">Beas River Basin Sector Control</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">Mandi Control</span>
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] block">01905-226201</span>
                    <span className="text-[9px] text-[#86868B]">Pandoh Dam Hydroelectric post</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">UK State EOC</span>
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] block">1070 / 0135-2710334</span>
                    <span className="text-[9px] text-[#86868B]">Dehradun State Headquarters</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">Chamoli Dist Ops</span>
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] block">01372-251077</span>
                    <span className="text-[9px] text-[#86868B]">Alaknanda Basin Incident Command</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-50 border border-black/[0.04] space-y-1">
                    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">Rudraprayag EOC</span>
                    <span className="font-mono text-xs font-bold text-[#1D1D1F] block">01364-233727</span>
                    <span className="text-[9px] text-[#86868B]">Mandakini Confluence control</span>
                  </div>
                </>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
