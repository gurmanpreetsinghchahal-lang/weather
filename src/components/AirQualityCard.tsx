import React from 'react';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AirQualityData } from '../types/weather';

interface AirQualityCardProps {
  airQuality?: AirQualityData;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality) return null;

  const aqiPercentage = (airQuality.aqi / 5) * 100;

  const pollutants = [
    { name: 'PM2.5', value: airQuality.pm2_5, unit: 'µg/m³', desc: 'Fine particles' },
    { name: 'PM10', value: airQuality.pm10, unit: 'µg/m³', desc: 'Inhalable particles' },
    { name: 'O₃', value: airQuality.o3, unit: 'µg/m³', desc: 'Ground-level ozone' },
    { name: 'NO₂', value: airQuality.no2, unit: 'µg/m³', desc: 'Nitrogen dioxide' },
    { name: 'SO₂', value: airQuality.so2, unit: 'µg/m³', desc: 'Sulfur dioxide' },
    { name: 'CO', value: airQuality.co, unit: 'µg/m³', desc: 'Carbon monoxide' },
  ];

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-100 font-['Plus_Jakarta_Sans'] tracking-tight">
            Air Quality Index
          </h2>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
          style={{
            color: airQuality.color,
            borderColor: `${airQuality.color}40`,
            backgroundColor: `${airQuality.color}15`,
          }}
        >
          {airQuality.label} (AQI {airQuality.aqi})
        </span>
      </div>

      {/* Visual meter bar */}
      <div className="mb-4">
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(10, aqiPercentage)}%`,
              backgroundColor: airQuality.color,
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>Good</span>
          <span>Fair</span>
          <span>Moderate</span>
          <span>Poor</span>
          <span>Very Poor</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        {airQuality.summary}
      </p>

      {/* Breakdown grid of pollutants */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-white/5">
        {pollutants.map((p) => (
          <div key={p.name} className="p-2 rounded-lg bg-slate-950/40 border border-white/5 text-center">
            <div className="text-[11px] font-semibold text-slate-300">{p.name}</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5 tabular-nums">
              {p.value.toFixed(1)}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">{p.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
