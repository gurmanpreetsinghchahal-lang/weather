import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { appTheme } from './theme/theme';
import { useWeather } from './hooks/useWeather';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FavoritesBar } from './components/FavoritesBar';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherMetrics } from './components/WeatherMetrics';
import { HourlyForecast } from './components/HourlyForecast';
import { FiveDayForecast } from './components/FiveDayForecast';
import { AirQualityCard } from './components/AirQualityCard';
import { SunTracker } from './components/SunTracker';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { ApiKeyModal } from './components/ApiKeyModal';
import { getAtmosphericTheme } from './utils/weatherUtils';
import { Sparkles } from 'lucide-react';

export default function App() {
  const {
    weatherData,
    loading,
    isLocating,
    error,
    unit,
    windUnit,
    favorites,
    recents,
    hasApiKey,
    loadWeather,
    loadCurrentLocation,
    updateUnit,
    updateWindUnit,
    toggleFavorite,
    refreshWeather,
    setHasApiKey,
  } = useWeather('Tokyo');

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Dynamic atmospheric theme
  const atmosphere = weatherData
    ? getAtmosphericTheme(weatherData.condition, weatherData.isDaytime)
    : {
        bgGradient: 'from-[#0B0F19] via-[#0D1527] to-[#0A1120]',
        accentColor: '#38BDF8',
        cardBg: 'rgba(15, 23, 42, 0.7)',
        glowColor: 'rgba(56, 189, 248, 0.12)',
      };

  const isFavorite = weatherData
    ? favorites.some((f) => f.toLowerCase() === weatherData.city.toLowerCase())
    : false;

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />

      {/* Atmospheric dynamic canvas wrapper */}
      <div className={`min-h-screen bg-gradient-to-b ${atmosphere.bgGradient} text-slate-100 font-['Plus_Jakarta_Sans'] transition-colors duration-700 selection:bg-sky-500/30 selection:text-sky-200 relative`}>
        {/* Soft atmospheric ambient light rings */}
        <div
          className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none -z-10 transition-all duration-1000"
          style={{ backgroundColor: atmosphere.glowColor }}
        />
        <div
          className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10 transition-all duration-1000"
          style={{ backgroundColor: atmosphere.glowColor }}
        />

        {/* Global Navigation Header */}
        <Header
          unit={unit}
          onToggleUnit={updateUnit}
          windUnit={windUnit}
          onToggleWindUnit={updateWindUnit}
          onRefresh={refreshWeather}
          isLoading={loading}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={hasApiKey}
          source={weatherData?.source ?? 'demo_station'}
        />

        {/* Main Content Viewport */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Top Search & Location Control Area */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <SearchBar
              onSelectCity={(city) => loadWeather(city)}
              onUseCurrentLocation={loadCurrentLocation}
              isLoading={loading}
              isLocating={isLocating}
            />

            {/* Pinned Favorites Quick Bar */}
            <div className="w-full md:w-auto">
              <FavoritesBar
                favorites={favorites}
                recents={recents}
                activeCity={weatherData?.city ?? ''}
                onSelectCity={(city) => loadWeather(city)}
                onRemoveFavorite={toggleFavorite}
              />
            </div>
          </div>

          {/* Demo Mode Notice Banner if no custom key is configured */}
          {weatherData?.source === 'demo_station' && !hasApiKey && (
            <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-200 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-sky-400 shrink-0" />
                <span>
                  <strong>Curated Station Mode:</strong> Exploring high-accuracy stations (Tokyo, London, New York, Paris, Sydney, Dubai, San Francisco). Connect your free OpenWeather API key anytime for live global queries.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 font-semibold transition-colors shrink-0 whitespace-nowrap text-[11px]"
              >
                Add Your API Key
              </button>
            </div>
          )}

          {/* Error Banner (if any) */}
          {error && (
            <ErrorMessage
              message={error}
              onRetry={refreshWeather}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              onSelectCity={(c) => loadWeather(c)}
            />
          )}

          {/* Loading Skeleton */}
          {loading && !weatherData && <LoadingSkeleton />}

          {/* Weather Content Sections */}
          {weatherData && (
            <div className="space-y-6">
              {/* 1. Hero Card: Current Weather Overview */}
              <CurrentWeather
                data={weatherData}
                unit={unit}
                isFavorite={isFavorite}
                onToggleFavorite={() => toggleFavorite(weatherData.city)}
              />

              {/* 2. Weather Metrics Grid */}
              <WeatherMetrics
                data={weatherData}
                unit={unit}
                windUnit={windUnit}
              />

              {/* 3. Split Layout: Left (Forecasts) and Right (Air Quality & Solar Tracker) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 7 Columns: Hourly & 5-Day Forecasts */}
                <div className="lg:col-span-7 space-y-6">
                  <HourlyForecast
                    hourly={weatherData.hourly}
                    unit={unit}
                    windUnit={windUnit}
                  />

                  <FiveDayForecast
                    daily={weatherData.daily}
                    unit={unit}
                    windUnit={windUnit}
                  />
                </div>

                {/* Right 5 Columns: Air Quality & Sun Tracker */}
                <div className="lg:col-span-5 space-y-6">
                  {weatherData.airQuality && (
                    <AirQualityCard airQuality={weatherData.airQuality} />
                  )}

                  <SunTracker data={weatherData} />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 mt-12 bg-slate-950/40 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">SKYORA</span>
              <span>·</span>
              <span>Real-Time Atmospheric Intelligence</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Powered by OpenWeatherMap API</span>
            </div>
          </div>
        </footer>

        {/* OpenWeather API Key Modal */}
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onKeyUpdated={() => {
            refreshWeather();
          }}
        />
      </div>
    </ThemeProvider>
  );
}
