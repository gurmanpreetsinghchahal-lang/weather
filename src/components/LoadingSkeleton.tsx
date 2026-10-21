import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Loading weather data">
      {/* Hero Card Skeleton */}
      <div className="rounded-3xl bg-slate-900/40 border border-white/5 p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800/80 rounded-xl" />
            <div className="h-4 w-64 bg-slate-800/50 rounded-lg" />
          </div>
          <div className="h-7 w-28 bg-slate-800/60 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
          <div className="md:col-span-7 flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-800/80 rounded-2xl shrink-0" />
            <div className="space-y-3">
              <div className="h-16 w-32 bg-slate-800/80 rounded-2xl" />
              <div className="h-5 w-40 bg-slate-800/50 rounded-lg" />
            </div>
          </div>
          <div className="md:col-span-5 h-24 bg-slate-800/40 rounded-2xl" />
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-3">
          <div className="h-4 w-3/4 bg-slate-800/40 rounded-lg" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-slate-800/60 rounded" />
              <div className="h-6 w-6 bg-slate-800/60 rounded-lg" />
            </div>
            <div className="h-7 w-20 bg-slate-800/80 rounded-lg" />
            <div className="h-3 w-24 bg-slate-800/40 rounded" />
          </div>
        ))}
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-5 space-y-4">
        <div className="h-5 w-36 bg-slate-800/60 rounded-lg" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-28 h-36 bg-slate-800/40 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* 5-Day Forecast Skeleton */}
      <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-5 space-y-3">
        <div className="h-5 w-32 bg-slate-800/60 rounded-lg mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/30 rounded-xl" />
        ))}
      </div>
    </div>
  );
};
