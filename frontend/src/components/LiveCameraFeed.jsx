import React, { useState } from 'react';
import { Video, Camera, Grid, Layout, Cpu, ShieldAlert, Radio } from 'lucide-react';
import RadarScanner from './RadarScanner';

export default function LiveCameraFeed({ streamUrl, currentSignal, onSignalToggle, activeViolationsCount = 6 }) {
  const [selectedCam, setSelectedCam] = useState('CAM-01');
  const [viewMode, setViewMode] = useState('single');

  const cameras = [
    { id: 'CAM-01', name: 'SG Highway Intersection', location: 'Ahmedabad' },
    { id: 'CAM-02', name: 'MG Road Crossway', location: 'Surat' },
    { id: 'CAM-03', name: 'Ring Road Flyover', location: 'Vadodara' },
    { id: 'CAM-04', name: 'Expressway Toll Plaza', location: 'Gandhinagar' }
  ];

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Feed Header */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            LIVE CCTV TRAFFIC MONITOR & AI RETICLE
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono-code">
            1080p @ 30 FPS
          </span>
        </div>

        {/* View Mode & Selector */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition font-semibold ${
                viewMode === 'single' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" /> Focus View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition font-semibold ${
                viewMode === 'grid' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> 4-Cam Grid
            </button>
          </div>

          {viewMode === 'single' && (
            <select
              value={selectedCam}
              onChange={(e) => setSelectedCam(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono-code focus:outline-none focus:border-cyan-500"
            >
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>
                  📹 {c.id} - {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Scrolling Detection Ticker Banner */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-1.5 text-xs font-mono-code text-cyan-400 overflow-hidden whitespace-nowrap flex items-center gap-3">
        <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] font-bold text-cyan-300 shrink-0">
          ⚡ DETECTOR TICKER
        </span>
        <marquee className="text-slate-300">
          🚨 [CAM-01] Vehicle GJ01AB1234 flagged Red Light Jump (94%) &bull; 🪖 [CAM-02] Vehicle GJ05XY8821 flagged No Helmet (91%) &bull; 🚘 [CAM-03] Vehicle DL3C9999 Speeding 98 km/h (96%) &bull; ⚠️ [CAM-01] Vehicle GJ01CD4521 Wrong Side Driving (88%)
        </marquee>
      </div>

      {/* Video Viewport Container */}
      <div className="relative bg-slate-950 flex-1 flex items-center justify-center min-h-[420px] overflow-hidden">
        {viewMode === 'single' ? (
          <div className="relative w-full h-full">
            {/* Viewport Corner Brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400 z-10 pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400 z-10 pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400 z-10 pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400 z-10 pointer-events-none"></div>

            <img
              src={streamUrl}
              alt="Live Traffic Video Stream"
              className="w-full h-full object-cover max-h-[520px]"
            />

            {/* AI HUD Info Box */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono-code space-y-1 text-slate-300 z-20">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Cpu className="w-3.5 h-3.5" /> YOLOv8 OBJECT DETECTOR & ALPR
              </div>
              <div className="text-[11px] text-slate-400">
                BOUNDING BOXES: <span className="text-emerald-400 font-bold">ACTIVE</span> | STOP LINE: <span className="text-red-400 font-bold">MONITORED</span>
              </div>
            </div>

            {/* Signal Light Toggle Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-2 z-20">
              <span className="text-xs text-slate-300 font-semibold px-1">Signal:</span>
              <button
                onClick={() => onSignalToggle('RED')}
                className={`w-4 h-4 rounded-full transition ${currentSignal === 'RED' ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-red-950 border border-red-800 opacity-40'}`}
              />
              <button
                onClick={() => onSignalToggle('YELLOW')}
                className={`w-4 h-4 rounded-full transition ${currentSignal === 'YELLOW' ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b]' : 'bg-amber-950 border border-amber-800 opacity-40'}`}
              />
              <button
                onClick={() => onSignalToggle('GREEN')}
                className={`w-4 h-4 rounded-full transition ${currentSignal === 'GREEN' ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]' : 'bg-emerald-950 border border-emerald-800 opacity-40'}`}
              />
            </div>
          </div>
        ) : (
          /* 4-Camera Grid Mode */
          <div className="grid grid-cols-2 gap-1.5 p-1.5 w-full h-full max-h-[520px]">
            {cameras.map((cam) => (
              <div key={cam.id} className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={streamUrl}
                  alt={cam.name}
                  className="w-full h-full object-cover min-h-[220px]"
                />
                <div className="absolute top-2 left-2 bg-slate-950/90 text-cyan-400 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono-code flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {cam.id}: {cam.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="px-5 py-2.5 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-400"></span> Normal Vehicle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500"></span> Violation Flagged
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> License Plate ROI
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Cyberpunk Vision HUD active
        </div>
      </div>
    </div>
  );
}
