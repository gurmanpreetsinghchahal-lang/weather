export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface CurrentWeatherRaw {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number; // Shift in seconds from UTC
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItemRaw {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number; // Probability of precipitation (0 to 1)
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
  dt_txt: string;
}

export interface ForecastRaw {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItemRaw[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population?: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface AirPollutionRaw {
  coord: Coordinates;
  list: Array<{
    dt: number;
    main: {
      aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Normalized Data Structures used by UI
export interface HourlyForecastData {
  time: string; // Formatted local time e.g. '2 PM'
  timestamp: number;
  tempC: number;
  feelsLikeC: number;
  condition: string;
  description: string;
  icon: string;
  pop: number; // 0 - 100%
  windSpeedMs: number;
  humidity: number;
}

export interface DailyForecastData {
  date: string; // e.g. "Tomorrow", "Wed, Oct 21"
  dayOfWeek: string; // e.g. "Wed"
  timestamp: number;
  tempMinC: number;
  tempMaxC: number;
  condition: string;
  description: string;
  icon: string;
  pop: number;
  humidity: number;
  windSpeedMs: number;
}

export interface AirQualityData {
  aqi: number; // 1-5
  label: string; // Good, Fair, etc.
  color: string;
  summary: string;
  pm2_5: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface NormalizedWeatherData {
  city: string;
  country: string;
  coordinates: Coordinates;
  timezoneOffset: number; // seconds from UTC
  localTimeFormatted: string;
  localDateFormatted: string;
  currentTempC: number;
  feelsLikeC: number;
  tempMinC: number;
  tempMaxC: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeedMs: number;
  windDirectionDeg: number;
  pressureHpa: number;
  visibilityMeters: number;
  cloudCoverPct: number;
  dewPointC: number;
  precipitationMm?: number;
  sunriseTime: string;
  sunsetTime: string;
  sunriseTimestamp: number;
  sunsetTimestamp: number;
  isDaytime: boolean;
  hourly: HourlyForecastData[];
  daily: DailyForecastData[];
  airQuality?: AirQualityData;
  source: 'live_api' | 'demo_station';
}
