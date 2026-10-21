import React from 'react';
import { Star, Clock, X } from 'lucide-react';

interface FavoritesBarProps {
  favorites: string[];
  recents: string[];
  activeCity: string;
  onSelectCity: (city: string) => void;
  onRemoveFavorite: (city: string) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  activeCity,
  onSelectCity,
  onRemoveFavorite,
}) => {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1 text-xs text-amber-400 font-medium shrink-0">
        <Star size={13} className="fill-amber-400 text-amber-400" />
        <span className="hidden sm:inline">Pinned:</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {favorites.map((city) => {
          const isActive = city.toLowerCase() === activeCity.toLowerCase();
          return (
            <div
              key={city}
              className={`group flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-sky-500/20 border-sky-400/50 text-sky-200'
                  : 'bg-slate-900/60 border-white/5 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-white/15'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectCity(city)}
                className="whitespace-nowrap"
              >
                {city}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(city);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                title={`Unpin ${city}`}
                aria-label={`Remove ${city} from pinned favorites`}
              >
                <X size={11} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
