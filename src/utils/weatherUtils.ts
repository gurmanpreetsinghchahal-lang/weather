import { TemperatureUnit, WindSpeedUnit, AirQualityData } from '../types/weather';

/**
 * Temperature conversion from Celsius
 */
export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function convertTempNumber(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * Wind speed conversions
 */
export function formatWindSpeed(speedMs: number, unit: WindSpeedUnit): string {
  switch (unit) {
    case 'kmh':
      return `${Math.round(speedMs * 3.6)} km/h`;
    case 'mph':
      return `${Math.round(speedMs * 2.23694)} mph`;
    case 'ms':
    default:
      return `${speedMs.toFixed(1)} m/s`;
  }
}

/**
 * Convert wind degrees to compass cardinal direction
 */
export function getWindDirection(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(((deg % 360) / 22.5)) % 16;
  return directions[index];
}

/**
 * Format local time given a timestamp and timezone offset in seconds from UTC
 */
export function formatLocalTime(timestampSec: number, timezoneOffsetSec: number, format: 'time' | 'date' | 'both' = 'both'): string {
  // Construct date adjusted for local timezone offset
  // We use UTC methods on the shifted date
  const targetTimeMs = (timestampSec + timezoneOffsetSec) * 1000;
  const date = new Date(targetTimeMs);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const timeStr = `${displayHours}:${minutes} ${ampm}`;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const dayNum = date.getUTCDate();
  const dateStr = `${dayName}, ${monthName} ${dayNum}`;

  if (format === 'time') return timeStr;
  if (format === 'date') return dateStr;
  return `${dateStr} · ${timeStr}`;
}

/**
 * Format sunrise/sunset relative to current time
 */
export function formatTimeAgoOrUntil(targetSec: number, currentSec: number): string {
  const diffSec = targetSec - currentSec;
  const absDiffMin = Math.round(Math.abs(diffSec) / 60);

  if (absDiffMin < 60) {
    return diffSec >= 0 ? `in ${absDiffMin}m` : `${absDiffMin}m ago`;
  }

  const hours = Math.floor(absDiffMin / 60);
  const minutes = absDiffMin % 60;
  const timeText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  return diffSec >= 0 ? `in ${timeText}` : `${timeText} ago`;
}

/**
 * Calculate dew point in Celsius using Magnus approximation
 */
export function calculateDewPoint(tempC: number, humidity: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100.0);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint * 10) / 10;
}

/**
 * Visibility descriptor and unit formatting
 */
export function formatVisibility(meters: number, unit: TemperatureUnit): { text: string; description: string } {
  if (unit === 'fahrenheit') {
    const miles = meters / 1609.34;
    const text = `${miles >= 10 ? Math.round(miles) : miles.toFixed(1)} mi`;
    let description = 'Excellent';
    if (miles < 1) description = 'Very Dense Fog';
    else if (miles < 3) description = 'Moderate Mist';
    else if (miles < 6) description = 'Good Visibility';
    return { text, description };
  } else {
    const km = meters / 1000;
    const text = `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
    let description = 'Excellent';
    if (km < 1) description = 'Very Dense Fog';
    else if (km < 4) description = 'Moderate Mist';
    else if (km < 9) description = 'Good Visibility';
    return { text, description };
  }
}

/**
 * Pressure descriptor
 */
export function getPressureStatus(hPa: number): string {
  if (hPa > 1022) return 'High Pressure (Stable)';
  if (hPa < 1005) return 'Low Pressure (Precipitation likely)';
  return 'Normal Pressure';
}

/**
 * Map Air Quality Index (1-5 OpenWeather standard) to detailed object
 */
export function normalizeAirQuality(aqi: number, components?: any): AirQualityData {
  switch (aqi) {
    case 1:
      return {
        aqi: 1,
        label: 'Good',
        color: '#10B981', // Emerald
        summary: 'Air quality is satisfactory and poses little to no risk.',
        pm2_5: components?.pm2_5 ?? 8.4,
        pm10: components?.pm10 ?? 14.2,
        o3: components?.o3 ?? 45.1,
        no2: components?.no2 ?? 12.0,
        so2: components?.so2 ?? 3.4,
        co: components?.co ?? 210.0,
      };
    case 2:
      return {
        aqi: 2,
        label: 'Fair',
        color: '#84CC16', // Lime
        summary: 'Air quality is acceptable; very sensitive individuals may experience mild effects.',
        pm2_5: components?.pm2_5 ?? 18.2,
        pm10: components?.pm10 ?? 28.5,
        o3: components?.o3 ?? 62.0,
        no2: components?.no2 ?? 24.3,
        so2: components?.so2 ?? 8.1,
        co: components?.co ?? 320.0,
      };
    case 3:
      return {
        aqi: 3,
        label: 'Moderate',
        color: '#F59E0B', // Amber
        summary: 'Members of sensitive groups may experience health effects.',
        pm2_5: components?.pm2_5 ?? 38.0,
        pm10: components?.pm10 ?? 58.2,
        o3: components?.o3 ?? 85.0,
        no2: components?.no2 ?? 48.0,
        so2: components?.so2 ?? 18.5,
        co: components?.co ?? 550.0,
      };
    case 4:
      return {
        aqi: 4,
        label: 'Poor',
        color: '#EF4444', // Red
        summary: 'Everyone may begin to experience health effects; limit prolonged outdoor exertion.',
        pm2_5: components?.pm2_5 ?? 65.4,
        pm10: components?.pm10 ?? 95.0,
        o3: components?.o3 ?? 115.0,
        no2: components?.no2 ?? 72.0,
        so2: components?.so2 ?? 35.0,
        co: components?.co ?? 890.0,
      };
    case 5:
    default:
      return {
        aqi: 5,
        label: 'Very Poor',
        color: '#9333EA', // Purple
        summary: 'Health alert: serious risk for the general population. Remain indoors where possible.',
        pm2_5: components?.pm2_5 ?? 110.0,
        pm10: components?.pm10 ?? 160.0,
        o3: components?.o3 ?? 150.0,
        no2: components?.no2 ?? 110.0,
        so2: components?.so2 ?? 65.0,
        co: components?.co ?? 1400.0,
      };
  }
}

/**
 * Contextual Weather Advisor: Clothing, Outdoor Activity, and Practical Daily Tips
 */
export function getWeatherAdvisor(
  tempC: number,
  condition: string,
  pop: number,
  windSpeedMs: number
): { clothing: string; activity: string; umbrella: boolean; alert?: string } {
  const cond = condition.toLowerCase();
  const willRain = pop > 40 || cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunderstorm');
  const isFreezing = tempC <= 0;
  const isChilly = tempC > 0 && tempC < 14;
  const isMild = tempC >= 14 && tempC < 22;
  const isWarm = tempC >= 22 && tempC < 30;
  const isHot = tempC >= 30;
  const isWindy = windSpeedMs >= 8.5; // > 30 km/h

  let clothing = 'Comfortable light layers';
  let activity = 'Great conditions for outdoor walks and exercise.';
  let alert: string | undefined = undefined;

  if (isFreezing) {
    clothing = 'Heavy thermal winter coat, gloves, beanie, and insulated footwear.';
    activity = 'Limit extended exposure to icy air; watch for slick sidewalks.';
  } else if (isChilly) {
    clothing = 'Warm jacket, knit sweater, or layered fleece.';
    activity = 'Pleasant for brisk outdoor walks with appropriate outerwear.';
  } else if (isMild) {
    clothing = 'Long sleeves, light cardigan, or a windbreaker.';
    activity = 'Optimal conditions for running, cycling, or outdoor dining.';
  } else if (isWarm) {
    clothing = 'Breathable cotton t-shirt, shorts, and sunglasses.';
    activity = 'Enjoyable weather for park strolls and outdoor recreation.';
  } else if (isHot) {
    clothing = 'Ultra-lightweight clothing, sun hat, and high UV protection.';
    activity = 'Stay hydrated and seek shade during peak midday heat.';
    alert = 'High temperature alert: drink plenty of water.';
  }

  if (cond.includes('thunderstorm')) {
    activity = 'Severe thunderstorm hazard: avoid open areas and stay indoors.';
    alert = 'Lightning and severe squalls detected in the area.';
  } else if (willRain) {
    activity = 'Precipitation expected: carry rain gear or plan indoor activities.';
  }

  if (isWindy) {
    clothing += ' Secure loose accessories against gusts.';
  }

  return {
    clothing,
    activity,
    umbrella: willRain,
    alert,
  };
}

/**
 * Determine dynamic theme gradient and atmosphere styling based on condition and time of day
 */
export function getAtmosphericTheme(condition: string, isDaytime: boolean): {
  bgGradient: string;
  accentColor: string;
  cardBg: string;
  glowColor: string;
} {
  const cond = condition.toLowerCase();

  if (!isDaytime) {
    // Night variations
    if (cond.includes('clear')) {
      return {
        bgGradient: 'from-[#0B0F19] via-[#0D1527] to-[#0A1120]',
        accentColor: '#60A5FA', // Sky 400
        cardBg: 'rgba(15, 23, 42, 0.65)',
        glowColor: 'rgba(56, 189, 248, 0.12)',
      };
    }
    if (cond.includes('rain') || cond.includes('drizzle')) {
      return {
        bgGradient: 'from-[#0A0E1A] via-[#0E172A] to-[#0B1528]',
        accentColor: '#38BDF8',
        cardBg: 'rgba(13, 20, 38, 0.7)',
        glowColor: 'rgba(14, 165, 233, 0.15)',
      };
    }
    if (cond.includes('thunderstorm')) {
      return {
        bgGradient: 'from-[#090814] via-[#13112B] to-[#0A0A17]',
        accentColor: '#C084FC',
        cardBg: 'rgba(19, 17, 43, 0.7)',
        glowColor: 'rgba(192, 132, 252, 0.18)',
      };
    }
    return {
      bgGradient: 'from-[#080E1A] via-[#0F172A] to-[#0A1220]',
      accentColor: '#94A3B8',
      cardBg: 'rgba(15, 23, 42, 0.7)',
      glowColor: 'rgba(148, 163, 184, 0.1)',
    };
  }

  // Daytime variations
  if (cond.includes('thunderstorm')) {
    return {
      bgGradient: 'from-[#17192A] via-[#1E1B38] to-[#121526]',
      accentColor: '#A855F7',
      cardBg: 'rgba(23, 25, 45, 0.65)',
      glowColor: 'rgba(168, 85, 247, 0.15)',
    };
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return {
      bgGradient: 'from-[#0F1E36] via-[#162B4D] to-[#0E1A2E]',
      accentColor: '#38BDF8',
      cardBg: 'rgba(16, 32, 58, 0.65)',
      glowColor: 'rgba(56, 189, 248, 0.16)',
    };
  }
  if (cond.includes('snow')) {
    return {
      bgGradient: 'from-[#14233A] via-[#1B3152] to-[#162742]',
      accentColor: '#BAE6FD',
      cardBg: 'rgba(22, 39, 66, 0.65)',
      glowColor: 'rgba(186, 230, 253, 0.16)',
    };
  }
  if (cond.includes('cloud')) {
    return {
      bgGradient: 'from-[#0F1B2E] via-[#182C48] to-[#111F36]',
      accentColor: '#38BDF8',
      cardBg: 'rgba(17, 31, 54, 0.65)',
      glowColor: 'rgba(56, 189, 248, 0.14)',
    };
  }
  if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) {
    return {
      bgGradient: 'from-[#141C2B] via-[#1E293B] to-[#141D2C]',
      accentColor: '#94A3B8',
      cardBg: 'rgba(20, 28, 43, 0.65)',
      glowColor: 'rgba(148, 163, 184, 0.12)',
    };
  }

  // Clear Sky Daytime
  return {
    bgGradient: 'from-[#0E2548] via-[#133E75] to-[#0D2447]',
    accentColor: '#F59E0B', // Warm Sun gold / Sky blue
    cardBg: 'rgba(14, 37, 72, 0.6)',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  };
}

/**
 * Contextual greeting based on local hour
 */
export function getContextualGreeting(hours: number, cityName: string): string {
  if (hours >= 5 && hours < 12) return `Good morning in ${cityName}`;
  if (hours >= 12 && hours < 17) return `Good afternoon in ${cityName}`;
  if (hours >= 17 && hours < 21) return `Good evening in ${cityName}`;
  return `Good night in ${cityName}`;
}
