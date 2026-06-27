"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Added for clean routing
import { authClient } from "@/lib/auth-client";

export default function UserDashboardOverview() {
  const [sessionUser, setSessionUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Better-Auth Session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user) setSessionUser(sessionData.user);
      } catch (err) {
        console.error("Session fetch error:", err);
      }
    };
    checkSession();
  }, []);

  // 2. Fetch Dashboard Metrics
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      if (!sessionUser?.email) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/dashboard-overview?email=${sessionUser.email}`,
        );
        if (res.ok) {
          const data = await res.json();

          console.log("Dashboard Data:", data); // Debugging log
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [sessionUser?.email]);

  if (loading || !sessionUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-600 text-xs font-black uppercase flex items-center justify-center tracking-widest">
        Syncing Performance Trajectory Matrix...
      </div>
    );
  }

  const { counts, trainerApplication } = dashboardData || {};

  // Extract and normalize current application statuses
  const rawStatus = trainerApplication?.status?.toLowerCase() || "not applied";
  const isPending = rawStatus === "pending";
  const isRejected = rawStatus === "rejected";
  const hasNeverApplied = rawStatus === "not applied" || !trainerApplication;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            ELEVATE YOUR <span className="text-[#c4e42a]">LIMITS</span>
          </h1>
          <p className="text-zinc-400 text-xs font-medium mt-1">
            Welcome back, {sessionUser.name || "Athlete"}. Push harder today.
          </p>
        </div>

        {/* Dynamic Metric Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 flex flex-col justify-between h-36">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block mb-2">
                TOTAL BOOKED CLASSES
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black tracking-tight text-[#c4e42a]">
                  {counts?.bookedClasses || 0}
                </span>
              </div>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#c4e42a] h-full w-[45%]" />
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 flex flex-col justify-between h-36">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 block mb-2">
                TOTAL FAVORITES
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-zinc-100">
                  {counts?.favorites || 0}
                </span>
              </div>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-zinc-700 h-full w-[25%]" />
            </div>
          </div>
        </div>

        {/* Core Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: User Profile Card */}
          <div className="lg:col-span-4 bg-[#121214] border border-zinc-900 rounded-xl p-6 flex flex-col items-center text-center space-y-6">
            <div className="relative w-28 h-28 rounded-full p-1 border-2 border-[#c4e42a] bg-zinc-950 overflow-hidden">
              <Image
                src={
                  sessionUser.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                }
                alt="Profile Avatar"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="space-y-1">
              <span className="inline-block bg-[#c4e42a] text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                {sessionUser.role || "USER"}
              </span>
              <h2 className="text-lg font-black uppercase text-zinc-100">
                {sessionUser.name}
              </h2>
              <p className="text-zinc-500 text-xs">{sessionUser.email}</p>
            </div>
          </div>

          {/* Right Column: Dynamic Action Board */}
          <div className="lg:col-span-8 bg-[#121214] border border-zinc-900 rounded-xl p-6 space-y-6">
            {/* STATE 1: NEVER APPLIED (Clean Redirect) */}
            {hasNeverApplied && (
              <div className="py-10 text-center space-y-4">
                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-100">
                  Step Up as a Trainer
                </h3>
                <p className="text-zinc-400 text-xs max-w-md mx-auto leading-relaxed mb-6">
                  You are currently registered as a standard athlete. Apply to
                  acquire credential tokens, create specialized training
                  courses, and scale your client tracking globally.
                </p>
                <Link
                  href="/apply-trainer"
                  className="bg-[#c4e42a] hover:bg-[#b5d325] text-black text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all inline-block"
                >
                  Apply to be a Trainer
                </Link>
              </div>
            )}

            {/* STATE 2: APPLICATION IS PENDING */}
            {isPending && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black uppercase text-zinc-100">
                      Trainer Application Status
                    </h3>
                    <p className="text-zinc-500 text-[11px] font-semibold mt-0.5">
                      Our administrative staff is analyzing your qualifications
                      profile.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-zinc-900 text-[#c4e42a] border border-[#c4e42a]/20 px-3 py-1 rounded-lg">
                    ⏳ PENDING REVIEW
                  </span>
                </div>
                <div className="bg-[#18181c] border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400">
                  Applications take up to 48 hours to cross-reference. You will
                  be notified instantly here upon determination.
                </div>
              </div>
            )}

            {/* STATE 3: APPLICATION IS REJECTED */}
            {isRejected && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black uppercase text-zinc-100">
                      Trainer Application Status
                    </h3>
                    <p className="text-zinc-500 text-[11px] font-semibold mt-0.5">
                      Review round completed.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-red-950/40 text-red-500 border border-red-900/50 px-3 py-1 rounded-lg">
                    🚫 DISAPPROVED
                  </span>
                </div>

                <div className="bg-[#18181c] border-l-2 border-red-500 rounded-r-xl p-4 space-y-1">
                  <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wide">
                    Administrative Feedback
                  </h4>
                  <p className="text-zinc-400 text-xs italic font-medium">
                    &quot;
                    {trainerApplication?.feedback ||
                      "Submission parameters did not meet entry thresholds."}
                    &quot;
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/apply-trainer"
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider px-6 py-3 rounded-full transition-all"
                  >
                    Adjust Details & Re-Apply
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
