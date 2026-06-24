"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FeaturedClassesSection() {
  const router = useRouter();
  const [featuredClasses, setFeaturedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedClasses = async () => {
      try {
        // Querying the top 3 highest booked classes from the application server
        const res = await fetch(
          "http://localhost:8000/api/classes/featured?limit=3",
        );
        if (!res.ok) throw new Error("Failed to load featured programs");
        const data = await res.json();
        setFeaturedClasses(data.classes || []);
      } catch (error) {
        console.error("Error fetching trending classes data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedClasses();
  }, []);

  return (
    <section className="bg-[#0a0a0c] text-white py-12 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-zinc-900/80 pb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#c4e42a] uppercase block mb-1">
              ELITE PROGRAMS
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-100">
              Selected by high-performance experts.
            </h2>
          </div>
          <button
            onClick={() => router.push("/classes")}
            className="text-[#c4e42a] hover:text-[#b2d122] font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-1 pb-1"
          >
            View All <span className="text-sm">→</span>
          </button>
        </div>

        {/* Loading / Data Grid States */}
        {loading ? (
          <div className="text-zinc-600 text-xs font-bold uppercase tracking-widest py-16 text-center">
            Analyzing booking data profiles...
          </div>
        ) : featuredClasses.length === 0 ? (
          <div className="text-zinc-600 text-xs font-bold uppercase tracking-widest py-16 text-center">
            No active performance classes available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredClasses.map((item) => (
              <div
                key={item._id}
                className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-zinc-800 transition-all duration-300"
              >
                {/* Image Container Segment */}
                <div className="relative h-56 w-full bg-zinc-950 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.className}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">
                      No Image Available
                    </div>
                  )}
                  {/* Visual Performance Status Badge Accent */}
                  {item.bookingCount >= 1000 && (
                    <span className="absolute top-4 right-4 bg-[#c4e42a] text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg">
                      HOT
                    </span>
                  )}
                </div>

                {/* Meta Matrix Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-zinc-500">
                      <span>{item.category || "General Strength"}</span>
                      <span className="text-zinc-400">
                        By {item.trainerName || "Staff Coach"}
                      </span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#c4e42a] transition-colors line-clamp-1">
                      {item.className}
                    </h3>
                    <p className="text-zinc-400 text-xs font-medium line-clamp-2 leading-relaxed">
                      {item.description ||
                        "High-intensity technical training pipeline metrics targeted to push extreme physical adaptations."}
                    </p>
                  </div>

                  {/* Operational Metrics Sub-row */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold border-t border-zinc-900/60 pt-3">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="text-sm">⏱️</span>
                        <span>
                          {item.duration ? `${item.duration} Min` : "60 Min"}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-[#c4e42a]">
                          ${item.price || "0.00"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-300 font-extrabold bg-zinc-900/40 px-2.5 py-1 rounded-lg border border-zinc-900">
                        <span className="text-[#c4e42a]">👥</span>
                        <span>
                          {item.bookingCount?.toLocaleString() || 0} Booked
                        </span>
                      </div>
                    </div>

                    {/* Navigation Interaction Target Trigger */}
                    <button
                      onClick={() => router.push(`/classes/${item._id}`)}
                      className="w-full bg-[#18181c] hover:bg-[#1f1f24] border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 tracking-wide uppercase"
                    >
                      <span>Book Session</span>
                      <span className="text-xs text-zinc-500">📅</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
