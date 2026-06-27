"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

export default function ClassDetailsPage() {
  const { classId } = useParams();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  // Domain States
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasBooked, setHasBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (!classId) return;

    const fetchClassDetails = async () => {
      try {
        // 1. Fetch main target class data
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/${classId}`,
        );
        const data = await res.json();
        setClassData(data);

        if (data?.schedule?.length > 0) {
          setSelectedSession(data.schedule[0]);
        }

     
        if (userEmail) {
          // Check if already booked
          const bookingRes = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/check?email=${userEmail}&classId=${classId}`,
          );
          const bookingData = await bookingRes.json();
          // FIXED: Your backend returns 'alreadyBooked', not 'isBooked'
          setHasBooked(!!bookingData.alreadyBooked);

          // Check if already in favorites list
          const favoriteRes = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/check?email=${userEmail}&classId=${classId}`,
          );
          const favoriteData = await favoriteRes.json();
          setIsFavorite(favoriteData.isFavorite);
        }
      } catch (error) {
        console.error("Error loading class specifications:", error);
        toast.error("Failed to load class specifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId, userId, userEmail]);


  // Handle Booking Initiation
  const handleBooking = async () => {
    if (!userId) {
      toast.error("Please login to book a class.");
      return;
    }
    // Secure Role Check Execution Guard
    if (session?.user?.role !== "user") {
      toast.error("Access Denied: Only users are authorized to book sessions.");
      return;
    }

    if (hasBooked) {
      toast.error("You have already booked this class.");
      return;
    }

    try {

      const fallbackPrice = classData?.price
        ? String(classData.price)
        : "45.00";
      const fallbackClassName =
        classData?.name || classData?.title || "Premium Session";
      const fallbackTrainerName =
        classData?.trainerName || 'Marcus "The Hammer" Thorne';

      console.log("Initiating booking for:", {
        classId,
        sessionId: selectedSession,
        className: fallbackClassName,
        price: fallbackPrice,
      });

      // Sending Buyer User metadata + Class/Trainer metadata to checkout route
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userEmail,
          classId,
          sessionId: selectedSession,
          price: fallbackPrice, // Fixed: Guaranteed string/number structure
          className: fallbackClassName, // Fixed: Checked against undefined loop
          trainerName: fallbackTrainerName, // Fixed: Passed actual string from UI fallback
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect the user seamlessly to Stripe Checkout / Payment gateway url
        router.push(data.url);
      } else {
        toast.error(data.error || "Failed to initiate payment session.");
      }
    } catch (error) {
      console.error("Payment session initiation error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Toggle Favorite Collection Records
  const handleFavoriteToggle = async () => {
    if (!userEmail) {
      toast.error("Please login to save favorites.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, classId }),
        },
      );

      const data = await response.json();

      if (data.success) {
        if (data.action === "removed") {
          setIsFavorite(false);
          toast.success("Removed from your favorites.");
        } else if (data.action === "added") {
          setIsFavorite(true);
          toast.success("Successfully added to your favorites!");
        }
      }
    } catch (error) {
      console.error("Failed to process favorite synchronization:", error);
      toast.error("Could not update favorites.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0c] text-zinc-500 min-h-screen flex items-center justify-center text-xs uppercase font-bold tracking-widest">
        Loading Class Configurations...
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="bg-[#0a0a0c] text-zinc-500 min-h-screen flex items-center justify-center text-sm font-semibold">
        Target Class Specifications Not Found.
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen font-sans">
      {/* Banner Backdrop Section Header */}
      <div className="relative h-110 w-full bg-zinc-950">
        {classData.image && (
          <Image
            src={classData.image}
            alt={classData.name || "Class Image"}
            fill
            priority
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-black/40" />

        {/* Absolute Badges */}
        <div className="absolute bottom-8 left-12 flex gap-2">
          <span className="bg-[#c4e42a] text-black text-[11px] font-black px-3 py-1 rounded uppercase tracking-wider">
            {classData.category || "Fitness"}
          </span>
          <span className="bg-zinc-800 text-zinc-300 text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wider border border-zinc-700/50">
            {classData.difficultyLevel || classData.difficulty || "Advanced"}
          </span>
        </div>
        <div className="absolute bottom-16 left-12">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-1">
            {classData.name}
          </h1>
          <p className="text-zinc-400 text-xs font-medium max-w-xl">
            {classData.duration
              ? `${classData.duration} minutes segment session.`
              : "A premium journey into athletic optimization and deep somatic development."}
          </p>
        </div>
      </div>

      {/* Main Breakdown Split Context Container Grid */}
      <div className="px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side Content Parameters Area */}
        <div className="lg:col-span-2 space-y-10">
          {/* Trainer Card Badge Grid Block */}
          <div className="bg-[#121214] border border-zinc-800/60 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full relative overflow-hidden bg-zinc-900 border border-[#c4e42a]">
              {classData.trainerImage && (
                <Image
                  src={classData.trainerImage}
                  alt={classData.trainerName || "Trainer"}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <span className="block text-sm font-black text-white">
                {classData.trainerName || 'Marcus "The Hammer" Thorne'}
              </span>
              <span className="block text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                {classData.trainerRole || "Lead Performance Coach"} •{" "}
                {classData.trainerExperience || "12 Years Experience"}
              </span>
            </div>
          </div>

          {/* Detailed Experience Rich Text Description Layout */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mb-3">
              The Experience
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              {classData.description}
            </p>
          </div>

          {/* Pillars Highlights Specifications Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              classData.pillars || [
                {
                  title: "Explosive Power Generation",
                  desc: "Master the physics of rapid force production.",
                },
                {
                  title: "Neurological Conditioning",
                  desc: "Enhance your CNS response time for better reaction.",
                },
                {
                  title: "Advanced Periodization",
                  desc: "Learn how to cycle intensity for peak performance.",
                },
                {
                  title: "Mobility Under Load",
                  desc: "Strengthen your end-range of motion safely.",
                },
              ]
            ).map((pillar, idx) => (
              <div
                key={idx}
                className="bg-[#121214] border border-zinc-800/40 p-5 rounded-xl flex gap-3.5"
              >
                <span className="text-[#c4e42a] text-sm font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <h5 className="text-white text-xs font-bold mb-1">
                    {pillar.title}
                  </h5>
                  <p className="text-zinc-500 text-[11px] leading-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Scheduling Interactive Checkboxes Area List Component */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 italic mb-4">
              Upcoming Sessions
            </h4>
            <div className="space-y-2">
              {(classData.schedule || []).map((dayName, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedSession(dayName)}
                  className={`border p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    selectedSession === dayName
                      ? "bg-zinc-900 border-[#c4e42a]"
                      : "bg-[#121214] border-zinc-800/40 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-[#19191c] border border-zinc-800 rounded-lg px-3 py-1.5 text-center flex flex-col items-center justify-center min-w-13">
                      <span className="text-[10px] font-extrabold tracking-wider text-[#c4e42a] uppercase">
                        {dayName}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">
                        {classData.startTime || "15:00"} —{" "}
                        {classData.endTime || "16:00"}
                      </span>
                      <span className="block text-[11px] text-zinc-500">
                        Main Arena • Dynamic Slot Allocation
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center pr-2">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedSession === dayName
                          ? "border-[#c4e42a]"
                          : "border-zinc-700"
                      }`}
                    >
                      {selectedSession === dayName && (
                        <div className="w-2 h-2 bg-[#c4e42a] rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Sidebar Conversion Control Column Area Panel */}
        <div className="space-y-6">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-baseline border-b border-zinc-800/40 pb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">
                Single Class
              </span>
              <div className="text-right">
                <span className="text-xl font-black text-[#c4e42a]">
                  ${classData.price || "45.00"}
                </span>
                <span className="text-zinc-500 text-[11px] font-medium block">
                  / Per Session
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                <span>Class Intensity Level</span>
                <span className="text-zinc-300">
                  {classData.difficultyLevel || classData.difficulty || "Elite"}
                </span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-teal-400 to-[#c4e42a] h-full rounded-full"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            {/* Dynamic Action Access Logic Block */}
            <div className="space-y-2.5 pt-2">
              {session?.user?.role === "user" ? (
                <>
                  <button
                    onClick={handleBooking}
                    disabled={hasBooked}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors ${
                      hasBooked
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/20"
                        : "bg-[#c4e42a] hover:bg-[#b0cd23] text-black"
                    }`}
                  >
                    {hasBooked ? "Already Booked" : "⚡ Book Now"}
                  </button>

                  <button
                    onClick={handleFavoriteToggle}
                    className={`w-full py-3 border font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                      isFavorite
                        ? "bg-red-950/30 border-red-800 text-red-400 hover:bg-red-900/40"
                        : "bg-transparent border-zinc-800 text-zinc-200 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>
                      {isFavorite
                        ? "❤️ Saved to Favorites"
                        : "🤍 Add to Favorites"}
                    </span>
                  </button>
                </>
              ) : (
                <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
                    🔒 Booking Restricted
                  </p>
                  <p className="text-zinc-600 text-[10px] mt-1">
                    Only accounts registered as standard clients/users can
                    enroll in active sessions.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-800/40 pt-4 space-y-2">
              <span className="block text-[10px] uppercase font-black tracking-widest text-zinc-500">
                Requirements
              </span>
              <ul className="space-y-1.5 text-zinc-400 text-[11px] font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600">⚠️</span>{" "}
                  {classData.reqOne || "Prior lifting experience (6+ months)"}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600">👟</span>{" "}
                  {classData.reqTwo || "Training footwear required"}
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-800/40 rounded-2xl p-6 space-y-4">
            <span className="block text-[10px] uppercase font-black tracking-widest text-zinc-500">
              About the Trainer
            </span>
            <p className="text-zinc-400 text-xs italic leading-relaxed">
              &quot;
              {classData.trainerQuote ||
                "Success is a byproduct of relentless preparation and disciplined execution."}
              &quot;
            </p>
            <div className="text-[11px] space-y-2 pt-1 border-t border-zinc-800/20">
              <div>
                <span className="block font-bold text-zinc-300">
                  Bio & Qualifications
                </span>
                <span className="text-zinc-500">
                  {classData.trainerBio ||
                    "Ex-National Weightlifting Coach, Specialist in Biomechanics and Power Dynamics."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
