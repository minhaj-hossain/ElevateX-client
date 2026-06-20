"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiChevronDown } from "react-icons/fi";

export default function Hero() {
  // Animation presets for modular, cleaner markup reading
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: custom, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center text-center px-4 md:px-8">
      {/* BACKGROUND GRAPHIC LAYER */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-40 scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920')`,
          }}
        />
        {/* Cinematic Vignette Overlay mapping the dark environment color scheme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[#0a0a0a]/30 backdrop-blur-[1px]" />
      </div>

      {/* FOREGROUND HERO CONTENT CANVAS */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 mt-12">
        {/* CHIP BADGE COMPONENT */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#d2f000]/30 bg-[#d2f000]/10 text-[#d2f000] text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(210,240,0,0.1)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d2f000] animate-pulse" />
          Elite Performance Only
        </motion.div>

        {/* MASSIVE HERO HEADINGS */}
        <div className="space-y-1">
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="text-5xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.9]"
          >
            Elevate
          </motion.h1>
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.25}
            className="text-5xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-[#d2f000] drop-shadow-[0_0_30px_rgba(210,240,0,0.15)] leading-[0.9]"
          >
            Everything
          </motion.h1>
        </div>

        {/* SUBTITLE SUMMARY PARAGRAPH */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0.35}
          className="text-[#c6c9ab] text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium"
        >
          <strong className="text-white font-bold">
            The Next Level of Fitness.
          </strong>{" "}
          Experience cinematic training environments, AI-driven performance
          tracking, and a community of high-achievers.
        </motion.p>

        {/* CALL TO ACTION BUTTON INTERACTIVES */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0.45}
          className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#d2f000] text-[#0a0a0a] text-xs font-black tracking-widest uppercase italic h-12 px-8 rounded-full shadow-[0_4px_20px_rgba(210,240,0,0.3)] hover:bg-[#b8d400] active:scale-95 transition cursor-pointer select-none">
            Start Your Ascent
            <FiArrowUpRight className="text-sm stroke-[3]" />
          </button>

          <button className="w-full sm:w-auto inline-flex items-center justify-center bg-[#1e1e1e]/80 hover:bg-[#2a2a2a] text-white border border-white/10 text-xs font-black tracking-widest uppercase italic h-12 px-8 rounded-full active:scale-95 transition cursor-pointer select-none backdrop-blur-md">
            View The Lab
          </button>
        </motion.div>
      </div>

      {/* FLOATING CORNER BADGE SYSTEM */}
      {/* Left Bottom Corner: Expert Trainers */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 left-6 md:left-12 z-20 hidden sm:block text-left bg-[#131313]/80 backdrop-blur-md border border-white/5 pl-4 pr-10 py-3.5 rounded-xl border-l-2 border-l-[#d2f000]"
      >
        <p className="text-xl font-black text-[#d2f000] tracking-tight">85+</p>
        <p className="text-[9px] uppercase font-bold tracking-widest text-[#c6c9ab] mt-0.5">
          Expert Trainers
        </p>
      </motion.div>

      {/* Right Bottom Corner: Active Members */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 right-6 md:right-12 z-20 hidden sm:block text-left bg-[#131313]/80 backdrop-blur-md border border-white/5 pl-4 pr-10 py-3.5 rounded-xl border-r-2 border-r-[#d2f000]"
      >
        <p className="text-xl font-black text-[#d2f000] tracking-tight">15K+</p>
        <p className="text-[9px] uppercase font-bold tracking-widest text-[#c6c9ab] mt-0.5">
          Active Members
        </p>
      </motion.div>

      {/* BOTTOM CENTER SCROLL SIGNIFIER INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 z-20 flex flex-col items-center gap-1 cursor-pointer select-none pointer-events-none"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#c6c9ab]">
          Scroll
        </span>
        <FiChevronDown className="text-[#d2f000] text-sm" />
      </motion.div>
    </div>
  );
}
