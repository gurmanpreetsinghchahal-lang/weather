import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  CloudDrizzle,
  Wind,
} from 'lucide-react';

interface WeatherIconProps {
  iconCode?: string;
  condition?: string;
  isDaytime?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconCode = '01d',
  condition = '',
  isDaytime = true,
  className = '',
  size = 48,
}) => {
  const code = iconCode.toLowerCase();
  const cond = condition.toLowerCase();

  // Map OpenWeather icon code
  if (code.startsWith('01')) {
    // Clear sky
    return code.endsWith('n') || !isDaytime ? (
      <Moon size={size} className={`text-indigo-300 drop-shadow-[0_0_12px_rgba(165,180,252,0.4)] ${className}`} />
    ) : (
      <Sun size={size} className={`text-amber-400 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)] ${className}`} />
    );
  }

  if (code.startsWith('02')) {
    // Few clouds
    return code.endsWith('n') || !isDaytime ? (
      <CloudMoon size={size} className={`text-indigo-200 ${className}`} />
    ) : (
      <CloudSun size={size} className={`text-amber-300 ${className}`} />
    );
  }

  if (code.startsWith('03') || code.startsWith('04')) {
    // Scattered / broken clouds
    return <Cloud size={size} className={`text-slate-300 drop-shadow ${className}`} />;
  }

  if (code.startsWith('09')) {
    // Shower rain
    return <CloudDrizzle size={size} className={`text-sky-300 drop-shadow ${className}`} />;
  }

  if (code.startsWith('10')) {
    // Rain
    return <CloudRain size={size} className={`text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)] ${className}`} />;
  }

  if (code.startsWith('11')) {
    // Thunderstorm
    return <CloudLightning size={size} className={`text-purple-400 drop-shadow-[0_0_14px_rgba(192,132,252,0.5)] ${className}`} />;
  }

  if (code.startsWith('13')) {
    // Snow
    return <Snowflake size={size} className={`text-sky-100 drop-shadow-[0_0_12px_rgba(224,242,254,0.6)] ${className}`} />;
  }

  if (code.startsWith('50')) {
    // Mist / Fog / Haze
    return <CloudFog size={size} className={`text-slate-400 drop-shadow ${className}`} />;
  }

  // Fallback based on condition string
  if (cond.includes('thunder')) {
    return <CloudLightning size={size} className={`text-purple-400 ${className}`} />;
  }
  if (cond.includes('snow') || cond.includes('ice') || cond.includes('blizzard')) {
    return <Snowflake size={size} className={`text-sky-100 ${className}`} />;
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return <CloudRain size={size} className={`text-sky-400 ${className}`} />;
  }
  if (cond.includes('cloud')) {
    return <Cloud size={size} className={`text-slate-300 ${className}`} />;
  }
  if (cond.includes('wind')) {
    return <Wind size={size} className={`text-teal-300 ${className}`} />;
  }
  if (cond.includes('fog') || cond.includes('mist')) {
    return <CloudFog size={size} className={`text-slate-400 ${className}`} />;
  }

  return isDaytime ? (
    <Sun size={size} className={`text-amber-400 ${className}`} />
  ) : (
    <Moon size={size} className={`text-indigo-300 ${className}`} />
  );
};
