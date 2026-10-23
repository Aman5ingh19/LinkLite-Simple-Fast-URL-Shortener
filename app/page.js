"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import UrlForm from "@/components/UrlForm";
import UrlResult from "@/components/UrlResult";
import UrlHistory from "@/components/UrlHistory";
import Toast from "@/components/Toast";
import { Sparkles, ShieldCheck, Zap, Database } from "lucide-react";

export default function HomePage() {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestResult, setLatestResult] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const fetchUrls = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/urls");
      const result = await response.json();
      if (response.ok && result.success) {
        setUrls(result.data || []);
      } else {
        console.error("Failed to load URLs:", result.error);
      }
    } catch (err) {
      console.error("Error fetching URLs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleUrlCreated = (newUrl) => {
    setLatestResult(newUrl);
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleDeleteUrl = async (id) => {
    const response = await fetch(`/api/urls/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to delete URL.");
    }

    setUrls((prev) => prev.filter((item) => item.id !== id));
    if (latestResult && latestResult.id === id) {
      setLatestResult(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fast, Free & Simple URL Shortener</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight sm:leading-tight">
            Shorten, Share & Track <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Your Links in Seconds
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Transform long, complex web addresses into clean, manageable short
            links. Monitor click traffic and manage your full link history in real time.
          </p>
        </div>

        {/* Shorten URL Input Form */}
        <UrlForm onUrlCreated={handleUrlCreated} onNotify={showToast} />

        {/* Newly Generated URL Result Section */}
        {latestResult && (
          <UrlResult
            urlData={latestResult}
            onDismiss={() => setLatestResult(null)}
            onNotify={showToast}
          />
        )}

        {/* Shortened URLs History Section */}
        <UrlHistory
          urls={urls}
          isLoading={isLoading}
          onDeleteUrl={handleDeleteUrl}
          onRefresh={fetchUrls}
          onNotify={showToast}
        />

        {/* Features Mini-Grid */}
        <div className="mt-20 pt-10 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center sm:text-left">
          <div className="glass-panel p-5 rounded-xl border border-slate-800/80">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 mx-auto sm:mx-0">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Instant Redirection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-fast redirects powered by Next.js App Router dynamic routing.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-800/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 mx-auto sm:mx-0">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">PostgreSQL & Prisma</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reliable relational storage with indexed lookups and atomic click counters.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-800/80">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 mx-auto sm:mx-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Safe & Validated</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict protocol validation allowing only verified http and https links.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-400 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 LinkLite. Simple, open URL shortener.</p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>PostgreSQL</span>
            <span>•</span>
            <span>Prisma ORM</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
