import React, { useEffect, useRef } from 'react';
import { Radio } from 'lucide-react';

export default function RadarScanner({ vehicleCount = 6 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;
    let animId;

    // Generate random vehicle blips for radar radar simulation
    const blips = Array.from({ length: vehicleCount }, (_, i) => ({
      r: 30 + Math.random() * 80,
      theta: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
      isViolation: i % 3 === 0
    }));

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, width, height);

      // Draw Radar Background Circles
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let r = 30; r <= maxRadius; r += 30) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Draw Vehicle Blips
      blips.forEach((b) => {
        b.theta += b.speed * 0.5;
        const x = cx + b.r * Math.cos(b.theta);
        const y = cy + b.r * Math.sin(b.theta);

        ctx.fillStyle = b.isViolation ? '#ff0055' : '#00ff66';
        ctx.shadowColor = b.isViolation ? '#ff0055' : '#00ff66';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Sweeping Radar Line
      angle = (angle + 0.03) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, angle - 0.3, angle);
      ctx.lineTo(cx, cy);
      
      const gradient = ctx.createConicGradient(angle, cx, cy);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
      gradient.addColorStop(0.1, 'rgba(0, 240, 255, 0.05)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Radar Center Pulse
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [vehicleCount]);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          2D RADAR TRACKING
        </h3>
        <span className="text-[10px] text-cyan-400 font-mono-code">150m RANGE</span>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={220} height={220} className="w-[220px] h-[220px]" />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border border-cyan-500/10 animate-ping opacity-20"></div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono-code text-slate-400 mt-2">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Normal</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Violation</span>
      </div>
    </div>
  );
}
