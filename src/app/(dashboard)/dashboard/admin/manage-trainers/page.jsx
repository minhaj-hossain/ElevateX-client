"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [metrics, setMetrics] = useState({ activeTrainers: 0, avgRating: 4.8 });
  const [pagination, setPagination] = useState({
    totalTrainers: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/trainers?page=${page}&limit=4`,
      );
      if (!res.ok) throw new Error("Could not pull network context records.");
      const data = await res.json();
      if (data.success) {
        setTrainers(data.trainers || []);
        setMetrics(data.metrics);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error synchronizing active professional metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [page]);

  const handleDemote = async (trainer) => {
    const confirmSystem = window.confirm(
      `CRITICAL ACTION ALERT:\nAre you absolutely sure you want to strip all professional credentials from ${trainer.name || "this trainer"}? This will permanently erase their active schedule permissions.`,
    );

    if (!confirmSystem) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/trainers/${trainer._id}/demote`,
        {
          method: "PATCH",
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        // Cleanly re-fetch structural lists to accurately update pagination scales
        fetchTrainers();
      } else {
        toast.error(data.error || "Operation mutation failure.");
      }
    } catch (err) {
      toast.error("Demotion channel interrupted.");
    }
  };

  // Inline styling calculations to dynamically cap or balance the performance progress bar meter
  const getProgressBarWidth = (count) => {
    const maxReference = 250; // Reference peak value matching design visualization bounds
    const percentage = Math.min(100, ((count || 0) / maxReference) * 100);
    return `${percentage}%`;
  };

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen p-6 md:p-10 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Block View */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
              Manage Trainers
            </h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mt-1">
              Review performance, class analytics, and modify trainer
              credentials.
            </p>
          </div>

          {/* Metric Status boxes layout (from image_f559e8.png top right component) */}
          <div className="flex gap-3">
            <div className="bg-[#121214] border border-zinc-900 rounded-lg py-2 px-5 text-center min-w-[100px]">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                Active Trainers
              </span>
              <span className="text-lg font-black text-[#c4e42a] block mt-1">
                {loading ? "..." : metrics.activeTrainers}
              </span>
            </div>
            <div className="bg-[#121214] border border-zinc-900 rounded-lg py-2 px-5 text-center min-w-[100px]">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                Avg. Rating
              </span>
              <span className="text-lg font-black text-cyan-400 block mt-1">
                {loading ? "..." : metrics.avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Data Grid Matrix Log Table Container Box */}
        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center py-20">
              Querying platform coaching registries...
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-zinc-500 text-xs font-black uppercase tracking-widest text-center py-20">
              No active authorized trainers discovered on the platform.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                    <th className="pb-4">Trainer Profile</th>
                    <th className="pb-4">Specialty</th>
                    <th className="pb-4">Classes Created</th>
                    <th className="pb-4">Overall Rating</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/40 text-xs font-bold text-zinc-200">
                  {trainers.map((trainer) => (
                    <tr
                      key={trainer._id}
                      className="group hover:bg-zinc-900/10 transition-all"
                    >
                      {/* Column 1: Profile identity details metrics layout block */}
                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                            <Image
                              src={
                                trainer.image ||
                                "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&auto=format&fit=crop&q=60"
                              }
                              alt={trainer.name || "Professional Profile"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="block uppercase tracking-wide text-zinc-100 font-extrabold text-[13px]">
                              {trainer.name || "Staff Coach"}
                            </span>
                            <span className="block text-[9px] text-zinc-500 font-black tracking-widest uppercase mt-0.5">
                              ID:{" "}
                              {trainer.trainerIdCode ||
                                `TRX-${String(trainer._id).slice(-4).toUpperCase()}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Specialty dynamic pill rendering block context */}
                      <td className="py-5 pr-4">
                        <span className="inline-block bg-lime-950/20 text-[#c4e42a] border border-lime-900/50 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md max-w-[150px] truncate">
                          {trainer.specialty || "High-Intensity Interval"}
                        </span>
                      </td>

                      {/* Column 3: Classes launched with visual metric level bar matching image_f559e8.png */}
                      <td className="py-5 pr-4 min-w-[140px]">
                        <span className="text-zinc-100 font-black text-sm block">
                          {trainer.classesCreatedCount }
                        </span>
                        <div className="w-24 h-1 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                            style={{
                              width: getProgressBarWidth(
                                trainer.classesCreatedCount || 120,
                              ),
                            }}
                          />
                        </div>
                      </td>

                      {/* Column 4: Performance review stars aggregation metric output values */}
                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-1.5 text-[#c4e42a] text-sm">
                          <span>★</span>
                          <span className="text-zinc-100 font-black tracking-tight">
                            {(trainer.rating || 4.8).toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Action Button triggers layer hook links */}
                      <td className="py-5 text-right">
                        <button
                          onClick={() => handleDemote(trainer)}
                          className="bg-transparent border border-red-950/40 hover:bg-red-950/20 hover:border-red-900/60 text-red-400/90 hover:text-red-400 text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-lg transition-all inline-flex items-center gap-1.5"
                        >
                          <span>👤</span> Demote to User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Navigation Interactive Pagination Controls Footer row element blocks */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-zinc-900 mt-6 pt-4 text-xs font-bold text-zinc-500 uppercase tracking-wide">
              <div>
                Showing {pagination.showingCount} of {pagination.totalTrainers}{" "}
                trainers
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
                  { length: pagination.totalPages },
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
