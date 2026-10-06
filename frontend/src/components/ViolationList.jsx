import React from 'react';
import { AlertCircle, ChevronRight, Filter, ShieldCheck, MapPin, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

export default function ViolationList({ violations, selectedType, setSelectedType, onSelectViolation, onPayQuick }) {
  const categories = [
    "All",
    "Red Light Jump",
    "No Helmet",
    "Wrong Side Driving",
    "Triple Riding",
    "Speeding",
    "Mobile Phone Use"
  ];

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Red Light Jump':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'No Helmet':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Wrong Side Driving':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Triple Riding':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Speeding':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Feed Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            LIVE VIOLATION ENFORCEMENT FEED
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold font-mono-code">
            {violations.length} LOGS
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap transition font-medium ${
                selectedType === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List Feed */}
      <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[520px] flex-1">
        {violations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No violations found for selected filter.
          </div>
        ) : (
          violations.map((v) => (
            <div
              key={v.id || v.violation_id}
              className="p-3.5 hover:bg-slate-900/80 transition cursor-pointer group flex items-center justify-between gap-3"
            >
              <div
                onClick={() => onSelectViolation(v)}
                className="flex items-center gap-3 min-w-0 flex-1"
              >
                {/* Vehicle Plate Badge */}
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-yellow-400 font-mono-code font-bold text-sm tracking-wider shadow-inner shrink-0">
                  🚗 {v.vehicle_number}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getBadgeColor(v.violation_type)}`}>
                      🚨 {v.violation_type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono-code">
                      Conf: {(v.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {v.timestamp.split(' ')[1] || v.timestamp}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {v.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-rose-400 font-mono-code">
                    ₹{v.fine_amount}
                  </div>
                  <span className={`text-[10px] font-bold ${v.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {v.status === 'Paid' ? 'PAID' : 'PENDING'}
                  </span>
                </div>

                {v.status !== 'Paid' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPayQuick) onPayQuick(v.violation_id);
                    }}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition"
                    title="Quick Pay Fine"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                  </button>
                )}

                <div
                  onClick={() => onSelectViolation(v)}
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
