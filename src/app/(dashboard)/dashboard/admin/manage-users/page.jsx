"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeTrainers: 0,
    newSignups: 0,
    flaggedAccounts: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchUsersData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/users");
      if (!res.ok)
        throw new Error("Could not pull network context dashboard records.");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/toggle-block`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentStatus }),
        },
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, status: data.newStatus } : u,
          ),
        );
        setMetrics((prev) => ({
          ...prev,
          flaggedAccounts:
            currentStatus === "Blocked"
              ? prev.flaggedAccounts - 1
              : prev.flaggedAccounts + 1,
        }));
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Request failed.");
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/make-admin`,
        { method: "PATCH" },
      );
      const data = await res.json();
      if (data.success) {
        toast.success("User is now Admin.");
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: "Admin" } : u)),
        );
      } else {
        toast.error(data.error || "Failed to update role.");
      }
    } catch (err) {
      toast.error("Request failed.");
    }
  };

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60";

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen p-6 md:p-10 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-900/80 pb-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
              Manage Users
            </h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mt-1">
              Oversee system access, verify roles, and enforce platform
              standards.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-[#121214] border border-zinc-800 hover:bg-zinc-900 px-4 py-2 rounded-lg text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 transition-all">
              <span>🎛️</span> Filter
            </button>
            <button className="flex-1 sm:flex-none bg-[#121214] border border-zinc-800 hover:bg-zinc-900 px-4 py-2 rounded-lg text-xs font-bold text-zinc-300 flex items-center justify-center gap-1.5 transition-all">
              <span>📄</span> Export CSV
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Total Users
            </span>
            <span className="text-2xl font-black text-white block mt-1">
              {loading ? "..." : metrics.totalUsers.toLocaleString()}
            </span>
            <span className="text-[#c4e42a] text-[10px] font-bold block mt-2">
              📈 +14% this month
            </span>
          </div>
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Active Trainers
            </span>
            <span className="text-2xl font-black text-white block mt-1">
              {loading ? "..." : metrics.activeTrainers}
            </span>
            <span className="text-zinc-500 text-[10px] font-bold block mt-2">
              🛡️ 98% verified
            </span>
          </div>
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              New Signups
            </span>
            <span className="text-2xl font-black text-white block mt-1">
              {loading ? "..." : metrics.newSignups}
            </span>
            <span className="text-[#c4e42a] text-[10px] font-bold block mt-2">
              ⚡ Last 24 hours
            </span>
          </div>
          <div className="bg-[#121214] border border-zinc-900/60 rounded-xl p-5">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Flagged Accounts
            </span>
            <span className="text-2xl font-black text-[#ef4444] block mt-1">
              {loading ? "..." : metrics.flaggedAccounts}
            </span>
            <span className="text-red-400/80 text-[10px] font-bold block mt-2">
              ⚠️ Require action
            </span>
          </div>
        </div>

        {/* Table / Cards */}
        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6">
          {loading ? (
            <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center py-20">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center py-20">
              No users found.
            </div>
          ) : (
            <>
              {/* ── MOBILE CARDS (below md) ── */}
              <div className="md:hidden space-y-4">
                {users.map((user) => {
                  const isBlocked = user.status?.toLowerCase() === "blocked";
                  const isAdmin = user.role?.toLowerCase() === "admin";
                  const isTrainer = user.role?.toLowerCase() === "trainer";

                  return (
                    <div
                      key={user._id}
                      className={`border rounded-xl p-4 transition-all ${
                        isBlocked
                          ? "border-red-900/40 bg-red-950/5 opacity-60"
                          : "border-zinc-800 bg-[#0f0f11]"
                      }`}
                    >
                      {/* Avatar + name + email */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                          <Image
                            src={user.image || FALLBACK_IMAGE}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-black uppercase tracking-wide truncate ${
                              isBlocked
                                ? "line-through text-zinc-500"
                                : "text-zinc-100"
                            }`}
                          >
                            {user.name || "Anonymous"}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Role + Status badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                            isAdmin
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : isTrainer
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          }`}
                        >
                          {user.role || "User"}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                            isBlocked
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBlocked
                                ? "bg-red-500 shadow-[0_0_6px_#ef4444]"
                                : "bg-[#c4e42a] shadow-[0_0_6px_#c4e42a]"
                            }`}
                          />
                          {user.status || "Active"}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2">
                        {!isAdmin && (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider border border-zinc-800 hover:border-purple-900 text-zinc-400 hover:text-purple-400 transition-all"
                          >
                            Make Admin
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleToggleBlock(user._id, user.status)
                          }
                          className={`w-full py-2 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-all ${
                            isBlocked
                              ? "bg-[#1f2410]/20 text-[#c4e42a] border-[#384214] hover:bg-[#c4e42a] hover:text-black"
                              : "border-zinc-800 text-zinc-400 hover:border-red-900/60 hover:text-red-400"
                          }`}
                        >
                          {isBlocked ? "Unblock Account" : "Block"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── DESKTOP TABLE (md and above) ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/40 text-xs font-bold">
                    {users.map((user) => {
                      const isBlocked =
                        user.status?.toLowerCase() === "blocked";
                      const isAdmin = user.role?.toLowerCase() === "admin";
                      const isTrainer = user.role?.toLowerCase() === "trainer";

                      return (
                        <tr
                          key={user._id}
                          className={`group transition-colors ${
                            isBlocked
                              ? "opacity-40 hover:opacity-60 bg-red-950/5"
                              : "hover:bg-zinc-900/20"
                          }`}
                        >
                          {/* Name */}
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 relative rounded-full overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                                <Image
                                  src={user.image || FALLBACK_IMAGE}
                                  alt={user.name || "User"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <span
                                  className={`block uppercase tracking-wide text-zinc-100 ${
                                    isBlocked && "line-through text-zinc-500"
                                  }`}
                                >
                                  {user.name || "Anonymous User"}
                                </span>
                                <span className="block text-[10px] text-zinc-500 font-medium tracking-tight mt-0.5">
                                  {isBlocked
                                    ? "Restricted Account"
                                    : `Joined ${user.joinDate || "Recently"}`}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-4 pr-4 text-zinc-400 font-medium">
                            {user.email}
                          </td>

                          {/* Role */}
                          <td className="py-4 pr-4">
                            <span
                              className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                                isAdmin
                                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                  : isTrainer
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              }`}
                            >
                              {user.role || "User"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isBlocked
                                    ? "bg-red-500 shadow-[0_0_6px_#ef4444]"
                                    : "bg-[#c4e42a] shadow-[0_0_6px_#c4e42a]"
                                }`}
                              />
                              <span
                                className={`text-[11px] uppercase tracking-wide ${
                                  isBlocked ? "text-red-400" : "text-zinc-200"
                                }`}
                              >
                                {user.status || "Active"}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 text-right space-x-2 whitespace-nowrap">
                            {!isAdmin && (
                              <button
                                onClick={() => handleMakeAdmin(user._id)}
                                className="bg-transparent border border-zinc-800 hover:border-purple-900 hover:text-purple-400 text-zinc-400 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-md transition-all"
                              >
                                Make Admin
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleToggleBlock(user._id, user.status)
                              }
                              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all ${
                                isBlocked
                                  ? "bg-[#1f2410]/20 text-[#c4e42a] border-[#384214] hover:bg-[#c4e42a] hover:text-black"
                                  : "bg-transparent border-zinc-800 hover:border-red-900/60 hover:text-red-400 text-zinc-400"
                              }`}
                            >
                              {isBlocked ? "Unblock Account" : "Block"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
