import Link from "next/link";
import { Link2, Zap, Database } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
          id="navbar-brand-link"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Link2 className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">
                Link<span className="text-indigo-400">Lite</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <span className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
              Simple & Fast URL Shortener
            </span>
          </div>
        </Link>

        {/* Right side pill badges */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-medium">PostgreSQL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30" />
            <span>Instant Redirects</span>
          </div>
        </div>
      </div>
    </header>
  );
}
