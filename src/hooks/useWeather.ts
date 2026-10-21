import { useState, useEffect, useCallback, useRef } from 'react';
import { NormalizedWeatherData, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { fetchWeatherData, getActiveApiKey } from '../services/weatherService';

const STORAGE_LAST_CITY = 'atmosphere_last_city';
const STORAGE_TEMP_UNIT = 'atmosphere_temp_unit';
const STORAGE_WIND_UNIT = 'atmosphere_wind_unit';
const STORAGE_FAVORITES = 'atmosphere_favorites';
const STORAGE_RECENTS = 'atmosphere_recents';

export function useWeather(initialCity: string = 'Tokyo') {
  const [currentCity, setCurrentCity] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_LAST_CITY) || initialCity;
    }
    return initialCity;
  });

  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(STORAGE_TEMP_UNIT) as TemperatureUnit) || 'celsius';
    }
    return 'celsius';
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(STORAGE_WIND_UNIT) as WindSpeedUnit) || 'kmh';
    }
    return 'kmh';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_FAVORITES);
        return stored ? JSON.parse(stored) : ['Tokyo', 'London', 'New York', 'Paris', 'Sydney'];
      } catch {
        return ['Tokyo', 'London', 'New York', 'Paris', 'Sydney'];
      }
    }
    return ['Tokyo', 'London', 'New York', 'Paris', 'Sydney'];
  });

  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_RECENTS);
        return stored ? JSON.parse(stored) : ['Tokyo', 'London', 'New York'];
      } catch {
        return ['Tokyo', 'London', 'New York'];
      }
    }
    return ['Tokyo', 'London', 'New York'];
  });

  const [weatherData, setWeatherData] = useState<NormalizedWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => !!getActiveApiKey());

  // Ref to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync state to localStorage
  const updateUnit = useCallback((newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_TEMP_UNIT, newUnit);
    }
  }, []);

  const updateWindUnit = useCallback((newUnit: WindSpeedUnit) => {
    setWindUnit(newUnit);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_WIND_UNIT, newUnit);
    }
  }, []);

  const toggleFavorite = useCallback((city: string) => {
    setFavorites((prev) => {
      const exists = prev.some((c) => c.toLowerCase() === city.toLowerCase());
      const next = exists
        ? prev.filter((c) => c.toLowerCase() !== city.toLowerCase())
        : [...prev, city];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const addRecent = useCallback((city: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const next = [city, ...filtered].slice(0, 8);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_RECENTS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  /**
   * Main fetch handler for city or coordinates
   */
  const loadWeather = useCallback(async (
    target: string | { lat: number; lon: number },
    forceRefresh: boolean = false
  ) => {
    // If it's the exact same city and not forced, we can preserve
    if (
      !forceRefresh &&
      typeof target === 'string' &&
      weatherData &&
      weatherData.city.toLowerCase() === target.toLowerCase() &&
      !error
    ) {
      return;
    }

    // Cancel pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(target, controller.signal);
      setWeatherData(data);
      setCurrentCity(data.city);

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_LAST_CITY, data.city);
      }
      addRecent(data.city);
      setHasApiKey(!!getActiveApiKey());
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(err.message || 'Unable to retrieve weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [weatherData, error, addRecent]);

  /**
   * Request weather using browser Geolocation or IP location fallback
   */
  const loadCurrentLocation = useCallback(async () => {
    setIsLocating(true);
    setError(null);

    const tryIpFallback = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data.success && (data.city || (data.latitude && data.longitude))) {
            if (data.latitude && data.longitude) {
              await loadWeather({ lat: data.latitude, lon: data.longitude }, true);
            } else {
              await loadWeather(data.city, true);
            }
            setIsLocating(false);
            return true;
          }
        }
      } catch {
        // Fallback to secondary service
      }

      try {
        const res2 = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
        if (res2.ok) {
          const data2 = await res2.json();
          const city = data2.city || data2.locality || data2.principalSubdivision;
          if (city) {
            await loadWeather(city, true);
            setIsLocating(false);
            return true;
          }
        }
      } catch {
        // Continue
      }

      setIsLocating(false);
      setError('Unable to detect your location automatically. Please search for your city.');
      return false;
    };

    if (!navigator.geolocation) {
      await tryIpFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await loadWeather({ lat: latitude, lon: longitude }, true);
        } finally {
          setIsLocating(false);
        }
      },
      async () => {
        // On permission denied or timeout (e.g. in sandbox iframes), fall back to IP location
        await tryIpFallback();
      },
      { timeout: 6000, enableHighAccuracy: false }
    );
  }, [loadWeather]);

  // Initial load
  useEffect(() => {
    loadWeather(currentCity);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refreshWeather = useCallback(() => {
    if (weatherData) {
      loadWeather(weatherData.city, true);
    } else {
      loadWeather(currentCity, true);
    }
  }, [weatherData, currentCity, loadWeather]);

  return {
    weatherData,
    loading,
    isLocating,
    error,
    currentCity,
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
  };
}
