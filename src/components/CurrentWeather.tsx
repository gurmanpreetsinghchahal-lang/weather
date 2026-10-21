import React from 'react';
import { Star, Sunrise, Sunset, Umbrella, ArrowDown, ArrowUp } from 'lucide-react';
import { NormalizedWeatherData, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  formatTemp,
  getContextualGreeting,
  getWeatherAdvisor,
  formatTimeAgoOrUntil,
} from '../utils/weatherUtils';

interface CurrentWeatherProps {
  data: NormalizedWeatherData;
  unit: TemperatureUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  unit,
  isFavorite,
  onToggleFavorite,
}) => {
  // Extract local hour for greeting
  const localTargetMs = (data.sunriseTimestamp + data.timezoneOffset) * 1000;
  const currentNowSec = Math.floor(Date.now() / 1000);
  const nowAdjustedDate = new Date((currentNowSec + data.timezoneOffset) * 1000);
  const currentHour = nowAdjustedDate.getUTCHours();
  const greeting = getContextualGreeting(currentHour, data.city);

  const advisor = getWeatherAdvisor(
    data.currentTempC,
    data.condition,
    data.hourly?.[0]?.pop ?? 0,
    data.windSpeedMs
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl transition-all">
      {/* Ambient background glow accent based on condition */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Bar: City, Country, Local Time, Favorite Action */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
              {data.city}
            </h1>
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded-md">
              {data.country}
            </span>
            <button
              type="button"
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition-colors"
              aria-label="Toggle favorite city"
            >
              <Star
                size={20}
                className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-slate-200'}
              />
            </button>
          </div>

          {/* Clean unboxed metadata with dot separators */}
          <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-slate-300">
            <span>{data.localDateFormatted}</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="font-mono tabular-nums">{data.localTimeFormatted} local time</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-300 capitalize">{greeting}</span>
          </div>
        </div>

        {/* Data Source indicator */}
        <div className="hidden sm:flex items-center text-xs text-slate-400">
          <span className="font-mono text-[11px] bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
            {data.source === 'live_api' ? 'Live OpenWeather' : 'Curated Station'}
          </span>
        </div>
      </div>

      {/* Main Temperature & Weather Hero Cluster */}
      <div className="relative z-10 mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
        {/* Left Column: Huge Temperature & Condition */}
        <div className="md:col-span-7 flex items-center gap-6 sm:gap-8">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0">
            <WeatherIcon
              iconCode={data.icon}
              condition={data.condition}
              isDaytime={data.isDaytime}
              size={64}
              className="sm:w-20 sm:h-20"
            />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-8xl font-black tracking-tighter text-white font-['Plus_Jakarta_Sans'] tabular-nums">
                {formatTemp(data.currentTempC, unit)}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg sm:text-xl font-semibold text-slate-100 capitalize">
                {data.description || data.condition}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs sm:text-sm text-slate-400 font-mono tabular-nums">
              <span>Feels like {formatTemp(data.feelsLikeC, unit)}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="flex items-center gap-0.5 text-sky-400">
                <ArrowDown size={14} />
                {formatTemp(data.tempMinC, unit)}
              </span>
              <span className="flex items-center gap-0.5 text-amber-400">
                <ArrowUp size={14} />
                {formatTemp(data.tempMaxC, unit)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Sunrise, Sunset, and Ephemeris */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/40 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Sunrise size={22} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Sunrise</div>
              <div className="text-sm sm:text-base font-semibold text-white font-mono tabular-nums">
                {data.sunriseTime}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {formatTimeAgoOrUntil(data.sunriseTimestamp, currentNowSec)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Sunset size={22} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Sunset</div>
              <div className="text-sm sm:text-base font-semibold text-white font-mono tabular-nums">
                {data.sunsetTime}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {formatTimeAgoOrUntil(data.sunsetTimestamp, currentNowSec)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Contextual Weather Advisor Strip */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
            <Umbrella size={16} />
          </div>
          <div>
            <span className="font-semibold text-slate-200">Recommendation: </span>
            <span>{advisor.clothing}</span>
            <span className="hidden md:inline"> — {advisor.activity}</span>
          </div>
        </div>

        {advisor.alert && (
          <div className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            {advisor.alert}
          </div>
        )}
      </div>
    </div>
  );
};
