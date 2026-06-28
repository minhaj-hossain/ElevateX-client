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
import { IoFitnessSharp } from "react-icons/io5";

export default function ClassManagement() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // States handling the Delete Modal visibility and tracking target class ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const { data: session } = authClient.useSession();
  const trainerId = session?.user?.id;

  const getData = async () => {
    if (!trainerId) return;

    const { data: tokenData } = await authClient.token();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/getClasses/${trainerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        },
      );
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [trainerId]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const H = parseInt(hour, 10);
    const ampm = H >= 12 ? "PM" : "AM";
    const h = H % 12 || 12;
    return `${String(h).padStart(2, "0")}:${minute} ${ampm}`;
  };

  const filteredClasses = classes.filter((cls) => {
    if (activeFilter === "All") return true;
    return cls.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  // Triggers the modal popup and sets the targeted item tracking ID
  const openDeleteModal = (id) => {
    setSelectedClassId(id);
    setIsModalOpen(true);
  };

  
  const handleConfirmDelete = async () => {
    if (!selectedClassId) return;

    const { data: tokenData } = await authClient.token();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/deleteClass/${selectedClassId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        },
      );
      if (response.ok) {
   
        setClasses((prev) =>
          prev.filter((item) => item._id !== selectedClassId),
        );
        setIsModalOpen(false);
        setSelectedClassId(null);
      }
    } catch (error) {
      console.error("Error deleting target entity:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0c0c0e] text-zinc-400 min-h-screen flex items-center justify-center text-sm font-medium">
        Loading classes...
      </div>
    );
  }

  return (
    <div className="bg-[#0c0c0e] text-zinc-300 p-8 min-h-screen font-sans relative">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center mb-6">
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
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-4">
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

                <td className="p-4">
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300">
                    {cls.category || "General"}
                  </span>
                </td>

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

                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/trainer/my-classes/${cls._id}`}>
                      <button className="p-2 bg-zinc-800/60 hover:bg-zinc-700/60 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors">
                        <HiPencil size={16} />
                      </button>
                    </Link>

                    {/* Trash Button triggering localized modal state */}
                    <button
                      onClick={() => openDeleteModal(cls._id)}
                      className="p-2 bg-zinc-800/60 hover:bg-zinc-700/60 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                    >
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

      {/* FIXED EXACT DESIGN DELETE MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-110 bg-[#161615] border border-white/10 rounded-[28px] p-8 text-center shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
            {/* Warning Icon Container */}
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength="1"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-[26px] font-bold text-white tracking-wide mb-3">
              Delete Class?
            </h2>

            <p className="text-[#a4a4a3] text-[14px] leading-relaxed px-2 mb-8">
              Are you sure you want to delete this class? This action cannot be
              undone. All registration data and historical records for this
              session will be permanently removed.
            </p>

            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3.5 bg-[#99000a] text-white font-bold text-[15px] rounded-full hover:bg-red-700 transition-colors"
              >
                Delete
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedClassId(null);
                }}
                className="w-full py-3.5 bg-transparent border border-white/10 text-white font-bold text-[15px] rounded-full hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
