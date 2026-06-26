"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiArrowUpRight,
  FiTrendingUp,
  FiCalendar,
  FiPlusSquare,
  FiMail,
  FiBarChart2,
  FiShare2,
  FiMoreVertical,
} from "react-icons/fi";
import { GiWeightLiftingUp } from "react-icons/gi";
import { HiOutlineUserGroup } from "react-icons/hi";
import Image from "next/image";
import MyClassesHeader from "./Header";
import { authClient } from "@/lib/auth-client";

export default function TrainerProfile() {

  const [sessionUser, setSessionUser] = React.useState(null);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  useEffect(() => {
    const trainerSession = async () => {
      const { data: sessionData } = await authClient.getSession();
      if (sessionData?.user) setSessionUser(sessionData.user);
    };
    trainerSession();
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-8"
    >
      <MyClassesHeader />
      {/* PROFILE HEADER CARD */}
      <motion.section variants={itemVariants} className="w-full">
        <div className="glass-card bg-[#1e1e1e]/70 backdrop-blur-3xl border border-white/10 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group ">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#d2f000]/10 blur-[100px] rounded-full group-hover:bg-[#d2f000]/15 transition-colors duration-500" />

          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#d2f000]/50 p-1">
              <div className="w-full h-full rounded-xl overflow-hidden bg-surface-container-highest">
                <Image
                  className="w-full h-full object-cover"
                  alt="Marcus Thorne athletic headshot"
                  fill
                  src={sessionUser?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
                />
              </div>
            </div>
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 md:translate-x-0 md:right-2 bg-[#d2f000] text-[#191e00] px-3 py-0.5 rounded-full font-black text-[10px] tracking-widest uppercase shadow-md whitespace-nowrap">
              Elite
            </div>
          </div>

          {/* Identity Info Panel */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display-lg">
                {sessionUser?.name || "Marcus &quot;The Hammer&quot; Thorne"}
              </h2>
              <span className="bg-[#d2f000] text-[#191e00] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                {sessionUser?.role || "Trainer"}
              </span>
            </div>
            <p className="text-base text-[#c6c9ab] font-medium">
              {sessionUser?.email || "marcus@elevatex.fit"}
            </p>

            {/* Meta Tags badges */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm">
                <FiCheckCircle className="text-[#d2f000] shrink-0" />
                <span className="text-xs text-[#e5e2e1] font-medium">
                  Certified Master Coach
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm">
                <FiClock className="text-[#d2f000] shrink-0" />
                <span className="text-xs text-[#e5e2e1] font-medium">
                  12k+ Hours Trained
                </span>
              </div>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <button className="w-full md:w-auto bg-[#d2f000] text-[#191e00] px-6 py-3 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(210,240,0,0.0)] hover:shadow-[0_0_15px_rgba(210,240,0,0.3)] transition-all duration-300 active:scale-95 cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>
      </motion.section>
      {/* MAIN BENTO GRID METRICS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {/* METRIC CARD: TOTAL CLASSES */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 bg-[#1e1e1e]/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#d2f000] transition-colors duration-300 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#d2f000]/10 rounded-xl text-[#d2f000]">
              <GiWeightLiftingUp className="text-xl" />
            </div>
            <FiArrowUpRight className="text-[#c6c9ab] group-hover:text-[#d2f000] transition-colors cursor-pointer text-xl" />
          </div>
          <div>
            <h3 className="text-[#c6c9ab] text-xs font-bold tracking-wider uppercase mb-1">
              Total Classes Created
            </h3>
            <p className="text-6xl font-black font-display-lg text-white leading-none">
              6
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[#d2f000] text-xs font-bold">
              <FiTrendingUp />
              <span>+2 this month</span>
            </div>
          </div>
        </motion.div>

        {/* METRIC CARD: STUDENTS ENROLLED */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 bg-[#1e1e1e]/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00daf8] transition-colors duration-300 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#00e0ff]/10 rounded-xl text-[#00daf8]">
              <HiOutlineUserGroup className="text-xl" />
            </div>
            <FiArrowUpRight className="text-[#c6c9ab] group-hover:text-[#00daf8] transition-colors cursor-pointer text-xl" />
          </div>
          <div>
            <h3 className="text-[#c6c9ab] text-xs font-bold tracking-wider uppercase mb-1">
              Total Students Enrolled
            </h3>
            <p className="text-6xl font-black font-display-lg text-white leading-none">
              142
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[#00daf8] text-xs font-bold">
              <FiTrendingUp />
              <span>+12% growth</span>
            </div>
          </div>
        </motion.div>

        {/* KINETIC ENERGY TRACKER PERFORMANCE CARD */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 bg-[#1e1e1e]/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between"
        >
          <div className="relative z-10 space-y-2">
            <h3 className="text-lg font-bold text-white font-headline-sm">
              Performance Energy
            </h3>
            <p className="text-[#c6c9ab] text-xs leading-relaxed max-w-60">
              Real-time engagement and caloric burn tracking across all active
              sessions.
            </p>
          </div>
          <div className="relative z-10 pt-6 mt-auto">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
              <span className="text-[#c6c9ab]">Intensity</span>
              <span className="text-[#d2f000]">94% Peak</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-[#d2f000] to-[#00daf8] w-[94%] shadow-[0_0_10px_rgba(210,240,0,0.4)]" />
            </div>
          </div>
        </motion.div>

        {/* DETAILED UPCOMING SESSIONS CARD */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-8 bg-[#1e1e1e]/70 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg md:text-xl font-bold text-white font-headline-sm">
              Upcoming Sessions
            </h3>
            <button className="text-[#d2f000] text-xs font-bold tracking-wider uppercase hover:underline underline-offset-4 cursor-pointer">
              View Calendar
            </button>
          </div>

          <div className="space-y-4">
            {/* Session Block Item 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-[#2a2a2a] flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c6c9ab]">
                  Oct
                </span>
                <span className="text-lg font-black text-[#d2f000] leading-none">
                  12
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-base truncate group-hover:text-[#d2f000] transition-colors">
                  Morning HIIT Protocol
                </h4>
                <p className="text-xs text-[#c6c9ab] mt-1 flex items-center gap-1.5">
                  <FiClock className="shrink-0 text-[#d2f000]" /> 06:30 AM -
                  07:30 AM
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-zinc-600" />
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-zinc-500" />
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-zinc-400" />
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-[#353534] flex items-center justify-center text-[9px] font-bold text-white">
                    +28
                  </div>
                </div>
                <button className="bg-white/5 p-2 rounded-lg text-[#c6c9ab] hover:bg-[#d2f000] hover:text-[#191e00] transition-all cursor-pointer">
                  <FiMoreVertical />
                </button>
              </div>
            </div>

            {/* Session Block Item 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-[#2a2a2a] flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c6c9ab]">
                  Oct
                </span>
                <span className="text-lg font-black text-[#d2f000] leading-none">
                  12
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-base truncate group-hover:text-[#d2f000] transition-colors">
                  Advanced Strength Lab
                </h4>
                <p className="text-xs text-[#c6c9ab] mt-1 flex items-center gap-1.5">
                  <FiClock className="shrink-0 text-[#d2f000]" /> 05:00 PM -
                  06:30 PM
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-blue-600" />
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-blue-500" />
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-blue-400" />
                  <div className="w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-[#353534] flex items-center justify-center text-[9px] font-bold text-white">
                    +12
                  </div>
                </div>
                <button className="bg-white/5 p-2 rounded-lg text-[#c6c9ab] hover:bg-[#d2f000] hover:text-[#191e00] transition-all cursor-pointer">
                  <FiMoreVertical />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* QUICK ACTION CONTROLS BUTTON GRID */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 grid grid-cols-2 gap-4"
        >
          <button className="glass-card bg-[#1e1e1e]/70 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 hover:bg-[#d2f000]/5 transition-all text-center group cursor-pointer">
            <FiPlusSquare className="text-[#d2f000] text-2xl group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e5e2e1]">
              New Goal
            </span>
          </button>

          <button className="glass-card bg-[#1e1e1e]/70 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 hover:bg-[#d2f000]/5 transition-all text-center group cursor-pointer">
            <FiMail className="text-[#d2f000] text-2xl group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e5e2e1]">
              Messages
            </span>
          </button>

          <button className="glass-card bg-[#1e1e1e]/70 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 hover:bg-[#d2f000]/5 transition-all text-center group cursor-pointer">
            <FiBarChart2 className="text-[#d2f000] text-2xl group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e5e2e1]">
              Reports
            </span>
          </button>

          <button className="glass-card bg-[#1e1e1e]/70 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 hover:bg-[#d2f000]/5 transition-all text-center group cursor-pointer">
            <FiShare2 className="text-[#d2f000] text-2xl group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#e5e2e1]">
              Referral
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
