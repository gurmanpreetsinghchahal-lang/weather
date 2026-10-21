import React from 'react';
import { AlertCircle, RotateCcw, Key, Search } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onOpenApiKeyModal: () => void;
  onSelectCity: (city: string) => void;
}

const RECOVERY_CITIES = ['Tokyo', 'London', 'New York', 'Paris', 'Sydney'];

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onOpenApiKeyModal,
  onSelectCity,
}) => {
  const isKeyError = message.toLowerCase().includes('api key') || message.toLowerCase().includes('401');

  return (
    <div className="w-full rounded-2xl bg-rose-950/30 border border-rose-500/40 backdrop-blur-xl p-5 sm:p-6 text-slate-200 shadow-xl animate-in fade-in duration-200">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
          <AlertCircle size={22} />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-base font-semibold text-white font-['Plus_Jakarta_Sans']">
            Weather Request Notice
          </h3>
          <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
            {message}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onRetry}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} />
              <span>Retry</span>
            </button>

            {isKeyError && (
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="px-3.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Key size={13} />
                <span>Configure API Key</span>
              </button>
            )}

            <div className="flex items-center gap-1 text-xs text-slate-400 ml-1">
              <span>Or try:</span>
              {RECOVERY_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onSelectCity(c)}
                  className="px-2 py-0.5 rounded text-xs bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-white/5 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
