"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPencil,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import {
  IoFitnessSharp,
  IoSparklesSharp,
  IoFlashlightOutline,
} from "react-icons/io5";

export default function ClassManagement() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const trainerId = session?.user?.id;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/getClasses/${trainerId}`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [trainerId]);

  // Time formatting helper
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const H = parseInt(hour, 10);
    const ampm = H >= 12 ? "PM" : "AM";
    const h = H % 12 || 12;
    return `${String(h).padStart(2, "0")}:${minute} ${ampm}`;
  };

  // Dynamically filters classes based on selected filter button
  const filteredClasses = classes.filter((cls) => {
    if (activeFilter === "All") return true;
    return cls.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="bg-[#0c0c0e] text-zinc-400 min-h-screen flex items-center justify-center text-sm font-medium">
        Loading classes...
      </div>
    );
  }

  return (
    <div className="bg-[#0c0c0e] text-zinc-300 p-8 min-h-screen font-sans">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center mb-6">
        {/* Filters */}
        <div className="flex gap-2">
          {["All", "Approved", "Pending"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "border border-lime-400 text-lime-400 bg-lime-400/10"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Create Button */}
        <Link href="/dashboard/trainer/add-class">
          <button className="flex items-center gap-2 bg-[#d4f227] text-black font-semibold px-4 py-2.5 rounded-full text-sm hover:bg-[#c1dd20] transition-colors">
            <HiPlus className="text-lg" />
            Create New Class
          </button>
        </Link>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#18181b] rounded-2xl border border-zinc-800/80 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-xs font-semibold tracking-wider bg-zinc-900/30">
              <th className="p-4 pl-6">Class Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Schedule</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60">
            {filteredClasses.map((cls) => (
              <tr
                key={cls._id}
                className="hover:bg-zinc-900/20 transition-colors"
              >
                {/* Class Info */}
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-4">
                    {/* Fallback styling placeholder using properties from DB dynamically if needed */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-800 border border-zinc-700/50">
                      <IoFitnessSharp className="text-lime-400 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100 text-sm">
                        {cls.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Level: {cls.difficulty || "All Levels"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category Badge */}
                <td className="p-4">
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300">
                    {cls.difficulty || "General"}
                  </span>
                </td>

                {/* Schedule Integration */}
                <td className="p-4">
                  <div className="text-xs font-semibold text-zinc-300">
                    {cls.schedule?.join(", ") || "No Schedule Specified"}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {cls.startTime && cls.endTime
                      ? `${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}`
                      : "TBD"}
                  </div>
                </td>

                {/* Status indicator */}
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cls.status?.toLowerCase() === "approved"
                          ? "bg-lime-400"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span
                      className={
                        cls.status?.toLowerCase() === "approved"
                          ? "text-lime-400"
                          : "text-yellow-500"
                      }
                    >
                      {cls.status
                        ? cls.status.charAt(0).toUpperCase() +
                          cls.status.slice(1)
                        : "Pending"}
                    </span>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 bg-zinc-800/60 hover:bg-zinc-700/60 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors">
                      <HiPencil size={16} />
                    </button>
                    <button className="p-2 bg-zinc-800/60 hover:bg-zinc-700/60 rounded-lg text-zinc-400 hover:text-red-400 transition-colors">
                      <HiTrash size={16} />
                    </button>
                    <button className="ml-2 px-4 py-1.5 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-200 text-xs font-bold rounded-full border border-zinc-700/40 transition-all">
                      View Students
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-4 px-6 flex justify-between items-center bg-zinc-900/10 border-t border-zinc-800 text-xs text-zinc-500">
          <div>
            Showing 1-{filteredClasses.length} of {filteredClasses.length}{" "}
            classes
          </div>
          <div className="flex gap-1">
            <button
              className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50"
              disabled
            >
              <HiChevronLeft size={16} />
            </button>
            <button className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-lime-400 hover:bg-zinc-800 transition-colors">
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
