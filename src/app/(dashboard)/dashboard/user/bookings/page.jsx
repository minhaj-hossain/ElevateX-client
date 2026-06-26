"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export default function BookedClassesPage() {
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email; // Changed from userId to userEmail

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return; // Prevent fire if user email isn't loaded yet

    const fetchBookedClasses = async () => {
      try {
        // Aligned perfectly with your backend route: /api/user/bookings/:email
        const res = await fetch(
          `http://localhost:8000/api/user/bookings/${userEmail}`,
        );
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        } else {
          toast.error("Failed to recover booking schedules.");
        }
      } catch (err) {
        console.error("Error loading booked classes:", err);
        toast.error("Connection link error mapping data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedClasses();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-600 text-xs font-black uppercase tracking-widest flex items-center justify-center">
        Syncing Class Schedule Records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-10 font-sans selection:bg-[#c4e42a] selection:text-black">
      {/* Header Titles */}
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-1">
          Booked Classes
        </h1>
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide">
          Manage your upcoming high-performance sessions and training schedule.
        </p>
      </div>

      {/* Top Visual Analytical Stat Cards Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5 flex justify-between items-center">
          <div>
            <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
              TOTAL CLASSES
            </span>
            <span className="text-2xl font-black text-white">
              {String(bookings.length).padStart(2, "0")}
            </span>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c4e42a]">
            🏋️
          </div>
        </div>

        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5 flex justify-between items-center">
          <div>
            <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
              UPCOMING THIS WEEK
            </span>
            <span className="text-2xl font-black text-white">
              {String(bookings.length > 0 ? 1 : 0).padStart(2, "0")}
            </span>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[#c4e42a]">
            ⏱️
          </div>
        </div>

        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-5 flex justify-between items-center">
          <div>
            <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
              STATUS
            </span>
            <span className="text-lg font-black text-[#c4e42a] uppercase tracking-wider block mt-1">
              Elite Member
            </span>
          </div>
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-zinc-600">
            🛡️
          </div>
        </div>
      </div>

      {/* Main Core Schedule Data Matrix View Panel */}
      <div className="bg-[#121214] border border-zinc-900 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300">
            Class Schedule
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
            No active booked classes found. Start your journey from the main
            roster.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                  <th className="pb-4">Class Name</th>
                  <th className="pb-4">Trainer Name</th>
                  <th className="pb-4">Schedule</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-xs font-bold">
                {bookings.map((item) => (
                  <tr
                    key={item._id}
                    className="group hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg relative overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800/40">
                          {item.classImage ? (
                            <Image
                              src={item.classImage}
                              alt={item.className || "Class Thumbnail"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-[10px]">
                              GYM
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="block text-zinc-100 font-black uppercase tracking-wide">
                            {item.className || "Performance Session"}
                          </span>
                          <span className="block text-[10px] text-zinc-500 mt-0.5">
                            Intensity: High Performance
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">
                          👤
                        </div>
                        <span>{item.trainerName || "Specialist Staff"}</span>
                      </div>
                    </td>

                    <td className="py-4">
                      <span className="block text-zinc-200">
                        {item.classDate || "Flexible Slots"}
                      </span>
                      <span className="block text-[10px] text-zinc-500 font-medium lowercase mt-0.5">
                        {item.startTime || "06:00 AM EST"}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <Link
                        href={`/classes/${item.classId}`}
                        className="inline-block border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-full transition-all"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
