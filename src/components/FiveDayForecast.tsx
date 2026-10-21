import React from 'react';
import { Droplets, Wind } from 'lucide-react';
import { DailyForecastData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemp, formatWindSpeed } from '../utils/weatherUtils';

interface FiveDayForecastProps {
  daily: DailyForecastData[];
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const FiveDayForecast: React.FC<FiveDayForecastProps> = ({
  daily,
  unit,
  windUnit,
}) => {
  if (!daily || daily.length === 0) return null;

  // Calculate overall min and max across all days to render relative temperature range bars
  const allMins = daily.map((d) => d.tempMinC);
  const allMaxs = daily.map((d) => d.tempMaxC);
  const absoluteMin = Math.min(...allMins);
  const absoluteMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, absoluteMax - absoluteMin);

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 font-['Plus_Jakarta_Sans'] tracking-tight">
            5-Day Outlook
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Extended daily weather projection</p>
        </div>
      </div>

      <div className="space-y-3">
        {daily.map((day, idx) => {
          // Calculate percentage width for visual temperature bar
          const leftPercent = ((day.tempMinC - absoluteMin) / tempRange) * 100;
          const barWidthPercent = Math.max(12, ((day.tempMaxC - day.tempMinC) / tempRange) * 100);

          return (
            <div
              key={`${day.timestamp}-${idx}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/15 transition-all gap-2 sm:gap-4"
            >
              {/* Day & Date info */}
              <div className="w-full sm:w-36 shrink-0 flex items-center justify-between sm:justify-start gap-2">
                <span className="font-semibold text-sm text-slate-100">
                  {day.dayOfWeek}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {day.date.split(',')[1] || day.date}
                </span>
              </div>

              {/* Weather Condition & Icon */}
              <div className="flex items-center gap-2.5 w-full sm:w-48 shrink-0">
                <WeatherIcon
                  iconCode={day.icon}
                  condition={day.condition}
                  size={24}
                  className="shrink-0"
                />
                <span className="text-xs text-slate-300 capitalize truncate">
                  {day.description || day.condition}
                </span>
              </div>

              {/* Rain Chance & Wind Info */}
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono shrink-0">
                {day.pop > 0 && (
                  <div className="flex items-center gap-1 text-sky-400" title="Chance of rain">
                    <Droplets size={13} />
                    <span>{day.pop}%</span>
                  </div>
                )}
                <div className="hidden md:flex items-center gap-1 text-slate-400">
                  <Wind size={13} />
                  <span>{formatWindSpeed(day.windSpeedMs, windUnit)}</span>
                </div>
              </div>

              {/* Temperature Spectrum Bar */}
              <div className="flex-1 flex items-center gap-3 max-w-xs sm:ml-auto w-full">
                <span className="text-xs font-mono font-medium text-sky-400 w-8 text-right tabular-nums">
                  {formatTemp(day.tempMinC, unit)}
                </span>

                <div className="flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                    style={{
                      left: `${Math.max(0, leftPercent)}%`,
                      width: `${Math.min(100 - leftPercent, barWidthPercent)}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-mono font-medium text-amber-400 w-8 text-left tabular-nums">
                  {formatTemp(day.tempMaxC, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
