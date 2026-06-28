"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // Adjust based on your configuration

const CATEGORIES = [
  "ALL FAVORITES",
  "HIIT",
  "STRENGTH",
  "RECOVERY",
  "BOXING",
  "CARDIO",
];

export default function FavoriteClassesPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL FAVORITES");
  const [loading, setLoading] = useState(true);

  // 1. Authenticate user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user) {
          setSessionUser(sessionData.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
      }
    };
    checkSession();
  }, [router]);

  // 2. Fetch user's saved favorites
  const fetchFavorites = async () => {
    if (!sessionUser?.email) return;

    const { data: tokenData } = await authClient.token();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites?email=${sessionUser.email}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionUser?.email) {
      fetchFavorites();
    }
  }, [sessionUser?.email]);

  // 3. Remove a class from favorites
  const handleRemoveFavorite = async (classId) => {
    if (!sessionUser?.email) return;

    const { data: tokenData } = await authClient.token();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({ email: sessionUser.email, classId }),
        },
      );

      if (res.ok) {
        // Optimistically update the UI state
        setFavorites((prev) => prev.filter((item) => item._id !== classId));
      }
    } catch (err) {
      console.error("Error updating favorite status:", err);
    }
  };

  // 4. Filter logic matching UI controls
  const filteredFavorites = favorites.filter((item) => {
    if (activeFilter === "ALL FAVORITES") return true;
    return item.category?.toUpperCase() === activeFilter.toUpperCase();
  });

  if (loading || !sessionUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-600 text-xs font-black uppercase tracking-widest flex items-center justify-center">
        Loading Saved Roster...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Block matching image_ddf43f.jpg layout specifications */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-100">
              Favorite Classes
            </h1>
            <p className="text-zinc-500 text-xs font-semibold mt-0.5">
              Curated collection of your most intense training sessions.
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-full self-start md:self-auto">
            {favorites.length} {favorites.length === 1 ? "Class" : "Classes"}{" "}
            Saved
          </div>
        </div>

        {/* Filter Navigation Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-150 whitespace-nowrap ${
                activeFilter === category
                  ? "bg-white text-black border-white"
                  : "bg-zinc-900/40 text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Classes Display Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-[#121214] border border-zinc-900 rounded-xl p-12 text-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
            No matching training logs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((item) => {
              // Custom wide grid display layout styling specifically optimized for Recovery category tags matching image_ddf43f.jpg
              const isRecoveryLayout =
                item.category?.toUpperCase() === "RECOVERY";

              return (
                <div
                  key={item._id}
                  className={`bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden group flex flex-col justify-between ${
                    isRecoveryLayout
                      ? "md:col-span-2 lg:col-span-2 md:flex-row"
                      : ""
                  }`}
                >
                  {/* Card Visual Node */}
                  <div
                    className={`relative bg-zinc-950 min-h-[220px] ${isRecoveryLayout ? "md:w-1/2" : "w-full"}`}
                  >
                    <Image
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd"
                      }
                      alt={item.title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Label Pin */}
                    <span className="absolute left-4 bottom-4 bg-white text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      {item.tag || item.category}
                    </span>

                    {/* Active Delete/Heart Button Control */}
                    <button
                      onClick={() => handleRemoveFavorite(item._id)}
                      className="absolute right-4 top-4 w-8 h-8 rounded-full bg-black/60 border border-zinc-800 flex items-center justify-center text-red-500 hover:bg-black hover:scale-110 transition-all shadow-lg"
                      title="Remove from Saved Favorites"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Card Descriptive Content Area */}
                  <div
                    className={`p-5 flex flex-col justify-between flex-1 ${isRecoveryLayout ? "md:w-1/2" : "w-full"}`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-black uppercase tracking-tight text-zinc-100 line-clamp-1">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-zinc-400 font-bold tracking-wide shrink-0 whitespace-nowrap mt-0.5">
                          ⏱️ {item.duration || "45"} MIN
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs font-medium leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Row Actions Profile Mapping */}
                    <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 overflow-hidden relative">
                          <Image
                            src={
                              item.coachImage ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                            }
                            alt={item.coachName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-zinc-300">
                          {item.coachName || "Coach"}
                        </span>
                      </div>

                      <button className="text-[10px] font-black uppercase tracking-widest text-zinc-100 hover:text-[#c4e42a] flex items-center gap-1 group/btn transition-colors">
                        {isRecoveryLayout ? "RESUME" : "START SESSION"}
                        <span className="group-hover/btn:translate-x-0.5 transition-transform">
                          ⊙
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
    </div>
  );
}
