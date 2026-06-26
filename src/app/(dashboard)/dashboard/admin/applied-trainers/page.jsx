"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AppliedTrainersPage() {
  const [applications, setApplications] = useState([]);
  const [metrics, setMetrics] = useState({
    totalPending: 0,
    newToday: 0,
    avgExperience: "0y",
    specialtiesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null); // Active application for the details modal
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/admin/trainer-applications",
      );
      if (!res.ok) throw new Error("Network pipeline reading failure.");
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications || []);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error synchronizing pending application datasets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (actionType) => {
    if (!selectedApp) return;
    setProcessing(true);

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/trainer-applications/${selectedApp._id}/process`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: actionType,
            feedback,
            userEmail: selectedApp.email,
          }),
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        // Cleanly remove the item from local state list
        setApplications((prev) =>
          prev.filter((item) => item._id !== selectedApp._id),
        );
        setMetrics((prev) => ({
          ...prev,
          totalPending: Math.max(0, prev.totalPending - 1),
        }));
        closeModal();
      } else {
        toast.error(data.error || "Action process execution anomaly.");
      }
    } catch (err) {
      toast.error("Failed to emit application resolution parameters.");
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (app) => {
    setSelectedApp(app);
    setFeedback("");
  };

  const closeModal = () => {
    setSelectedApp(null);
    setFeedback("");
  };

  // Helper utility to get random initials for placeholder avatars matching layout image_f4ea42.png
  const getInitials = (name) => {
    if (!name) return "TR";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen p-6 md:p-10 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Block Section */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
            Trainer Applications
          </h1>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mt-1">
            Review qualifications, background files, and authorize expert
            dashboard permissions.
          </p>
        </div>

        {/* Dashboard Status Score Summary Cards (from image_f4ea42.png layout fields) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Total Pending
            </span>
            <span className="text-3xl font-black text-[#c4e42a] block mt-2">
              {loading ? "..." : metrics.totalPending}
            </span>
          </div>
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              New Today
            </span>
            <span className="text-3xl font-black text-zinc-100 block mt-2">
              {loading ? "..." : String(metrics.newToday).padStart(2, "0")}
            </span>
          </div>
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Avg. Experience
            </span>
            <span className="text-3xl font-black text-zinc-100 block mt-2">
              {loading ? "..." : metrics.avgExperience}
            </span>
          </div>
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Specialties
            </span>
            <span className="text-3xl font-black text-zinc-100 block mt-2">
              {loading ? "..." : metrics.specialtiesCount}
            </span>
          </div>
        </div>

        {/* Applications Main Roster Data Grid Table Panel */}
        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center py-20">
              Querying qualification entry arrays...
            </div>
          ) : applications.length === 0 ? (
            <div className="text-zinc-500 text-xs font-black uppercase tracking-widest text-center py-20">
              No outstanding pending trainer files on standard review queues.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                    <th className="pb-4">Applicant Name</th>
                    <th className="pb-4">Specialty</th>
                    <th className="pb-4">Experience</th>
                    <th className="pb-4">Date Applied</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/40 text-xs font-bold text-zinc-200">
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="group hover:bg-zinc-900/20 transition-all"
                    >
                      {/* Name initials badge element box alignment */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 text-[11px] font-black rounded-full bg-zinc-900 border border-zinc-800 text-[#c4e42a] flex items-center justify-center shrink-0 tracking-tighter">
                            {getInitials(app.name)}
                          </div>
                          <span className="uppercase tracking-wide text-zinc-100 font-extrabold">
                            {app.name}
                          </span>
                        </div>
                      </td>

                      {/* Specialty code badge layout field selection */}
                      <td className="py-4 pr-4">
                        <span className="inline-block bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                          {app.specialty || "General"}
                        </span>
                      </td>

                      {/* Experience range string metric field values output */}
                      <td className="py-4 pr-4 text-zinc-400">
                        {app.experience ? `${app.experience} Years` : "N/A"}
                      </td>

                      {/* Created date log field formatting segment mapping */}
                      <td className="py-4 pr-4 text-zinc-500">
                        {app.dateApplied ||
                          new Date(
                            app.createdAt || Date.now(),
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                      </td>

                      {/* Detail structural execution focus toggle triggers item hook link lines */}
                      <td className="py-4 text-right">
                        <button
                          onClick={() => openModal(app)}
                          className="text-[#c4e42a] hover:text-[#b2d122] font-black uppercase tracking-wider text-[11px] transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modular Administrative Review Overlay Dialog Modal Layer */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-fadeIn">
            <div className="bg-[#121214] border border-zinc-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl relative p-6 space-y-6">
              {/* Header Info Banner segment */}
              <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                <div>
                  <h3 className="text-sm font-black uppercase text-zinc-400 tracking-wider">
                    Review File Matrix
                  </h3>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white mt-1">
                    {selectedApp.name}
                  </h2>
                  <p className="text-[11px] text-zinc-500 font-bold tracking-wide">
                    {selectedApp.email}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-zinc-500 hover:text-white transition-all text-sm font-bold p-1 bg-zinc-900 rounded border border-zinc-800"
                >
                  ✕
                </button>
              </div>

              {/* Data Specifications Grid List Block Context */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-900/80 text-xs">
                <div>
                  <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    Specialty Tiers
                  </span>
                  <span className="block font-bold text-cyan-400 uppercase tracking-wider mt-1">
                    {selectedApp.specialty}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    Experience Matrix
                  </span>
                  <span className="block font-bold text-zinc-200 mt-1">
                    {selectedApp.experience} Years Verified
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    Target Class Time
                  </span>
                  <span className="block font-bold text-zinc-200 mt-1">
                    {selectedApp.time || "Flexible Schedule"}
                  </span>
                </div>
              </div>

              {/* Administrative Feedback Input Box Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                  Administrative Evaluation Feedback Notes
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide explicit reasons if rejecting, or write layout verification parameters for approval records logs..."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-xs text-zinc-100 font-semibold focus:outline-none focus:border-zinc-700 placeholder-zinc-700 resize-none transition-all"
                />
              </div>

              {/* Modal Confirmation Operations Actions Buttons Control Bar Row */}
              <div className="flex items-center gap-3 border-t border-zinc-900 pt-4">
                <button
                  disabled={processing}
                  onClick={() => handleAction("Reject")}
                  className="flex-1 bg-transparent border border-red-900/60 hover:bg-red-950/20 text-red-400 font-black text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all disabled:opacity-40"
                >
                  Reject Candidate
                </button>
                <button
                  disabled={processing}
                  onClick={() => handleAction("Approve")}
                  className="flex-1 bg-[#c4e42a] hover:bg-[#b2d122] text-black font-black text-xs uppercase tracking-wider py-2.5 rounded-lg transition-all shadow-lg disabled:opacity-40"
                >
                  {processing ? "Updating State..." : "Approve & Promote"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
