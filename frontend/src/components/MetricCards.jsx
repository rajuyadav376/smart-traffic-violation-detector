import React from 'react';
import { Car, AlertTriangle, Disc, HardHat, RefreshCw, Zap, TrendingUp } from 'lucide-react';

export default function MetricCards({ stats }) {
  const cards = [
    {
      title: "Total Vehicles",
      value: stats?.total_vehicles?.toLocaleString() || "12,483",
      subText: "Analyzed Today",
      trend: "+12.4%",
      progress: 85,
      icon: Car,
      color: "from-blue-500/20 to-cyan-500/10",
      borderColor: "border-cyan-500/30",
      textColor: "text-cyan-400",
      barColor: "bg-cyan-400"
    },
    {
      title: "Total Violations",
      value: stats?.total_violations || "327",
      subText: "Auto Enforced",
      trend: "+8.1%",
      progress: 62,
      icon: AlertTriangle,
      color: "from-rose-500/20 to-pink-500/10",
      borderColor: "border-rose-500/30",
      textColor: "text-rose-400",
      barColor: "bg-rose-500"
    },
    {
      title: "Red Light Jump",
      value: stats?.red_light || "142",
      subText: "Stop Line Breach",
      trend: "+15.2%",
      progress: 74,
      icon: Disc,
      color: "from-red-500/20 to-orange-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
      barColor: "bg-red-500"
    },
    {
      title: "No Helmet",
      value: stats?.no_helmet || "118",
      subText: "Two-Wheeler Safety",
      trend: "-3.5%",
      progress: 58,
      icon: HardHat,
      color: "from-amber-500/20 to-yellow-500/10",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      barColor: "bg-amber-400"
    },
    {
      title: "Wrong Side",
      value: stats?.wrong_side || "41",
      subText: "Vector Anomaly",
      trend: "+5.0%",
      progress: 42,
      icon: RefreshCw,
      color: "from-purple-500/20 to-indigo-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      barColor: "bg-purple-400"
    },
    {
      title: "Speed Violations",
      value: stats?.speeding || "26",
      subText: ">80 km/h threshold",
      trend: "+2.8%",
      progress: 35,
      icon: Zap,
      color: "from-emerald-500/20 to-teal-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      barColor: "bg-emerald-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className={`glass-panel bg-gradient-to-br ${item.color} border ${item.borderColor} p-4 rounded-2xl transition hover:scale-[1.03] duration-200 flex flex-col justify-between group shadow-lg`}
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">{item.title}</span>
                <IconComponent className={`w-4 h-4 ${item.textColor}`} />
              </div>

              <div className="flex items-baseline justify-between">
                <div className={`text-2xl font-bold tracking-tight ${item.textColor} font-mono-code`}>
                  {item.value}
                </div>
                <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-0.5 font-semibold">
                  <TrendingUp className="w-2.5 h-2.5" /> {item.trend}
                </span>
              </div>
            </div>

            {/* Progress Meter Bar */}
            <div className="mt-3 space-y-1">
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${item.barColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>{item.subText}</span>
                <span className="font-mono-code text-[9px] text-slate-500">{item.progress}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
