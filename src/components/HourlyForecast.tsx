import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { HourlyForecastData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemp, formatWindSpeed } from '../utils/weatherUtils';

interface HourlyForecastProps {
  hourly: HourlyForecastData[];
  unit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  unit,
  windUnit,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!hourly || hourly.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 font-['Plus_Jakarta_Sans'] tracking-tight">
            Hourly Forecast
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Upcoming conditions in 3-hour increments</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition-colors"
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition-colors"
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
      >
        {hourly.map((item, idx) => {
          const isFirst = idx === 0;
          return (
            <div
              key={`${item.timestamp}-${idx}`}
              className={`flex-shrink-0 w-28 sm:w-32 flex flex-col items-center justify-between p-3.5 rounded-xl border transition-all text-center ${
                isFirst
                  ? 'bg-sky-500/10 border-sky-500/40 shadow-md shadow-sky-500/10'
                  : 'bg-slate-950/40 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Local Time */}
              <div className="text-xs font-medium text-slate-300 font-mono">
                {isFirst ? 'Now' : item.time}
              </div>

              {/* Weather Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  iconCode={item.icon}
                  condition={item.condition}
                  size={32}
                  className="mx-auto"
                />
              </div>

              {/* Temperature */}
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {formatTemp(item.tempC, unit)}
              </div>

              {/* Condition description snippet */}
              <div className="text-[11px] text-slate-400 capitalize truncate w-full mt-0.5">
                {item.condition}
              </div>

              {/* Rain Pop & Wind */}
              <div className="mt-2.5 pt-2 border-t border-white/5 w-full flex items-center justify-around text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-0.5 text-sky-400" title="Precipitation chance">
                  <Droplets size={11} />
                  <span>{item.pop}%</span>
                </div>
                <div className="flex items-center gap-0.5 text-slate-400" title="Wind speed">
                  <Wind size={11} />
                  <span>{formatWindSpeed(item.windSpeedMs, windUnit)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
