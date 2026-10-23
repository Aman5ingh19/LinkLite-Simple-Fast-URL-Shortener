"use client";

import { useState } from "react";
import { Link2, ArrowRight, Loader2, Clipboard, X, AlertCircle } from "lucide-react";

export default function UrlForm({ onUrlCreated, onNotify }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePaste = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setErrorMessage("");
        }
      }
    } catch {
      // Clipboard access might be blocked by browser permissions
    }
  };

  const handleClear = () => {
    setUrl("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setErrorMessage("Please enter a destination URL to shorten.");
      return;
    }

    // Client-side pre-check for quick feedback
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setErrorMessage(
        "Invalid protocol. URL must start with http:// or https:// (e.g. https://example.com)."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.error || "Failed to shorten URL. Please check the address and try again."
        );
        if (onNotify) {
          onNotify(result.error || "Failed to shorten URL.", "error");
        }
        return;
      }

      // Success
      setUrl("");
      if (onUrlCreated) {
        onUrlCreated(result.data);
      }
      if (onNotify) {
        onNotify("Short URL created successfully!", "success");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        "Network or server error. Please ensure the database is running and try again."
      );
      if (onNotify) {
        onNotify("Network error while creating short link.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="glass-panel-glow rounded-2xl p-4 sm:p-5 relative transition-all duration-300"
        id="shorten-url-form"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Input field with icon */}
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Link2 className="w-5 h-5 -rotate-45" />
            </div>

            <input
              type="text"
              id="url-input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Paste your long link here (e.g., https://example.com/very-long-path)..."
              disabled={isLoading}
              className="w-full pl-11 pr-20 py-3.5 bg-slate-900/90 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700/80 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm sm:text-base transition-all duration-200 disabled:opacity-60"
            />

            {/* Quick action buttons inside input */}
            <div className="absolute right-3 flex items-center gap-1.5">
              {url ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition cursor-pointer"
                  title="Clear input"
                  id="btn-clear-url"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800 flex items-center gap-1 transition cursor-pointer"
                  title="Paste from clipboard"
                  id="btn-paste-url"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="shorten-submit-btn"
            disabled={isLoading || !url.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <span>Shorten URL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div
            id="url-error-message"
            className="mt-3.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs sm:text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Hints */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
          <span>Requires <code className="text-indigo-300 bg-slate-900/60 px-1 py-0.5 rounded">http://</code> or <code className="text-indigo-300 bg-slate-900/60 px-1 py-0.5 rounded">https://</code> protocol</span>
          <span>Instant unique 6-character short code</span>
        </div>
      </form>
    </div>
  );
}
