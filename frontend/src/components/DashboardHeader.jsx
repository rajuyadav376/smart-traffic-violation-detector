import React, { useState, useEffect } from 'react';
import { ShieldAlert, Download, Search, RefreshCw, Activity, Volume2, VolumeX } from 'lucide-react';

export default function DashboardHeader({ search, setSearch, onRefresh, isLive, soundEnabled, setSoundEnabled }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false }));
    return () => clearInterval(timer);
  }, []);

  const handleExportCSV = () => {
    window.open('/api/violations/export/csv', '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Brand & Status */}
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/30">
          <ShieldAlert className="w-6 h-6 text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Smart Traffic <span className="text-cyan-400 font-mono-code">AI</span>
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              CYBER COMMAND v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            CCTV Vision Detection System &bull; Ahmedabad Sector 01
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search license plate (e.g. GJ01AB1234), location..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* Right Quick Tools */}
      <div className="flex items-center gap-3">
        {/* Audio Siren Alert Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
            soundEnabled
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-rose-500/20 shadow'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Violation Sound Siren"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400 animate-bounce" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          Siren {soundEnabled ? 'ON' : 'OFF'}
        </button>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition"
          title="Export CSV Audit Report"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" /> Export CSV
        </button>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono-code">
          <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          {isLive ? 'STREAM LIVE' : 'CONNECTING...'}
        </div>

        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="text-right text-xs font-mono-code text-slate-400">
          <div className="text-cyan-400 font-semibold">{timeStr}</div>
          <div className="text-[10px] text-slate-500">UTC+05:30</div>
        </div>
      </div>
    </header>
  );
}
