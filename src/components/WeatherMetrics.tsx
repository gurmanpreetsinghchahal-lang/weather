import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Cloud,
  Compass,
  Activity,
} from 'lucide-react';
import { NormalizedWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import {
  formatTemp,
  formatWindSpeed,
  getWindDirection,
  formatVisibility,
  getPressureStatus,
} from '../utils/weatherUtils';

interface WeatherMetricsProps {
  data: NormalizedWeatherData;
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({
  data,
  unit,
  windUnit,
}) => {
  const windDir = getWindDirection(data.windDirectionDeg);
  const visibilityInfo = formatVisibility(data.visibilityMeters, unit);
  const pressureStatus = getPressureStatus(data.pressureHpa);

  const metrics = [
    {
      title: 'Feels Like',
      value: formatTemp(data.feelsLikeC, unit),
      subtext: `Actual: ${formatTemp(data.currentTempC, unit)}`,
      icon: Thermometer,
      accent: 'text-amber-400',
      bgGlow: 'hover:border-amber-500/30',
    },
    {
      title: 'Humidity',
      value: `${data.humidity}%`,
      subtext: `Dew point: ${formatTemp(data.dewPointC, unit)}`,
      icon: Droplets,
      accent: 'text-sky-400',
      bgGlow: 'hover:border-sky-500/30',
    },
    {
      title: 'Wind',
      value: formatWindSpeed(data.windSpeedMs, windUnit),
      subtext: `${windDir} (${data.windDirectionDeg}°)`,
      icon: Wind,
      accent: 'text-teal-400',
      bgGlow: 'hover:border-teal-500/30',
    },
    {
      title: 'Pressure',
      value: `${data.pressureHpa} hPa`,
      subtext: pressureStatus,
      icon: Gauge,
      accent: 'text-indigo-400',
      bgGlow: 'hover:border-indigo-500/30',
    },
    {
      title: 'Visibility',
      value: visibilityInfo.text,
      subtext: visibilityInfo.description,
      icon: Eye,
      accent: 'text-cyan-400',
      bgGlow: 'hover:border-cyan-500/30',
    },
    {
      title: 'Cloud Cover',
      value: `${data.cloudCoverPct}%`,
      subtext: data.cloudCoverPct > 70 ? 'Overcast sky' : data.cloudCoverPct > 30 ? 'Partly cloudy' : 'Clear skies',
      icon: Cloud,
      accent: 'text-slate-300',
      bgGlow: 'hover:border-slate-400/30',
    },
    {
      title: 'Wind Direction',
      value: `${windDir}`,
      subtext: `Heading: ${data.windDirectionDeg}°`,
      icon: Compass,
      accent: 'text-emerald-400',
      bgGlow: 'hover:border-emerald-500/30',
    },
    {
      title: 'Air Quality',
      value: data.airQuality ? data.airQuality.label : 'Normal',
      subtext: data.airQuality ? `AQI ${data.airQuality.aqi} / 5` : 'No stations nearby',
      icon: Activity,
      accent: data.airQuality?.color ? `text-[${data.airQuality.color}]` : 'text-emerald-400',
      bgGlow: 'hover:border-emerald-500/30',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-semibold text-slate-200 tracking-tight font-['Plus_Jakarta_Sans']">
          Current Atmospheric Metrics
        </h2>
        <span className="text-xs text-slate-400 font-mono">Real-time readings</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 transition-all duration-200 hover:-translate-y-0.5 ${item.bgGlow} shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{item.title}</span>
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <Icon size={16} className={item.accent} />
                </div>
              </div>

              <div className="mt-2 text-xl sm:text-2xl font-bold text-white font-mono tracking-tight tabular-nums">
                {item.value}
              </div>

              <div className="mt-1 text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                {item.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
