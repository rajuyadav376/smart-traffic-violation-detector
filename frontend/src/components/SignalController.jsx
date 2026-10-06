import React from 'react';
import { Radio, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SignalController({ currentSignal, onSignalToggle }) {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            TRAFFIC SIGNAL CONTROLLER
          </h3>
          <span className="text-[10px] uppercase font-mono-code px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            INTERACTIVE
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Manually override signal state to simulate live red-light jump enforcement.
        </p>

        {/* Signal Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => onSignalToggle('RED')}
            className={`p-3 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition ${
              currentSignal === 'RED'
                ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-red-500/40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-red-500 shadow-md"></span>
            <span className="text-xs tracking-wider">RED</span>
          </button>

          <button
            onClick={() => onSignalToggle('YELLOW')}
            className={`p-3 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition ${
              currentSignal === 'YELLOW'
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-amber-500/40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-400 shadow-md"></span>
            <span className="text-xs tracking-wider">YELLOW</span>
          </button>

          <button
            onClick={() => onSignalToggle('GREEN')}
            className={`p-3 rounded-xl border font-bold flex flex-col items-center gap-1.5 transition ${
              currentSignal === 'GREEN'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-emerald-500/40'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-400 shadow-md"></span>
            <span className="text-xs tracking-wider">GREEN</span>
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Red signal activates stop line boundary
        </span>
        <button
          onClick={() => onSignalToggle(null)}
          className="text-cyan-400 hover:underline font-mono-code text-[11px]"
        >
          Auto Cycle
        </button>
      </div>
    </div>
  );
}
