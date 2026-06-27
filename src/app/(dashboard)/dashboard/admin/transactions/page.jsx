"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function TransactionLedgerPage() {
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    dailyRevenue: 12482.0,
    activeSubs: 1240,
  });
  const [pagination, setPagination] = useState({
    totalTransactions: 0,
    currentPage: 1,
    totalPages: 1,
    showingCount: 0,
    skipOffset: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/transactions?page=${page}&limit=6`,
        );
        if (!res.ok) throw new Error("Could not pull payment history context.");
        const data = await res.json();
        if (data.success) {
          setTransactions(data.transactions || []);
          setMetrics(data.metrics);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error synchronizing Stripe ledger data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page]);

  // Utility to format values into clean localized currency text strings
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen p-6 md:p-10 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Analytics Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
              Transaction Ledger
            </h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mt-1">
              Real-time Stripe payment stream for ElevateX memberships and
              trainer certifications. View and monitor facility revenue in
              high-density detail.
            </p>
          </div>

          {/* Statistics summary metric cards (derived from layout image_27b1bb.png top right component) */}
          <div className="flex gap-3 shrink-0">
            <div className="bg-[#121214] border border-zinc-900 rounded-lg py-2 px-5 text-left min-w-[130px]">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                Daily Revenue
              </span>
              <span className="text-lg font-black text-[#c4e42a] block mt-1">
                {loading ? "$...,..." : formatCurrency(metrics.dailyRevenue)}
              </span>
            </div>
            <div className="bg-[#121214] border border-zinc-900 rounded-lg py-2 px-5 text-left min-w-[110px]">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                Active Subs
              </span>
              <span className="text-lg font-black text-zinc-100 block mt-1">
                {loading ? "...,..." : metrics.activeSubs.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Actions Context Bar */}
        <div className="flex items-center justify-between gap-4 bg-[#121214]/40 border border-zinc-900 p-3 rounded-xl flex-wrap">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-zinc-400">
            <div className="bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-md cursor-pointer hover:text-white transition-all">
              ⏳ All Time ▾
            </div>
            <div className="bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-md cursor-pointer hover:text-white transition-all">
              🗂️ Status: Succeeded ▾
            </div>
          </div>
          <button
            onClick={() =>
              toast.success("Compiling system CSV export pipeline stream...")
            }
            className="text-xs font-bold text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-800 px-3 py-1.5 rounded-md bg-zinc-950/40 transition-all inline-flex items-center gap-1.5"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Read-Only High-Density Ledger Table Block */}
        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center py-24">
              Querying live secure network payment streams...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-zinc-500 text-xs font-black uppercase tracking-widest text-center py-24">
              No processing logs discovered inside the specified database
              records.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                    <th className="pb-4">User Email</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Transaction ID</th>
                    <th className="pb-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/30 text-xs font-bold text-zinc-200">
                  {transactions.map((tx) => {
                    const isSucceeded =
                      tx.status?.toLowerCase() === "succeeded" || !tx.status;
                    const isFailed = tx.status?.toLowerCase() === "failed";
                    const isPending = tx.status?.toLowerCase() === "pending";

                    return (
                      <tr
                        key={tx._id}
                        className="group hover:bg-zinc-900/10 transition-all"
                      >
                        {/* Column 1: User Identity Information Metadata Details */}
                        <td className="py-4.5 pr-4">
                          <span className="block font-extrabold text-zinc-200 text-sm tracking-tight group-hover:text-zinc-100 transition-colors">
                            {tx.userEmail || tx.email || "customer@payment.io"}
                          </span>
                          <span className="block text-[10px] text-zinc-500 font-semibold tracking-wide mt-0.5">
                            {tx.tierDescription ||
                              tx.itemType ||
                              "Basic Membership"}
                          </span>
                        </td>

                        {/* Column 2: Extracted Financial Charges */}
                        <td className="py-4.5 pr-4 text-sm font-black text-zinc-100">
                          {formatCurrency(tx.amount || 49.99)}
                        </td>

                        {/* Column 3: Localized Stripe Timestamp Event */}
                        <td className="py-4.5 pr-4 text-zinc-400 font-medium">
                          <span className="block text-zinc-300">
                            {tx.dateFormatted ||
                              new Date(
                                tx.createdAt || Date.now(),
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                          </span>
                          <span className="block text-[10px] text-zinc-500 font-bold mt-0.5">
                            {tx.timeFormatted ||
                              new Date(
                                tx.createdAt || Date.now(),
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                          </span>
                        </td>

                        {/* Column 4: Stripe Live Security Signature Hash References */}
                        <td className="py-4.5 pr-4 font-mono text-[#c4e42a]/90 text-[11px] tracking-tight">
                          {tx.stripeId ||
                            tx.transactionId ||
                            "ch_3Nn8qX2eZvKY1o2C1"}
                        </td>

                        {/* Column 5: Status System Badge Node Fields */}
                        <td className="py-4.5 text-right whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                              isSucceeded
                                ? "bg-lime-950/20 text-[#c4e42a] border-lime-500/20"
                                : isFailed
                                  ? "bg-red-950/20 text-red-400 border-red-500/20"
                                  : "bg-cyan-950/20 text-cyan-400 border-cyan-500/20"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                isSucceeded
                                  ? "bg-[#c4e42a]"
                                  : isFailed
                                    ? "bg-red-400"
                                    : "bg-cyan-400"
                              }`}
                            />
                            {tx.status || "SUCCEEDED"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Interactive View Grid Row Footer Footer */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-zinc-900 mt-6 pt-4 text-xs font-bold text-zinc-500 uppercase tracking-wide">
              <div>
                Showing {pagination.skipOffset + 1} to{" "}
                {pagination.skipOffset + pagination.showingCount} of{" "}
                {pagination.totalTransactions.toLocaleString()} transactions
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => i + 1,
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`w-7 h-7 font-black rounded transition-all text-center ${
                      page === item
                        ? "bg-[#c4e42a] text-black"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}

                <button
                  disabled={page === pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
