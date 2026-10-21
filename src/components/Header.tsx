import { CloudSun, RotateCw, Compass } from 'lucide-react';
import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  windUnit: WindSpeedUnit;
  onToggleWindUnit: (unit: WindSpeedUnit) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  source: 'live_api' | 'demo_station';
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  windUnit,
  onToggleWindUnit,
  onRefresh,
  isLoading,
  onOpenApiKeyModal,
  hasApiKey,
  source,
}) => {
  return (
    <header className="w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone: Single element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CloudSun size={20} className="text-sky-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-['Plus_Jakarta_Sans'] whitespace-nowrap">
              SKYORA
            </span>
          </div>
        </div>

        {/* Center / Action Controls: Unit toggles & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Wind Speed Unit Toggle */}
          <button
            type="button"
            onClick={() => {
              const next: WindSpeedUnit = windUnit === 'kmh' ? 'mph' : windUnit === 'mph' ? 'ms' : 'kmh';
              onToggleWindUnit(next);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors whitespace-nowrap"
            title="Toggle wind speed unit (km/h, mph, m/s)"
          >
            <Compass size={13} className="text-sky-400 shrink-0" />
            <span className="uppercase">{windUnit}</span>
          </button>

          {/* Temperature Unit Segmented Control */}
          <div className="flex items-center p-0.5 bg-slate-900/80 border border-slate-700/60 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => onToggleUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                unit === 'celsius'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Switch to Celsius"
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                unit === 'fahrenheit'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Switch to Fahrenheit"
            >
              °F
            </button>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-all disabled:opacity-50 shrink-0"
            title="Refresh weather data"
            aria-label="Refresh current weather"
          >
            <RotateCw size={15} className={isLoading ? 'animate-spin text-sky-400' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
};
