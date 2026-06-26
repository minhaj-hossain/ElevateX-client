"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function FeaturedClassesSection() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;
  const userRole = session?.user?.role;

  const [featuredClasses, setFeaturedClasses] = useState([]);
  const [bookedStatusMap, setBookedStatusMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedClasses = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/classes/featured?limit=3",
        );
        if (!res.ok) throw new Error("Failed to load featured programs");
        const data = await res.json();
        const classes = data.classes || [];
        setFeaturedClasses(classes);

        // Check if current user already has this slot secured
        if (userEmail && classes.length > 0) {
          const statusChecks = classes.map(async (item) => {
            try {
              const checkRes = await fetch(
                `http://localhost:8000/api/bookings/check?email=${userEmail}&classId=${item._id}`,
              );
              if (checkRes.ok) {
                const checkData = await checkRes.json();
                return { id: item._id, alreadyBooked: checkData.alreadyBooked };
              }
            } catch (err) {
              console.error(err);
            }
            return { id: item._id, alreadyBooked: false };
          });

          const results = await Promise.all(statusChecks);
          const mappedStatus = results.reduce((acc, curr) => {
            acc[curr.id] = curr.alreadyBooked;
            return acc;
          }, {});
          setBookedStatusMap(mappedStatus);
        }
      } catch (error) {
        console.error("Error fetching trending classes data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedClasses();
  }, [userEmail]);

  const handleAction = (classId) => {
    if (userRole && userRole.toLowerCase() !== "user") {
      router.push(`/classes/${classId}`);
      return;
    }
    if (bookedStatusMap[classId]) {
      router.push("/dashboard/user/bookings");
    } else {
      router.push(`/classes/${classId}`);
    }
  };

  return (
    <section className="bg-[#0a0a0c] text-white py-12 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
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
            className="text-[#c4e42a] hover:text-[#b2d122] font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
          >
            View All <span>→</span>
          </button>
        </div>

        {loading ? (
          <div className="text-zinc-600 text-xs font-bold uppercase tracking-widest py-16 text-center">
            Analyzing real-time booking metrics...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredClasses.map((item) => {
              const isBooked = bookedStatusMap[item._id];
              const isNotRegularUser =
                userRole && userRole.toLowerCase() !== "user";

              return (
                <div
                  key={item._id}
                  className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-zinc-800 transition-all duration-300"
                >
                  <div className="relative h-56 w-full bg-zinc-950 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.className}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs">
                        No Image Available
                      </div>
                    )}

                    {isBooked && !isNotRegularUser && (
                      <span className="absolute top-4 left-4 bg-zinc-900/90 text-[#c4e42a] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-zinc-800 backdrop-blur-sm shadow-md">
                        ✓ Already Booked
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black tracking-wider uppercase text-zinc-500">
                        <span>{item.category || "General Strength"}</span>
                        <span className="text-zinc-400">
                          By {item.trainerName || "Staff Coach"}
                        </span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-white line-clamp-1">
                        {item.className}
                      </h3>
                      <p className="text-zinc-400 text-xs font-medium line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold border-t border-zinc-900/60 pt-3">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <span>⏱️</span>
                          <span>
                            {item.duration ? `${item.duration} Min` : "60 Min"}
                          </span>
                          <span className="text-zinc-700">•</span>
                          <span className="text-[#c4e42a]">
                            ${item.price || "0.00"}
                          </span>
                        </div>
                        {/* Dynamic Count Output */}
                        <div className="flex items-center gap-1 text-zinc-300 font-extrabold bg-zinc-900/40 px-2.5 py-1 rounded-lg border border-zinc-900">
                          <span className="text-[#c4e42a]">👥</span>
                          <span>{item.bookingCount || 0} Booked</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAction(item._id)}
                        className={`w-full border font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase ${
                          isBooked && !isNotRegularUser
                            ? "bg-[#1f2410]/40 text-[#c4e42a] border-[#384214]"
                            : "bg-[#18181c] hover:bg-[#1f1f24] border border-zinc-800 text-zinc-200"
                        }`}
                      >
                        <span>
                          {isNotRegularUser
                            ? "View Details"
                            : isBooked
                              ? "Go to Bookings"
                              : "Book Session"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
