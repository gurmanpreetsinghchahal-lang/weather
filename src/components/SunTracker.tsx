import React from 'react';
import { Sun, Sunrise, Sunset, Clock } from 'lucide-react';
import { NormalizedWeatherData } from '../types/weather';

interface SunTrackerProps {
  data: NormalizedWeatherData;
}

export const SunTracker: React.FC<SunTrackerProps> = ({ data }) => {
  const currentNowSec = Math.floor(Date.now() / 1000);
  const sunrise = data.sunriseTimestamp;
  const sunset = data.sunsetTimestamp;

  // Total daylight in seconds
  const daylightSec = Math.max(0, sunset - sunrise);
  const daylightHours = Math.floor(daylightSec / 3600);
  const daylightMinutes = Math.floor((daylightSec % 3600) / 60);

  // Sun position progress 0% to 100%
  let progress = 0;
  if (currentNowSec <= sunrise) {
    progress = 0;
  } else if (currentNowSec >= sunset) {
    progress = 1;
  } else if (daylightSec > 0) {
    progress = (currentNowSec - sunrise) / daylightSec;
  }

  // Calculate sun angle on semi-circle arc (0 rad to PI rad)
  const angle = progress * Math.PI;
  // Arc radius and center for 200x100 viewBox
  const r = 80;
  const cx = 100;
  const cy = 90;
  // Arc path from (20, 90) to (180, 90)
  const sunX = cx - r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sun size={18} className="text-amber-400" />
          <h2 className="text-base font-semibold text-slate-100 font-['Plus_Jakarta_Sans'] tracking-tight">
            Solar Position & Ephemeris
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock size={13} className="text-slate-400" />
          <span>{daylightHours}h {daylightMinutes}m daylight</span>
        </div>
      </div>

      {/* SVG Solar Arc graphic */}
      <div className="relative py-2 flex items-center justify-center">
        <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-28 overflow-visible">
          {/* Background Horizon Dashed Arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Active daylight progress arc */}
          {progress > 0 && (
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="url(#sun-gradient)"
              strokeWidth="3.5"
              strokeDasharray={`${progress * 251.3} 251.3`}
              strokeLinecap="round"
            />
          )}

          {/* Baseline horizon */}
          <line x1="10" y1="90" x2="190" y2="90" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />

          {/* Glowing Sun marker */}
          {data.isDaytime && (
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle r="9" fill="#F59E0B" className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <circle r="4" fill="#FFFFFF" />
            </g>
          )}

          <defs>
            <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Times footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sunrise size={15} className="text-amber-400" />
          <span className="font-mono font-medium">{data.sunriseTime}</span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {data.isDaytime ? 'Sun is currently above horizon' : 'Sun is below horizon'}
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="font-mono font-medium">{data.sunsetTime}</span>
          <Sunset size={15} className="text-indigo-400" />
        </div>
      </div>
    </div>
  );
};
