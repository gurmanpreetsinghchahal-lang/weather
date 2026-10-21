import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { searchCities } from '../services/weatherService';
import { GeocodingResult } from '../types/weather';

interface SearchBarProps {
  onSelectCity: (city: string) => void;
  onUseCurrentLocation: () => void;
  isLoading?: boolean;
  isLocating?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLoading = false,
  isLocating = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced geocoding query
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (val.trim().length >= 2) {
      setSearching(true);
      debounceTimer.current = setTimeout(async () => {
        try {
          const results = await searchCities(val);
          setSuggestions(results);
          setIsOpen(true);
        } catch {
          setSuggestions([]);
        } finally {
          setSearching(false);
        }
      }, 350);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setSearching(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSelectCity(trimmed);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (item: GeocodingResult) => {
    const fullQuery = item.state ? `${item.name}, ${item.state}, ${item.country}` : `${item.name}, ${item.country}`;
    onSelectCity(fullQuery);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <form onSubmit={handleFormSubmit} className="relative flex items-center">
        <div className="relative flex-1 flex items-center">
          <Search
            size={18}
            className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors"
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search city, state or country... (press '/' to focus)"
            className="w-full pl-10 pr-20 py-2.5 text-sm text-slate-100 placeholder-slate-400 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/80 transition-all shadow-inner"
            aria-label="Search city or location"
          />

          {searching ? (
            <Loader2 size={16} className="absolute right-10 text-sky-400 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-10 text-slate-400 hover:text-slate-200 transition-colors p-1"
              aria-label="Clear search input"
            >
              <X size={15} />
            </button>
          ) : null}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onUseCurrentLocation();
            }}
            disabled={isLocating || isLoading}
            title="Use current location"
            className="absolute right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-60 cursor-pointer"
            aria-label="Use current location via GPS"
          >
            {isLocating ? (
              <Loader2 size={16} className="text-sky-400 animate-spin" />
            ) : (
              <MapPin size={16} />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="ml-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap"
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {/* Autocomplete dropdown suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/60 animate-in fade-in duration-150">
          <div className="px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Suggested Locations
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={`${item.name}-${item.lat}-${item.lon}-${idx}`}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="w-full text-left px-3.5 py-2.5 flex items-center justify-between hover:bg-sky-500/10 transition-colors text-sm text-slate-200 group"
            >
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-sky-400 shrink-0" />
                <span className="font-medium text-slate-100 group-hover:text-sky-300 transition-colors">
                  {item.name}
                </span>
                {item.state && (
                  <span className="text-xs text-slate-400">· {item.state}</span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/40">
                {item.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
