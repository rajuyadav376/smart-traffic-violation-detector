import React, { useState } from 'react';
import { X, Printer, ShieldAlert, CheckCircle, MapPin, Clock, Car, CreditCard, CheckCircle2 } from 'lucide-react';

export default function ViolationModal({ violation, onClose, onPaid }) {
  const [isPaying, setIsPaying] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);

  if (!violation) return null;

  const handlePay = async () => {
    setIsPaying(true);
    try {
      const res = await fetch(`/api/violations/${violation.violation_id}/pay`, {
        method: 'POST'
      });
      if (res.ok) {
        setIsPaidSuccess(true);
        if (onPaid) onPaid(violation.violation_id);
      }
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsPaying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStatus = isPaidSuccess ? 'Paid' : violation.status;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                OFFICIAL TRAFFIC E-CHALLAN
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono-code">
                  #{violation.violation_id}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Smart Traffic Violation Detector Enforcement Record</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Main Details Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Snapshot Image Box */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative min-h-[180px] flex items-center justify-center">
              {violation.snapshot_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${violation.snapshot_base64}`}
                  alt="Violation Evidence Frame"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs flex flex-col items-center">
                  <Car className="w-8 h-8 mb-2 text-cyan-400" />
                  <span>CCTV CAMERA SNAPSHOT</span>
                  <span className="text-[10px] text-slate-600 mt-1">High-Resolution Evidence Frame Logged</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-slate-900/90 text-cyan-400 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono-code">
                CAMERA: CAM-01 (SG HIGHWAY)
              </div>
            </div>

            {/* Ticket Info Summary */}
            <div className="space-y-3">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400">LICENSE PLATE</span>
                  <div className="text-xl font-bold font-mono-code text-yellow-400 mt-0.5">
                    🚗 {violation.vehicle_number}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  currentStatus === 'Paid'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  {currentStatus === 'Paid' ? '✓ PAID' : '⚡ PENDING'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400">VIOLATION TYPE</span>
                  <div className="text-xs font-bold text-rose-400 mt-0.5">
                    🚨 {violation.violation_type}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400">AI CONFIDENCE</span>
                  <div className="text-xs font-bold text-emerald-400 font-mono-code mt-0.5">
                    {(violation.confidence * 100).toFixed(0)}% ACCURACY
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">CHALLAN FINE AMOUNT</span>
                <span className="text-lg font-bold text-rose-400 font-mono-code">
                  ₹{violation.fine_amount}
                </span>
              </div>
            </div>
          </div>

          {/* Extended Metadata Table */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Date & Time</span>
              <span className="text-slate-200 font-mono-code">{violation.timestamp}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
              <span className="text-slate-200">{violation.location}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> Vehicle Category</span>
              <span className="text-slate-200">{violation.vehicle_type} ({violation.speed || 45} km/h)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" /> Print e-Challan
          </button>

          <div className="flex items-center gap-2">
            {currentStatus !== 'Paid' && (
              <button
                onClick={handlePay}
                disabled={isPaying}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {isPaying ? 'Processing...' : 'Pay Fine Now (Demo UPI)'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
