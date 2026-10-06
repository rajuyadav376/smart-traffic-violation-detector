import React, { useState } from 'react';
import { CloudRain, Sun, CloudFog, Gauge, Car, HardHat, RefreshCw, Zap, PlusCircle, Sparkles } from 'lucide-react';

export default function SimulationControls({ onWeatherChange, onSpeedChange, onSpawnVehicle }) {
  const [currentWeather, setCurrentWeather] = useState('clear');
  const [speedVal, setSpeedVal] = useState(1.0);
  const [spawnerLoading, setSpawnerLoading] = useState(null);

  const handleWeather = (weather) => {
    setCurrentWeather(weather);
    onWeatherChange(weather);
  };

  const handleSpeed = (speed) => {
    setSpeedVal(speed);
    onSpeedChange(speed);
  };

  const handleSpawn = async (vType) => {
    setSpawnerLoading(vType);
    await onSpawnVehicle(vType);
    setTimeout(() => setSpawnerLoading(null), 600);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          INTERACTIVE AI SIMULATION STUDIO
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono-code font-bold">
          LIVE CONTROLS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weather & Speed Adjustments */}
        <div className="space-y-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>WEATHER ENVIRONMENT</span>
            <span className="text-[11px] text-cyan-400 uppercase font-mono-code">{currentWeather}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleWeather('clear')}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                currentWeather === 'clear'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Clear Day
            </button>

            <button
              onClick={() => handleWeather('rain')}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                currentWeather === 'rain'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rain Mode
            </button>

            <button
              onClick={() => handleWeather('fog')}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                currentWeather === 'fog'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <CloudFog className="w-3.5 h-3.5 text-purple-400" /> Night / Fog
            </button>
          </div>

          {/* Speed Multiplier Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-emerald-400" /> Traffic Flow Speed</span>
              <span className="font-mono-code font-bold text-emerald-400">{speedVal}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.25"
              value={speedVal}
              onChange={(e) => handleSpeed(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Manual Vehicle Spawner */}
        <div className="space-y-2 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            MANUAL VIOLATION SPAWNER
          </div>
          <p className="text-[11px] text-slate-400">Instantly launch custom test vehicles into the live CCTV feed:</p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleSpawn('Speeding')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-200 flex items-center gap-2 transition"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Spawn Speeding Car
            </button>

            <button
              onClick={() => handleSpawn('No Helmet')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-200 flex items-center gap-2 transition"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-400" /> Spawn No Helmet
            </button>

            <button
              onClick={() => handleSpawn('Wrong Side')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 flex items-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> Spawn Wrong Side
            </button>

            <button
              onClick={() => handleSpawn('Triple Riding')}
              className="p-2 rounded-lg bg-slate-950 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-200 flex items-center gap-2 transition"
            >
              <Car className="w-3.5 h-3.5 text-indigo-400" /> Spawn Triple Riding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
