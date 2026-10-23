"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Sparkles, X, Globe } from "lucide-react";

export default function UrlResult({ urlData, onDismiss, onNotify }) {
  const [copied, setCopied] = useState(false);

  if (!urlData) return null;

  // Build the absolute short link using current browser window origin or NEXT_PUBLIC_APP_URL
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const fullShortUrl = `${origin}/${urlData.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      if (onNotify) {
        onNotify("Short link copied to clipboard!", "success");
      }
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = fullShortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      id="url-result-section"
      className="w-full max-w-3xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="glass-panel rounded-2xl p-5 border-emerald-500/30 bg-slate-900/90 relative shadow-xl shadow-emerald-950/20">
        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="Dismiss result"
            id="btn-dismiss-result"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header tag */}
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Your Short Link Is Ready!</span>
        </div>

        {/* Short Link Display Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              /{urlData.shortCode}
            </span>
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base sm:text-lg font-mono font-bold text-indigo-300 hover:text-indigo-200 truncate transition underline decoration-indigo-500/40 hover:decoration-indigo-400"
              id="result-short-link"
            >
              {fullShortUrl}
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              id="copy-short-url-btn"
              className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            {/* Visit Link */}
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="visit-short-url-btn"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              title="Test redirection in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit</span>
            </a>
          </div>
        </div>

        {/* Original URL Preview */}
        <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400 px-1 overflow-hidden">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="shrink-0 text-slate-400">Destination:</span>
          <span
            className="truncate text-slate-300 font-mono"
            title={urlData.originalUrl}
          >
            {urlData.originalUrl}
          </span>
        </div>
      </div>
    </div>
  );
}
