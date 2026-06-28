"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import { authClient } from "@/lib/auth-client";

const CATEGORIES = [
  "All Categories",
  "Yoga",
  "Cardio",
  "Strength",
  "HIIT",
  "Endurance",
  "Recovery",
];

export default function ClassesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All Categories";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [classes, setClasses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search: currentSearch,
          category: currentCategory,
          page: currentPage.toString(),
          limit: "10",
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes?${query.toString()}`,
        );
        const data = await res.json();

        setClasses(data.classes || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [currentSearch, currentCategory, currentPage]);

  const updateUrl = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/classes?${params.toString()}`);
  };

  const handleCategoryChange = (category) => {
    updateUrl({ category, page: "1" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrl({ search: searchInput, page: "1" });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateUrl({ page: newPage.toString() });
    }
  };

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen px-12 py-12 font-sans">
      {/* Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-[44px] font-black tracking-tight uppercase">
          Unlock Your <span className="text-[#c4e42a] italic">Potential</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl mx-auto">
          Explore our elite selection of high-performance classes designed to
          push your physical and mental limits.
        </p>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="max-w-2xl mx-auto mb-8 relative"
      >
        <div className="relative flex items-center">
          <span className="absolute left-4 text-zinc-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by class name (e.g. Hyper-Strength)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-[#161618] border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>
      </form>

      {/* Categories Horizontal Filter Chips Component List */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
              currentCategory === cat
                ? "bg-[#c4e42a] text-black"
                : "bg-[#161618] text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Cards Area Layout Layout */}
      {loading ? (
        <div className="text-center text-sm font-medium text-zinc-500 py-20">
          Loading elite roster classes...
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center text-sm font-medium text-zinc-500 py-20">
          No matching approved classes found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {classes.map((item) => (
            <div
              key={item._id}
              className="bg-[#141416] border border-zinc-800/60 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Banner Wrapper Image Tag Frame */}
                <div className="relative h-56 w-full bg-zinc-900">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.className}
                      fill
                      className="object-cover"
                    />
                  )}
                  <span className="absolute top-4 left-4 bg-[#c4e42a] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.status}
                  </span>
                  {item.isHot && (
                    <span className="absolute top-4 left-24 bg-[#2ef0e0] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Hot
                    </span>
                  )}
                </div>

                {/* Info Text Meta Area Section */}
                <div className="p-5">
                  <div className="flex justify-between items-center text-zinc-500 text-xs font-semibold mb-2 uppercase tracking-wide">
                    <h3 className="text-lg font-extrabold text-white group-hover:text-[#c4e42a] transition-colors line-clamp-1">
                      {item.className}
                    </h3>
                    <span className="shrink-0 text-[11px] font-medium text-zinc-400 pl-2">
                      🕒 {item.duration} Min
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Footer Badge Group Row UI elements */}
              <div className="px-5 pb-5 pt-3 flex flex-col gap-4 border-t border-zinc-800/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full relative overflow-hidden bg-zinc-800 border border-zinc-700/50">
                    {item.trainerImage && (
                      <Image
                        src={item.trainerImage}
                        alt={item.trainerName}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-zinc-200">
                      {item.trainerName}
                    </span>
                    <span className="block text-[10px] text-zinc-500 font-medium">
                      {item.trainerRole || "Trainer"}
                    </span>
                  </div>
                </div>

                <Link href={`/classes/${item._id}`} className="w-full">
                  <button className="w-full py-2.5 bg-[#c4e42a] hover:bg-[#b0cd23] text-black font-extrabold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    View Details <span>→</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controller Row Component Blocks */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-950 pt-6 text-xs font-medium text-zinc-500 gap-4">
        <span>
          Showing <span className="text-zinc-300">1-{classes.length}</span> of{" "}
          <span className="text-zinc-300">{totalPages * 10}</span> elite classes
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center bg-[#161618] border border-zinc-800 rounded-lg text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/80"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (pNum) => (
              <button
                key={pNum}
                onClick={() => handlePageChange(pNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all ${
                  currentPage === pNum
                    ? "bg-[#c4e42a] text-black"
                    : "bg-[#161618] border border-zinc-800 text-zinc-400 hover:bg-zinc-800/80"
                }`}
              >
                {pNum}
              </button>
            ),
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center bg-[#161618] border border-zinc-800 rounded-lg text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800/80"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
