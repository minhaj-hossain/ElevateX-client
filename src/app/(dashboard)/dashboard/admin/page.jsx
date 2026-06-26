"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { authClient } from "@/lib/auth-client";

// Mock data matching the design visualization peaks
const velocityData = [
  { name: "Mon", velocity: 40 },
  { name: "Tue", velocity: 68 },
  { name: "Wed", velocity: 90 },
  { name: "Thu", velocity: 55 },
  { name: "Fri", velocity: 72 },
  { name: "Sat", velocity: 110 },
  { name: "Sun", velocity: 85 },
];

export default function AdminOverviewPage() {
  const [sessionUser, setSessionUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalBooked: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user) setSessionUser(sessionData.user);

        const res = await fetch(
          "http://localhost:8000/api/admin/overview-stats",
        );
        if (!res.ok) throw new Error("Failed to pull system statistics.");
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error reading admin control values:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100 flex items-center gap-2">
              Systems <span className="text-[#c4e42a]">Overview</span>
            </h1>
            <p className="text-zinc-400 text-sm font-medium mt-1">
              Good morning, Jordan. All systems are performing at{" "}
              <span className="text-[#c4e42a]">98.4% efficiency</span>. Recent
              activity spike detected in Class Bookings.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-5 py-2.5 rounded-full border border-[#c4e42a] text-[#c4e42a] text-xs font-bold uppercase tracking-wider hover:bg-[#c4e42a]/10 transition-colors">
              View Logs
            </button>
            <button className="flex-1 md:flex-none bg-[#c4e42a] hover:bg-[#b2d122] text-black px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5">
              <span>📥</span> Export Report
            </button>
          </div>
        </div>

        {/* Dashboard Grid System Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analytics Segment Column (Left/Center) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Stat Performance Matrix Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Total Active Users */}
              <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-800 transition-all">
                <div className="flex justify-between items-start">
                  <span className="p-2 bg-zinc-900 rounded-lg text-lg border border-zinc-800">
                    👥
                  </span>
                  <span className="bg-[#c4e42a]/10 text-[#c4e42a] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                    +12% vs LW
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    Total Active Users
                  </p>
                  <p className="text-2xl font-black text-zinc-100 mt-1">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Card 2: Total Classes */}
              <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-800 transition-all">
                <div className="flex justify-between items-start">
                  <span className="p-2 bg-zinc-900 rounded-lg text-lg border border-zinc-800">
                    🏋️‍♂️
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                    8 New Today
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    Total Classes
                  </p>
                  <p className="text-2xl font-black text-zinc-100 mt-1">
                    {stats.totalClasses}
                  </p>
                </div>
              </div>

              {/* Card 3: Monthly Reservations */}
              <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5 relative overflow-hidden group hover:border-zinc-800 transition-all">
                <div className="flex justify-between items-start">
                  <span className="p-2 bg-zinc-900 rounded-lg text-lg border border-zinc-800">
                    📅
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                    3.2k Booked
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">
                    Monthly Reservations
                  </p>
                  <p className="text-2xl font-black text-zinc-100 mt-1">
                    {stats.totalBooked.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Recharts Platform Velocity Graph Area */}
            <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">
                    Platform Velocity
                  </h3>
                  <p className="text-zinc-500 text-xs font-medium">
                    Real-time engagement tracking across all facilities.
                  </p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[10px] font-bold">
                  <span className="bg-[#c4e42a] text-black px-2.5 py-1 rounded-md cursor-pointer transition-all">
                    W
                  </span>
                  <span className="text-zinc-400 px-2.5 py-1 cursor-pointer hover:text-white transition-all">
                    M
                  </span>
                  <span className="text-zinc-400 px-2.5 py-1 cursor-pointer hover:text-white transition-all">
                    Y
                  </span>
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={velocityData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#4b5563"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#4b5563"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#1f1f24", opacity: 0.3 }}
                      contentStyle={{
                        backgroundColor: "#121214",
                        borderColor: "#27272a",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#c4e42a" }}
                    />
                    <Bar
                      dataKey="velocity"
                      radius={[6, 6, 0, 0]}
                      // Render alternate peak branding colors matching the source image view dashboard theme
                      fill="#c4e42a"
                    >
                      {velocityData.map((entry, index) => (
                        <rect
                          key={`cell-${index}`}
                          fill={
                            index === 2 || index === 5 ? "#a5f3fc" : "#c4e42a"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar Admin Details Component (Right Column) */}
          <div className="space-y-6">
            {/* Admin Bio Profile Card Frame */}
            <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 flex flex-col items-center text-center space-y-5">
              <div className="relative w-28 h-28 rounded-full p-1 border-2 border-[#c4e42a] overflow-hidden">
                <div className="relative w-full h-full rounded-full bg-zinc-800 overflow-hidden">
                  <Image
                    src={sessionUser?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                    alt="Jordan Vane"
                    fill
                    className="object-cover scale-105"
                  />
                </div>
                <span className="absolute bottom-1 right-2 bg-[#c4e42a] text-black text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-xl border border-black">
                  {sessionUser?.role || "Admin"}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  {sessionUser?.name || "Jordan Vane"}
                </h3>
                <p className="text-zinc-500 text-xs font-semibold mt-0.5">
                  {sessionUser?.email || "admin@elevatex.fit"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full border-t border-zinc-900/80 pt-4 text-left">
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                    Role Type
                  </p>
                  <p className="text-xs font-bold text-zinc-200 mt-0.5">
                    Super Admin
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                    Join Date
                  </p>
                  <p className="text-xs font-bold text-zinc-200 mt-0.5">
                    {new Date(sessionUser?.createdAt).toLocaleDateString() || "Jan 15, 2023"}
                  </p>
                </div>
              </div>

              <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs py-2.5 rounded-lg border border-zinc-800 transition-colors">
                Edit Permissions
              </button>
            </div>

            {/* Platform Status Panel */}
            <div className="bg-[#121214] border border-zinc-900 rounded-xl p-4 flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c4e42a] animate-pulse"></span>
                <span className="text-zinc-400">System Uptime</span>
              </div>
              <span className="text-[#c4e42a] font-extrabold tracking-wide">
                99.9%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
