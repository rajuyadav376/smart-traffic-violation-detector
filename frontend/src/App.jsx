import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from './components/DashboardHeader';
import MetricCards from './components/MetricCards';
import LiveCameraFeed from './components/LiveCameraFeed';
import SignalController from './components/SignalController';
import SimulationControls from './components/SimulationControls';
import RadarScanner from './components/RadarScanner';
import ViolationList from './components/ViolationList';
import ViolationModal from './components/ViolationModal';
import AnalyticsView from './components/AnalyticsView';

export default function App() {
  const [stats, setStats] = useState(null);
  const [violations, setViolations] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [currentSignal, setCurrentSignal] = useState('RED');
  const [isLive, setIsLive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const lastViolationCount = useRef(0);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  // Web Audio API Siren Beep Generator
  const playSirenBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn("Audio Context beep error:", e);
    }
  };

  const fetchStatsData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn("Backend API connecting...", err);
    }
  };

  const fetchViolationsData = async () => {
    try {
      let url = `${API_BASE}/api/violations?limit=50`;
      if (selectedType && selectedType !== 'All') {
        url += `&violation_type=${encodeURIComponent(selectedType)}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        const newViolations = result.data || [];
        
        if (lastViolationCount.current > 0 && newViolations.length > lastViolationCount.current) {
          playSirenBeep();
        }
        lastViolationCount.current = newViolations.length;
        setViolations(newViolations);
      }
    } catch (err) {
      console.warn("Violations API fetching...", err);
    }
  };

  const handleSignalToggle = async (state) => {
    setCurrentSignal(state || 'RED');
    try {
      await fetch(`${API_BASE}/api/signal/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
      });
      fetchStatsData();
      fetchViolationsData();
    } catch (err) {
      console.error("Signal toggle error:", err);
    }
  };

  const handleWeatherChange = async (weather) => {
    try {
      await fetch(`${API_BASE}/api/simulation/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weather })
      });
    } catch (err) {
      console.error("Weather config error:", err);
    }
  };

  const handleSpeedChange = async (speed_multiplier) => {
    try {
      await fetch(`${API_BASE}/api/simulation/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed_multiplier })
      });
    } catch (err) {
      console.error("Speed config error:", err);
    }
  };

  const handleSpawnVehicle = async (violation_type) => {
    try {
      await fetch(`${API_BASE}/api/simulation/spawn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ violation_type })
      });
      playSirenBeep();
      setTimeout(() => {
        fetchStatsData();
        fetchViolationsData();
      }, 800);
    } catch (err) {
      console.error("Vehicle spawner error:", err);
    }
  };

  const handleQuickPay = async (violation_id) => {
    try {
      await fetch(`${API_BASE}/api/violations/${violation_id}/pay`, {
        method: 'POST'
      });
      fetchStatsData();
      fetchViolationsData();
    } catch (err) {
      console.error("Quick pay error:", err);
    }
  };

  useEffect(() => {
    fetchStatsData();
    fetchViolationsData();

    const interval = setInterval(() => {
      fetchStatsData();
      fetchViolationsData();
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans pb-12 selection:bg-cyan-500 selection:text-black">
      {/* Top Cyber Command Header */}
      <DashboardHeader
        search={searchQuery}
        setSearch={setSearchQuery}
        onRefresh={() => { fetchStatsData(); fetchViolationsData(); }}
        isLive={isLive}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Grid Container */}
      <main className="max-w-[1650px] mx-auto px-6 pt-6 space-y-6">
        {/* Metric Overview Cards with Progress Meters */}
        <MetricCards stats={stats} />

        {/* Interactive Studio & Radar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-9">
            <SimulationControls
              onWeatherChange={handleWeatherChange}
              onSpeedChange={handleSpeedChange}
              onSpawnVehicle={handleSpawnVehicle}
            />
          </div>
          <div className="lg:col-span-3">
            <RadarScanner vehicleCount={6} />
          </div>
        </div>

        {/* Live CCTV Stream & Enforcement Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Live CCTV Stream Monitor & Traffic Controller */}
          <div className="lg:col-span-7 space-y-4">
            <LiveCameraFeed
              streamUrl={`${API_BASE}/api/stream`}
              currentSignal={currentSignal}
              onSignalToggle={handleSignalToggle}
            />
            <SignalController
              currentSignal={currentSignal}
              onSignalToggle={handleSignalToggle}
            />
          </div>

          {/* Right Side: Enforcement Feed Log */}
          <div className="lg:col-span-5 h-full">
            <ViolationList
              violations={violations}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              onSelectViolation={(v) => setSelectedViolation(v)}
              onPayQuick={handleQuickPay}
            />
          </div>
        </div>

        {/* Analytics Breakdown */}
        <AnalyticsView stats={stats} />
      </main>

      {/* e-Challan Detail Popup Modal */}
      <ViolationModal
        violation={selectedViolation}
        onClose={() => setSelectedViolation(null)}
        onPaid={() => { fetchStatsData(); fetchViolationsData(); }}
      />
    </div>
  );
}
