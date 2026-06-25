"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#070708] text-white pt-16 pb-8 px-6 md:px-12 border-t border-zinc-900/60 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Grid Content Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          {/* Brand Introduction Identity (Left Segment) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              {/* Fallback geometric representation of the brand emblem */}
              <div className="w-5 h-5 bg-gradient-to-br from-[#c4e42a] to-zinc-700 rounded-sm transform rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#070708] rounded-xs" />
              </div>
              <span className="text-sm font-black tracking-tight uppercase italic text-zinc-100">
                ElevateX
              </span>
            </div>

            <p className="text-zinc-400 text-xs font-medium max-w-sm leading-relaxed">
              The Next Level of Fitness. High-Performance Management for those
              who demand excellence in every rep, every day.
            </p>

            {/* Social Action Nodes Icons Matrix */}
            <div className="flex items-center gap-4 text-zinc-400 pt-2">
              <a
                href="#"
                className="hover:text-white transition-colors text-sm"
                aria-label="Global Web Link"
              >
                🌐
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors text-sm"
                aria-label="Social Handle Contact Email"
              >
                ✉️
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors text-sm"
                aria-label="Share Connection Network"
              >
                🔗
              </a>
            </div>
          </div>

          {/* Quick Links Navigation Cluster (Center Column) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-black tracking-widest uppercase text-zinc-100">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-xs font-bold text-zinc-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/classes"
                  className="hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4"
                >
                  Classes
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  className="hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4"
                >
                  Forum
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Explicit Contact Target Metrics (Right Column) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-black tracking-widest uppercase text-zinc-100">
              CONTACT
            </h3>
            <div className="space-y-1.5 text-xs font-bold text-zinc-400 leading-relaxed">
              <p>123 Performance Way</p>
              <p>Onyx District, SF 94103</p>
              <a
                href="mailto:info@elevatex.fit"
                className="block text-zinc-400 hover:text-white transition-colors font-medium mt-2"
              >
                info@elevatex.fit
              </a>
            </div>
          </div>
        </div>

        {/* Legal Attribution Sub-Row Block */}
        <div className="pt-8 border-t border-zinc-900/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] md:text-xs font-bold tracking-wide">
          <div className="text-zinc-500">
            © {currentYear} ElevateX. High-Performance Management.
          </div>

          {/* Bottom Accent Slogans Cluster */}
          <div className="flex items-center gap-4 text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">
            <span>PERFORMANCE</span>
            <span>DISCIPLINE</span>
            <span className="text-[#c4e42a] font-black">ELEVATEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
