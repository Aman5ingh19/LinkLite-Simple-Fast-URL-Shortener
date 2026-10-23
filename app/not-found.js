import Link from "next/link";
import { Link2Off, ArrowLeft, PlusCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl shadow-indigo-950/40 mb-6">
          <Link2Off className="w-10 h-10 text-rose-400" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
          Error 404
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Short Link Not Found
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The link you followed doesn&apos;t exist, was deleted, or the short code
          was entered incorrectly. Please check the address or create a new
          short link below.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium text-sm hover:from-indigo-600 hover:to-violet-700 transition shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Shorten a New Link
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to LinkLite Home
          </Link>
        </div>
      </div>
    </div>
  );
}
