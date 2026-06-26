"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function ClassManagementPage() {
  const [classes, setClasses] = useState([]);
  const [metrics, setMetrics] = useState({ pendingCount: 0, approvedCount: 0 });
  const [pagination, setPagination] = useState({
    totalClasses: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/classes?page=${page}&limit=4`,
      );
      if (!res.ok) throw new Error("Could not pull dynamic class records.");
      const data = await res.json();
      if (data.success) {
        setClasses(data.classes || []);
        setMetrics(data.metrics);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error synchronizing submitted programs data grid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page]);

  const handleUpdateStatus = async (classId, nextStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/classes/${classId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        // Optimized state preservation swap
        setClasses((prev) =>
          prev.map((item) =>
            item._id === classId ? { ...item, status: nextStatus } : item,
          ),
        );
        // Refresh analytic status counts
        fetchClasses();
      } else {
        toast.error(data.error || "Status update failure.");
      }
    } catch (err) {
      toast.error("Operation mutation error.");
    }
  };

  const handleDeleteClass = async (classId, className) => {
    const verifyPurge = window.confirm(
      `DANGER WARN:\nAre you sure you want to permanently delete "${className}"? This clears all nested booking relations associated with this program.`,
    );
    if (!verifyPurge) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/classes/${classId}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchClasses();
      } else {
        toast.error(data.error || "Failed to remove submission.");
      }
    } catch (err) {
      toast.error("Purge mutation channel interrupted.");
    }
  };

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen p-6 md:p-10 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Block Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
              Class Management
            </h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mt-1">
              Review and moderate new fitness programs submitted by trainers.
            </p>
          </div>

          {/* Metric Status Header Quick Pills */}
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-2 bg-[#121214] border border-zinc-900 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#c4e42a]" />
              <span className="text-zinc-400">
                {metrics.pendingCount} Pending
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#121214] border border-zinc-900 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-zinc-400">
                {metrics.approvedCount} Approved
              </span>
            </div>
          </div>
        </div>

        {/* Classes Core Data Grid Table Display */}
        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center py-20">
              Querying fitness curriculum rosters...
            </div>
          ) : classes.length === 0 ? (
            <div className="text-zinc-500 text-xs font-black uppercase tracking-widest text-center py-20">
              No submitted coaching curriculum logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                    <th className="pb-4">Class Name</th>
                    <th className="pb-4">Trainer</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/40 text-xs font-bold text-zinc-200">
                  {classes.map((item) => {
                    const isPending = item.status?.toUpperCase() === "PENDING";
                    const isApproved =
                      item.status?.toUpperCase() === "APPROVED";
                    const isRejected =
                      item.status?.toUpperCase() === "REJECTED";

                    return (
                      <tr
                        key={item._id}
                        className="group hover:bg-zinc-900/10 transition-all"
                      >
                        {/* Column 1: Class Core Profile Information Meta Block */}
                        <td className="py-5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                              <Image
                                src={
                                  item.image ||
                                  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=120&auto=format&fit=crop&q=60"
                                }
                                alt={item.className || "Class Thumbnail"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <span className="block uppercase tracking-wide text-zinc-100 font-extrabold text-[13px] line-clamp-1">
                                {item.className}
                              </span>
                              <span className="block text-[9px] text-zinc-500 font-black tracking-widest uppercase mt-0.5">
                                ID:{" "}
                                {item.classIdCode ||
                                  `CL-${String(item._id).slice(-4).toUpperCase()}`}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Assigned Submitting Trainer */}
                        <td className="py-5 pr-4 text-zinc-300">
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <span>👤</span>
                            <span className="uppercase tracking-wide text-[11px] font-extrabold">
                              {item.trainerName || "Staff Pro"}
                            </span>
                          </div>
                        </td>

                        {/* Column 3: Category Pill Block */}
                        <td className="py-5 pr-4">
                          <span className="inline-block bg-zinc-900 border border-zinc-800/80 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                            {item.category || "Strength"}
                          </span>
                        </td>

                        {/* Column 4: Process Status Indicator Row Label */}
                        <td className="py-5 pr-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isPending
                                  ? "bg-[#c4e42a] shadow-[0_0_6px_#c4e42a]"
                                  : isApproved
                                    ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                                    : "bg-red-500 shadow-[0_0_6px_#ef4444]"
                              }`}
                            />
                            <span
                              className={`text-[11px] font-black uppercase tracking-wide ${
                                isPending
                                  ? "text-[#c4e42a]"
                                  : isApproved
                                    ? "text-cyan-400"
                                    : "text-red-400"
                              }`}
                            >
                              {item.status || "PENDING"}
                            </span>
                          </div>
                        </td>

                        {/* Column 5: Actions Grid Panel Buttons */}
                        <td className="py-5 text-right whitespace-nowrap space-x-1.5">
                          {/* Approve Button */}
                          <button
                            disabled={isApproved}
                            onClick={() =>
                              handleUpdateStatus(item._id, "Approved")
                            }
                            title="Approve Program"
                            className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                              isApproved
                                ? "bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed"
                                : "bg-[#c4e42a] text-black border-[#c4e42a] hover:bg-[#b2d122]"
                            }`}
                          >
                            ✓
                          </button>

                          {/* Reject Button */}
                          <button
                            disabled={isRejected}
                            onClick={() =>
                              handleUpdateStatus(item._id, "Rejected")
                            }
                            title="Reject Program"
                            className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                              isRejected
                                ? "bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed"
                                : "bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                            }`}
                          >
                            ✕
                          </button>

                          {/* Delete Purge Button */}
                          <button
                            onClick={() =>
                              handleDeleteClass(item._id, item.className)
                            }
                            title="Delete Permanently"
                            className="p-2 rounded-lg text-xs font-bold bg-transparent border border-zinc-800 text-zinc-500 hover:border-red-950 hover:bg-red-950/20 hover:text-red-400 transition-all"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Component Interface Blocks Container */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-zinc-900 mt-6 pt-4 text-xs font-bold text-zinc-500 uppercase tracking-wide">
              <div>
                Showing {pagination.showingCount} of {pagination.totalClasses}{" "}
                submissions
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
