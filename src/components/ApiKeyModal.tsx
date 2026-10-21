import React, { useState } from 'react';
import { Key, Check, AlertCircle, X, ExternalLink, Loader2, Eye, EyeOff } from 'lucide-react';
import { getActiveApiKey, saveCustomApiKey, clearCustomApiKey } from '../services/weatherService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [keyInput, setKeyInput] = useState<string>(() => getActiveApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      clearCustomApiKey();
      setStatusMessage({ type: 'success', text: 'Custom key cleared. App will use environment or curated stations.' });
      onKeyUpdated();
      return;
    }

    setIsVerifying(true);
    setStatusMessage(null);

    try {
      // Test key with OpenWeather 2.5 endpoint
      const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${trimmed}`;
      const res = await fetch(testUrl);

      if (res.ok) {
        saveCustomApiKey(trimmed);
        setStatusMessage({
          type: 'success',
          text: 'API Key verified and saved successfully! Real-time queries are now active.',
        });
        onKeyUpdated();
      } else if (res.status === 401) {
        setStatusMessage({
          type: 'error',
          text: 'Invalid API key or key pending activation. Newly created OpenWeather keys can take 10-30 minutes to become active on their servers.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: `Verification returned status HTTP ${res.status}. Please check your key.`,
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error while validating key. Please verify your internet connection.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    clearCustomApiKey();
    setKeyInput('');
    setStatusMessage({ type: 'success', text: 'Custom key cleared.' });
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close API configuration modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Key size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              OpenWeatherMap API Key
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure real-time weather and forecast data
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2 mb-4 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="font-bold text-sky-400">1.</span>
            <span>
              Sign up for a free account at{' '}
              <a
                href="https://home.openweathermap.org/users/sign_up"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 underline inline-flex items-center gap-1 hover:text-sky-300"
              >
                OpenWeatherMap <ExternalLink size={12} />
              </a>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-sky-400">2.</span>
            <span>
              Copy your default API key from your OpenWeather account dashboard.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-sky-400">3.</span>
            <span>
              Paste it below or define <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300">VITE_OPENWEATHER_API_KEY</code> in your environment.
            </span>
          </div>
        </div>

        {/* Key Input Field */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Your OpenWeather 32-character API Key:
          </label>
          <div className="relative flex items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. 8a7c2e1b4f9d0c3e6b5a8f7d9e0c1b2a"
              className="w-full px-3.5 py-2.5 text-sm font-mono text-white bg-slate-950 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400 transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1"
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl border flex items-start gap-2.5 text-xs leading-relaxed ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check size={16} className="shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
            )}
            <div>{statusMessage.text}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            Clear Key
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleTestAndSave}
              disabled={isVerifying}
              className="px-5 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 active:scale-95 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Test & Save</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
