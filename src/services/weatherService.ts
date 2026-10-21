import {
  CurrentWeatherRaw,
  ForecastRaw,
  AirPollutionRaw,
  GeocodingResult,
  NormalizedWeatherData,
  HourlyForecastData,
  DailyForecastData,
  AirQualityData,
} from '../types/weather';
import {
  calculateDewPoint,
  formatLocalTime,
  normalizeAirQuality,
} from '../utils/weatherUtils';

const BASE_URL = 'https://api.openweathermap.org';
const STORAGE_KEY_API_KEY = 'openweather_custom_api_key';

/**
 * Retrieve current active API key (from localStorage or environment variable)
 */
export function getActiveApiKey(): string {
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (customKey && customKey.trim().length > 0) {
      return customKey.trim();
    }
  }
  const envKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (envKey && envKey !== 'your_api_key_here' && envKey !== 'your_openweather_api_key_here') {
    return envKey.trim();
  }
  return '';
}

/**
 * Save user custom API key to localStorage
 */
export function saveCustomApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim().length > 0) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  }
}

/**
 * Clear custom API key
 */
export function clearCustomApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  }
}

/**
 * Curated real-world station dataset for fallback / immediate demo experience
 */
const CURATED_STATIONS: Record<string, Partial<NormalizedWeatherData>> = {
  'tokyo': {
    city: 'Tokyo',
    country: 'JP',
    coordinates: { lat: 35.6762, lon: 139.6503 },
    timezoneOffset: 32400, // UTC+9
    currentTempC: 19,
    feelsLikeC: 18,
    tempMinC: 14,
    tempMaxC: 22,
    condition: 'Clear',
    description: 'clear sky with gentle breeze',
    icon: '01d',
    humidity: 48,
    windSpeedMs: 3.6,
    windDirectionDeg: 120,
    pressureHpa: 1016,
    visibilityMeters: 10000,
    cloudCoverPct: 8,
    dewPointC: 8.5,
    precipitationMm: 0,
    airQuality: {
      aqi: 2,
      label: 'Fair',
      color: '#84CC16',
      summary: 'Acceptable air quality with minor particulate matter.',
      pm2_5: 14.8,
      pm10: 22.3,
      o3: 54.0,
      no2: 28.1,
      so2: 4.2,
      co: 260,
    },
  },
  'london': {
    city: 'London',
    country: 'GB',
    coordinates: { lat: 51.5074, lon: -0.1278 },
    timezoneOffset: 3600, // BST UTC+1
    currentTempC: 13,
    feelsLikeC: 11,
    tempMinC: 9,
    tempMaxC: 15,
    condition: 'Rain',
    description: 'light intermittent rain',
    icon: '10d',
    humidity: 82,
    windSpeedMs: 5.8,
    windDirectionDeg: 230,
    pressureHpa: 1008,
    visibilityMeters: 8500,
    cloudCoverPct: 75,
    dewPointC: 10.1,
    precipitationMm: 1.8,
    airQuality: {
      aqi: 2,
      label: 'Fair',
      color: '#84CC16',
      summary: 'Moderate traffic emissions across central boroughs.',
      pm2_5: 16.2,
      pm10: 25.1,
      o3: 42.0,
      no2: 38.5,
      so2: 5.6,
      co: 310,
    },
  },
  'new york': {
    city: 'New York',
    country: 'US',
    coordinates: { lat: 40.7128, lon: -74.0060 },
    timezoneOffset: -14400, // EDT UTC-4
    currentTempC: 16,
    feelsLikeC: 15,
    tempMinC: 11,
    tempMaxC: 18,
    condition: 'Clouds',
    description: 'scattered clouds over metropolitan area',
    icon: '03d',
    humidity: 55,
    windSpeedMs: 4.2,
    windDirectionDeg: 310,
    pressureHpa: 1018,
    visibilityMeters: 10000,
    cloudCoverPct: 40,
    dewPointC: 7.2,
    precipitationMm: 0,
    airQuality: {
      aqi: 1,
      label: 'Good',
      color: '#10B981',
      summary: 'Crisp coastal air with low ambient particulate concentration.',
      pm2_5: 8.5,
      pm10: 14.0,
      o3: 46.2,
      no2: 19.8,
      so2: 2.9,
      co: 220,
    },
  },
  'paris': {
    city: 'Paris',
    country: 'FR',
    coordinates: { lat: 48.8566, lon: 2.3522 },
    timezoneOffset: 7200, // CEST UTC+2
    currentTempC: 15,
    feelsLikeC: 14,
    tempMinC: 10,
    tempMaxC: 17,
    condition: 'Clouds',
    description: 'broken cloud ceiling with mild sunbreaks',
    icon: '04d',
    humidity: 68,
    windSpeedMs: 3.1,
    windDirectionDeg: 190,
    pressureHpa: 1014,
    visibilityMeters: 10000,
    cloudCoverPct: 62,
    dewPointC: 9.3,
    precipitationMm: 0,
    airQuality: {
      aqi: 2,
      label: 'Fair',
      color: '#84CC16',
      summary: 'Typical urban background levels in Île-de-France.',
      pm2_5: 18.0,
      pm10: 26.4,
      o3: 49.0,
      no2: 34.2,
      so2: 4.1,
      co: 290,
    },
  },
  'sydney': {
    city: 'Sydney',
    country: 'AU',
    coordinates: { lat: -33.8688, lon: 151.2093 },
    timezoneOffset: 39600, // AEDT UTC+11
    currentTempC: 22,
    feelsLikeC: 22,
    tempMinC: 16,
    tempMaxC: 25,
    condition: 'Clear',
    description: 'sunny harbor conditions',
    icon: '01d',
    humidity: 58,
    windSpeedMs: 6.2,
    windDirectionDeg: 80,
    pressureHpa: 1020,
    visibilityMeters: 10000,
    cloudCoverPct: 15,
    dewPointC: 13.5,
    precipitationMm: 0,
    airQuality: {
      aqi: 1,
      label: 'Good',
      color: '#10B981',
      summary: 'Clean Pacific ocean breeze along coastal basins.',
      pm2_5: 6.2,
      pm10: 11.8,
      o3: 38.0,
      no2: 12.1,
      so2: 2.1,
      co: 180,
    },
  },
  'san francisco': {
    city: 'San Francisco',
    country: 'US',
    coordinates: { lat: 37.7749, lon: -122.4194 },
    timezoneOffset: -25200, // PDT UTC-7
    currentTempC: 14,
    feelsLikeC: 13,
    tempMinC: 11,
    tempMaxC: 18,
    condition: 'Mist',
    description: 'coastal marine layer fog clearing by afternoon',
    icon: '50d',
    humidity: 84,
    windSpeedMs: 5.1,
    windDirectionDeg: 270,
    pressureHpa: 1015,
    visibilityMeters: 6000,
    cloudCoverPct: 70,
    dewPointC: 11.3,
    precipitationMm: 0,
    airQuality: {
      aqi: 1,
      label: 'Good',
      color: '#10B981',
      summary: 'Marine inflow clears inland smog from the Bay Area.',
      pm2_5: 7.1,
      pm10: 13.5,
      o3: 35.0,
      no2: 16.5,
      so2: 2.0,
      co: 200,
    },
  },
  'dubai': {
    city: 'Dubai',
    country: 'AE',
    coordinates: { lat: 25.2048, lon: 55.2708 },
    timezoneOffset: 14400, // GST UTC+4
    currentTempC: 32,
    feelsLikeC: 35,
    tempMinC: 26,
    tempMaxC: 36,
    condition: 'Clear',
    description: 'warm and clear Arabian skies',
    icon: '01d',
    humidity: 46,
    windSpeedMs: 4.5,
    windDirectionDeg: 340,
    pressureHpa: 1010,
    visibilityMeters: 9000,
    cloudCoverPct: 5,
    dewPointC: 19.1,
    precipitationMm: 0,
    airQuality: {
      aqi: 3,
      label: 'Moderate',
      color: '#F59E0B',
      summary: 'Elevated airborne mineral dust from coastal desert winds.',
      pm2_5: 42.0,
      pm10: 88.0,
      o3: 68.0,
      no2: 39.0,
      so2: 12.0,
      co: 410,
    },
  },
};

/**
 * Generate synthetic realistic hourly & daily forecast for curated stations
 */
function generateCuratedForecast(base: Partial<NormalizedWeatherData>): {
  hourly: HourlyForecastData[];
  daily: DailyForecastData[];
} {
  const currentTemp = base.currentTempC ?? 18;
  const now = Math.floor(Date.now() / 1000);
  const tzOffset = base.timezoneOffset ?? 0;

  const hourly: HourlyForecastData[] = [];
  for (let i = 1; i <= 8; i++) {
    const timeSec = now + i * 3 * 3600;
    // Diurnal variation wave
    const tempOffset = Math.sin((i / 8) * Math.PI * 2) * 3;
    const itemTemp = Math.round(currentTemp + tempOffset);
    const pop = (base.condition === 'Rain' ? 65 : 10) + Math.round(Math.random() * 15);

    hourly.push({
      time: formatLocalTime(timeSec, tzOffset, 'time'),
      timestamp: timeSec,
      tempC: itemTemp,
      feelsLikeC: itemTemp - 1,
      condition: base.condition ?? 'Clear',
      description: base.description ?? 'clear sky',
      icon: base.icon ?? '01d',
      pop: Math.min(100, Math.max(0, pop)),
      windSpeedMs: Math.round(((base.windSpeedMs ?? 4) + (Math.random() - 0.5)) * 10) / 10,
      humidity: Math.min(100, Math.max(20, (base.humidity ?? 60) + Math.round((Math.random() - 0.5) * 10))),
    });
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daily: DailyForecastData[] = [];

  for (let d = 0; d < 5; d++) {
    const daySec = now + d * 86400;
    const targetMs = (daySec + tzOffset) * 1000;
    const dateObj = new Date(targetMs);
    const dayName = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : daysOfWeek[dateObj.getUTCDay()];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${dayName}, ${months[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}`;

    const delta = (d % 2 === 0 ? 1 : -1) * (d * 0.8);
    const minC = Math.round((base.tempMinC ?? 12) + delta);
    const maxC = Math.round((base.tempMaxC ?? 20) + delta);

    daily.push({
      date: formattedDate,
      dayOfWeek: dayName,
      timestamp: daySec,
      tempMinC: minC,
      tempMaxC: Math.max(minC + 3, maxC),
      condition: d === 2 && base.condition !== 'Rain' ? 'Clouds' : base.condition ?? 'Clear',
      description: base.description ?? 'clear sky',
      icon: base.icon ?? '01d',
      pop: base.condition === 'Rain' ? 70 - d * 10 : 15 + d * 5,
      humidity: base.humidity ?? 60,
      windSpeedMs: base.windSpeedMs ?? 4.0,
    });
  }

  return { hourly, daily };
}

function buildCuratedStation(
  cityQuery: string,
  customCountry?: string,
  customCoords?: { lat: number; lon: number }
): NormalizedWeatherData {
  const normalizedKey = cityQuery.toLowerCase().trim();
  const station = CURATED_STATIONS[normalizedKey] || CURATED_STATIONS['tokyo'];
  const now = Math.floor(Date.now() / 1000);
  // If custom city, use local browser timezone offset or station tz
  const localTzOffset = -new Date().getTimezoneOffset() * 60;
  const tz = customCoords ? localTzOffset : (station.timezoneOffset ?? localTzOffset);
  const { hourly, daily } = generateCuratedForecast(station);

  const localTimeFormatted = formatLocalTime(now, tz, 'time');
  const localDateFormatted = formatLocalTime(now, tz, 'date');

  // Realistic sunrise / sunset
  const sunriseTs = now - 18000;
  const sunsetTs = now + 25200;
  const sunriseTime = formatLocalTime(sunriseTs, tz, 'time');
  const sunsetTime = formatLocalTime(sunsetTs, tz, 'time');

  return {
    city: customCoords ? cityQuery : (station.city ?? cityQuery),
    country: customCountry || station.country || 'GLOBAL',
    coordinates: customCoords || station.coordinates || { lat: 35.6762, lon: 139.6503 },
    timezoneOffset: tz,
    localTimeFormatted,
    localDateFormatted,
    currentTempC: station.currentTempC ?? 20,
    feelsLikeC: station.feelsLikeC ?? 19,
    tempMinC: station.tempMinC ?? 15,
    tempMaxC: station.tempMaxC ?? 22,
    condition: station.condition ?? 'Clear',
    description: station.description ?? 'clear sky',
    icon: station.icon ?? '01d',
    humidity: station.humidity ?? 55,
    windSpeedMs: station.windSpeedMs ?? 4.2,
    windDirectionDeg: station.windDirectionDeg ?? 140,
    pressureHpa: station.pressureHpa ?? 1015,
    visibilityMeters: station.visibilityMeters ?? 10000,
    cloudCoverPct: station.cloudCoverPct ?? 10,
    dewPointC: station.dewPointC ?? calculateDewPoint(station.currentTempC ?? 20, station.humidity ?? 55),
    precipitationMm: station.precipitationMm ?? 0,
    sunriseTime,
    sunsetTime,
    sunriseTimestamp: sunriseTs,
    sunsetTimestamp: sunsetTs,
    isDaytime: now >= sunriseTs && now <= sunsetTs,
    hourly,
    daily,
    airQuality: station.airQuality,
    source: 'demo_station',
  };
}

/**
 * Fetch geocoding suggestions for city search autocomplete
 */
export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const apiKey = getActiveApiKey();
  if (!apiKey) {
    // Return matching curated cities
    const matches = Object.values(CURATED_STATIONS).filter(
      (s) => s.city?.toLowerCase().includes(trimmed.toLowerCase())
    );
    return matches.map((m) => ({
      name: m.city!,
      lat: m.coordinates!.lat,
      lon: m.coordinates!.lon,
      country: m.country!,
    }));
  }

  try {
    const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=5&appid=${apiKey}`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('INVALID_API_KEY');
      }
      return [];
    }
    const data: GeocodingResult[] = await res.json();
    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    return [];
  }
}

/**
 * Normalizes live 5-day / 3-hour OpenWeather forecast into hourly and daily groupings
 */
function processForecastData(
  forecast: ForecastRaw,
  timezoneOffset: number
): { hourly: HourlyForecastData[]; daily: DailyForecastData[] } {
  const hourly: HourlyForecastData[] = [];
  const daysMap = new Map<string, {
    temps: number[];
    icons: string[];
    conditions: string[];
    descriptions: string[];
    pops: number[];
    humidities: number[];
    winds: number[];
    timestamp: number;
  }>();

  // 1. Process first 8 items (next 24 hours in 3-hour increments) for Hourly Forecast
  const hourlyItems = forecast.list.slice(0, 8);
  for (const item of hourlyItems) {
    hourly.push({
      time: formatLocalTime(item.dt, timezoneOffset, 'time'),
      timestamp: item.dt,
      tempC: Math.round(item.main.temp),
      feelsLikeC: Math.round(item.main.feels_like),
      condition: item.weather[0]?.main || 'Clear',
      description: item.weather[0]?.description || '',
      icon: item.weather[0]?.icon || '01d',
      pop: Math.round((item.pop || 0) * 100),
      windSpeedMs: item.wind.speed,
      humidity: item.main.humidity,
    });
  }

  // 2. Aggregate all 40 forecast points into daily aggregates
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (const item of forecast.list) {
    const targetMs = (item.dt + timezoneOffset) * 1000;
    const dateObj = new Date(targetMs);
    const dayKey = `${dateObj.getUTCFullYear()}-${dateObj.getUTCMonth()}-${dateObj.getUTCDate()}`;

    if (!daysMap.has(dayKey)) {
      daysMap.set(dayKey, {
        temps: [],
        icons: [],
        conditions: [],
        descriptions: [],
        pops: [],
        humidities: [],
        winds: [],
        timestamp: item.dt,
      });
    }

    const dayEntry = daysMap.get(dayKey)!;
    dayEntry.temps.push(item.main.temp);
    dayEntry.icons.push(item.weather[0]?.icon || '01d');
    dayEntry.conditions.push(item.weather[0]?.main || 'Clear');
    dayEntry.descriptions.push(item.weather[0]?.description || '');
    dayEntry.pops.push(item.pop || 0);
    dayEntry.humidities.push(item.main.humidity);
    dayEntry.winds.push(item.wind.speed);
  }

  // Convert map to DailyForecastData[] (up to 5 days)
  const daily: DailyForecastData[] = [];
  let dayIndex = 0;

  for (const [, entry] of daysMap.entries()) {
    if (dayIndex >= 5) break;

    const minTemp = Math.round(Math.min(...entry.temps));
    const maxTemp = Math.round(Math.max(...entry.temps));
    const avgWind = entry.winds.reduce((a, b) => a + b, 0) / entry.winds.length;
    const avgHumidity = Math.round(entry.humidities.reduce((a, b) => a + b, 0) / entry.humidities.length);
    const maxPop = Math.round(Math.max(...entry.pops) * 100);

    // Pick midday weather condition (or middle item)
    const midIndex = Math.floor(entry.conditions.length / 2);
    const condition = entry.conditions[midIndex] || entry.conditions[0];
    const description = entry.descriptions[midIndex] || entry.descriptions[0];
    const icon = entry.icons[midIndex] || entry.icons[0];

    const targetMs = (entry.timestamp + timezoneOffset) * 1000;
    const dateObj = new Date(targetMs);
    const dayName = dayIndex === 0 ? 'Today' : dayIndex === 1 ? 'Tomorrow' : daysOfWeek[dateObj.getUTCDay()];
    const formattedDate = `${dayName}, ${months[dateObj.getUTCMonth()]} ${dateObj.getUTCDate()}`;

    daily.push({
      date: formattedDate,
      dayOfWeek: dayName,
      timestamp: entry.timestamp,
      tempMinC: minTemp,
      tempMaxC: Math.max(minTemp, maxTemp),
      condition,
      description,
      icon,
      pop: maxPop,
      humidity: avgHumidity,
      windSpeedMs: Math.round(avgWind * 10) / 10,
    });

    dayIndex++;
  }

  return { hourly, daily };
}

/**
 * Fetch complete real-time weather, forecast, and air pollution from OpenWeatherMap REST API
 */
export async function fetchWeatherData(
  query: string | { lat: number; lon: number },
  signal?: AbortSignal
): Promise<NormalizedWeatherData> {
  const apiKey = getActiveApiKey();

  // If no API key configured, check if city exists in curated stations or reverse-geocode coordinates
  if (!apiKey) {
    if (typeof query === 'string') {
      return buildCuratedStation(query);
    }
    // query is { lat, lon }
    try {
      const geoRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${query.lat}&longitude=${query.lon}&localityLanguage=en`,
        { signal }
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const detectedCity = geoData.city || geoData.locality || geoData.principalSubdivision || 'Your Location';
        const detectedCountry = geoData.countryCode || 'Local';
        return buildCuratedStation(detectedCity, detectedCountry, query);
      }
    } catch {
      // ignore
    }
    return buildCuratedStation('Local Area', 'GPS', query);
  }

  let weatherUrl = '';
  let forecastUrl = '';

  if (typeof query === 'string') {
    const encoded = encodeURIComponent(query.trim());
    weatherUrl = `${BASE_URL}/data/2.5/weather?q=${encoded}&units=metric&appid=${apiKey}`;
    forecastUrl = `${BASE_URL}/data/2.5/forecast?q=${encoded}&units=metric&appid=${apiKey}`;
  } else {
    weatherUrl = `${BASE_URL}/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${apiKey}`;
    forecastUrl = `${BASE_URL}/data/2.5/forecast?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${apiKey}`;
  }

  try {
    // Coordinate current weather & forecast requests concurrently
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl, { signal }),
      fetch(forecastUrl, { signal }),
    ]);

    if (!weatherRes.ok) {
      if (weatherRes.status === 404) {
        throw new Error(`City "${typeof query === 'string' ? query : 'location'}" was not found. Please verify the spelling or try adding a country code (e.g. "Paris, FR").`);
      }
      if (weatherRes.status === 401) {
        throw new Error('Your OpenWeatherMap API key is invalid or pending activation. New keys typically take 10-30 minutes to activate on OpenWeather servers.');
      }
      if (weatherRes.status === 429) {
        throw new Error('OpenWeatherMap API request limit reached. Please wait a moment before trying again.');
      }
      throw new Error(`OpenWeather API error: HTTP ${weatherRes.status} (${weatherRes.statusText})`);
    }

    const current: CurrentWeatherRaw = await weatherRes.json();
    let forecast: ForecastRaw | null = null;
    if (forecastRes.ok) {
      forecast = await forecastRes.json();
    }

    // Now fetch air pollution using coordinates from current weather
    let airQuality: AirQualityData | undefined = undefined;
    try {
      const airUrl = `${BASE_URL}/data/2.5/air_pollution?lat=${current.coord.lat}&lon=${current.coord.lon}&appid=${apiKey}`;
      const airRes = await fetch(airUrl, { signal });
      if (airRes.ok) {
        const airData: AirPollutionRaw = await airRes.json();
        if (airData.list && airData.list.length > 0) {
          const mainAir = airData.list[0];
          airQuality = normalizeAirQuality(mainAir.main.aqi, mainAir.components);
        }
      }
    } catch {
      // Air pollution is optional insight, non-blocking
    }

    const tzOffset = current.timezone;
    const now = current.dt;
    const localTimeFormatted = formatLocalTime(now, tzOffset, 'time');
    const localDateFormatted = formatLocalTime(now, tzOffset, 'date');
    const sunriseTime = formatLocalTime(current.sys.sunrise, tzOffset, 'time');
    const sunsetTime = formatLocalTime(current.sys.sunset, tzOffset, 'time');
    const isDaytime = now >= current.sys.sunrise && now <= current.sys.sunset;

    // Process hourly & daily forecasts
    let hourly: HourlyForecastData[] = [];
    let daily: DailyForecastData[] = [];

    if (forecast && forecast.list) {
      const processed = processForecastData(forecast, tzOffset);
      hourly = processed.hourly;
      daily = processed.daily;
    }

    // Precipitation in mm (1h or 3h or 0)
    const precip = current.rain?.['1h'] ?? current.rain?.['3h'] ?? current.snow?.['1h'] ?? current.snow?.['3h'] ?? 0;

    return {
      city: current.name,
      country: current.sys.country,
      coordinates: current.coord,
      timezoneOffset: tzOffset,
      localTimeFormatted,
      localDateFormatted,
      currentTempC: Math.round(current.main.temp),
      feelsLikeC: Math.round(current.main.feels_like),
      tempMinC: Math.round(current.main.temp_min),
      tempMaxC: Math.round(current.main.temp_max),
      condition: current.weather[0]?.main || 'Clear',
      description: current.weather[0]?.description || '',
      icon: current.weather[0]?.icon || '01d',
      humidity: current.main.humidity,
      windSpeedMs: current.wind.speed,
      windDirectionDeg: current.wind.deg,
      pressureHpa: current.main.pressure,
      visibilityMeters: current.visibility,
      cloudCoverPct: current.clouds.all,
      dewPointC: calculateDewPoint(current.main.temp, current.main.humidity),
      precipitationMm: precip > 0 ? precip : undefined,
      sunriseTime,
      sunsetTime,
      sunriseTimestamp: current.sys.sunrise,
      sunsetTimestamp: current.sys.sunset,
      isDaytime,
      hourly,
      daily,
      airQuality,
      source: 'live_api',
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }

    // If 401 error and user has a curated fallback available for this city, or wants to explore
    if (err.message && err.message.includes('401')) {
      throw err;
    }
    throw err;
  }
}
