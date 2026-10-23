"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Clock,
  Eye,
  Search,
  RefreshCw,
  Link2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function UrlHistory({
  urls,
  isLoading,
  onDeleteUrl,
  onRefresh,
  onNotify,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // url object pending deletion confirmation
  const [isDeleting, setIsDeleting] = useState(false);

  // Get current origin for copying full URL
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const handleCopy = async (id, shortCode) => {
    const fullUrl = `${origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      if (onNotify) {
        onNotify("Link copied to clipboard!", "success");
      }
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDeleteUrl(deleteTarget.id);
      if (onNotify) {
        onNotify("Link deleted successfully.", "success");
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      if (onNotify) {
        onNotify("Failed to delete link. Please try again.", "error");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUrls = urls.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.shortCode.toLowerCase().includes(query) ||
      item.originalUrl.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto mt-12" id="url-history-section">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Shortened URLs History</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {urls.length}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track visitors, copy short links, and manage your shortened URLs.
          </p>
        </div>

        {/* Search & Refresh Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              id="history-search-input"
              placeholder="Filter links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={onRefresh}
            id="refresh-history-btn"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer shrink-0"
            title="Refresh link stats"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && urls.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-panel p-4 rounded-xl skeleton-shimmer h-20 w-full"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && urls.length === 0 && (
        <div
          id="history-empty-state"
          className="glass-panel rounded-2xl p-12 text-center border-dashed border-slate-800"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Link2 className="w-7 h-7 -rotate-45" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            No Shortened Links Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Paste any long URL into the box above and click &quot;Shorten URL&quot;
            to create your very first short link!
          </p>
        </div>
      )}

      {/* No search results state */}
      {!isLoading && urls.length > 0 && filteredUrls.length === 0 && (
        <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 text-sm">
          No URLs matching &quot;{searchQuery}&quot;. Try a different search term.
        </div>
      )}

      {/* History Table for Desktop */}
      {!isLoading && filteredUrls.length > 0 && (
        <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <table className="w-full text-left text-sm" id="urls-table">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Short Link</th>
                <th className="py-3.5 px-4 font-semibold">Destination URL</th>
                <th className="py-3.5 px-4 font-semibold text-center">Clicks</th>
                <th className="py-3.5 px-4 font-semibold">Created</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUrls.map((item) => {
                const fullShortUrl = `${origin}/${item.shortCode}`;
                const isCopied = copiedId === item.id;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/50 transition duration-150 group"
                  >
                    {/* Short Link Column */}
                    <td className="py-4 px-4 font-mono font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs">
                          /{item.shortCode}
                        </span>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopy(item.id, item.shortCode)}
                          className={`p-1.5 rounded-md transition cursor-pointer ${
                            isCopied
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "text-slate-400 hover:text-white hover:bg-slate-800"
                          }`}
                          title={isCopied ? "Copied!" : "Copy link"}
                          id={`copy-btn-${item.shortCode}`}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Open in new tab */}
                        <a
                          href={fullShortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition"
                          title="Open short link"
                          id={`visit-btn-${item.shortCode}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* Original URL Column */}
                    <td className="py-4 px-4 max-w-xs xl:max-w-md truncate">
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-200 truncate block transition"
                        title={item.originalUrl}
                      >
                        {item.originalUrl}
                      </a>
                    </td>

                    {/* Click Count Badge */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span id={`clicks-${item.shortCode}`}>
                          {item.clickCount}
                        </span>
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    {/* Delete Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(item)}
                        id={`delete-btn-${item.shortCode}`}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        title="Delete URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Responsive Cards for Mobile & Tablet */}
      {!isLoading && filteredUrls.length > 0 && (
        <div className="md:hidden space-y-3.5">
          {filteredUrls.map((item) => {
            const fullShortUrl = `${origin}/${item.shortCode}`;
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="glass-panel p-4 rounded-xl border border-slate-800/80 shadow-md space-y-3"
              >
                {/* Top Row: Short Code & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium">
                      /{item.shortCode}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                      <Eye className="w-3 h-3" />
                      <span>{item.clickCount} clicks</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.id, item.shortCode)}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        isCopied
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                      }`}
                      title="Copy link"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={fullShortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-900 border border-slate-800 rounded-lg transition"
                      title="Open short link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded-lg transition cursor-pointer"
                      title="Delete link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Original URL Preview */}
                <div className="text-xs text-slate-400 break-all bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">
                    Destination:
                  </span>
                  <a
                    href={item.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-slate-300"
                  >
                    {item.originalUrl}
                  </a>
                </div>

                {/* Timestamp */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Created: {formatDate(item.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full border border-rose-500/30 bg-slate-900 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white text-center mb-1">
              Delete Short Link?
            </h3>
            <p className="text-xs text-slate-400 text-center mb-5 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-mono text-indigo-300 font-semibold">
                /{deleteTarget.shortCode}
              </span>
              ? Visitors trying to use this short link will receive a 404 error.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition cursor-pointer"
                id="cancel-delete-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-lg shadow-rose-600/30 cursor-pointer"
                id="confirm-delete-btn"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
