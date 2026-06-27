"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ForumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search: currentSearch,
          page: currentPage.toString(),
          limit: "6", // Matches your UI template displaying 6 items per page
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts?${query.toString()}`,
        );
        const data = await res.json();

        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching forum entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentSearch, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    params.set("page", "1");
    router.push(`/forum?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`/forum?${params.toString()}`);
    }
  };

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen px-12 py-12 font-sans">
      {/* Top Banner & Interaction Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase text-white">
            Community & Knowledge
          </h1>
          <p className="text-zinc-400 text-xs mt-2 max-w-xl">
            Connect with elite trainers, share performance data, and master your
            fitness journey with the collective.
          </p>
        </div>

        {/* Search Input and Sort Tools */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 lg:w-80"
          >
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#161618] border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
            />
          </form>
          <button
            type="button"
            className="bg-[#161618] border border-zinc-800 text-xs text-zinc-400 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800"
          >
            <span>≡</span> Sort
          </button>
        </div>
      </div>

      {/* Main Grid Splitting Posts vs Widgets Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Area: List of Forum Posts */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider py-12">
              Loading discussions...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider py-12">
              No discussions found.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 hover:border-zinc-800 transition-all"
              >
                {/* Post Banner Wrapper Frame */}
                <div className="relative h-40 w-full sm:w-56 flex-shrink-0 bg-zinc-900 rounded-xl overflow-hidden">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Post Info Details Section */}
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex items-center gap-3 mb-2 text-[10px] font-bold uppercase tracking-wider">
                      <span className="bg-[#c4e42a] text-black px-2 py-0.5 rounded-md font-black">
                        {post.category || "General"}
                      </span>
                      <span className="text-zinc-500">
                        {post.createdAtTime || "Recently"}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white leading-snug line-clamp-1 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>

                  {/* Author Meta Info and Navigation Anchor Link Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/20 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 relative overflow-hidden">
                        {post.authorImage && (
                          <Image
                            src={post.authorImage}
                            alt={post.authorName}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="text-xs font-extrabold text-zinc-300">
                        {post.authorName}
                      </span>
                      <span className="text-[9px] bg-zinc-800 text-[#c4e42a] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                        {post.authorRole || "Trainer"}
                      </span>
                    </div>

                    <Link
                      href={`/forum/${post._id}`}
                      className="text-[#c4e42a] hover:text-white font-extrabold text-xs transition-colors flex items-center gap-1"
                    >
                      Read More <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls Alignment Box */}
          {!loading && posts.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 pt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center bg-[#161618] border border-zinc-800 rounded-lg text-zinc-400 disabled:opacity-20 hover:bg-zinc-800"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (pNum) => (
                  <button
                    key={pNum}
                    onClick={() => handlePageChange(pNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs transition-all ${
                      currentPage === pNum
                        ? "bg-[#c4e42a] text-black"
                        : "bg-[#161618] border border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {pNum}
                  </button>
                ),
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center bg-[#161618] border border-zinc-800 rounded-lg text-zinc-400 disabled:opacity-20 hover:bg-zinc-800"
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {/* Right Column Area: Decorative Sidebar Widgets Panel */}
        <div className="space-y-6">
          {/* Top Contributors Sidebar Frame */}
          <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span>🏅</span> Top Contributors
            </h4>
            <div className="space-y-3.5">
              {[
                { name: "Alexander Thorne", xp: "1,240 XP", posts: "82 Posts" },
                { name: "Elena Rodriguez", xp: "980 XP", posts: "45 Posts" },
                { name: "Jordan Miles", xp: "850 XP", posts: "31 Posts" },
              ].map((contributor, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-800" />
                  <div>
                    <span className="block text-xs font-bold text-zinc-200">
                      {contributor.name}
                    </span>
                    <span className="block text-[10px] text-zinc-500 font-medium">
                      {contributor.xp} • {contributor.posts}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics Tags Container Box */}
          <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span>📈</span> Trending Topics
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "#HyroxPrep",
                "#IntermittentFasting",
                "#RecoverySleeves",
                "#PR_Tracker",
                "#ZenithGames24",
                "#CreatineCycling",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-zinc-500 bg-[#161618] border border-zinc-800 px-2.5 py-1.5 rounded-lg cursor-pointer hover:text-white hover:border-zinc-700 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Weekly Interactive Metrics Progress Dashboard Goal Component */}
          <div className="bg-[#c4e42a] text-black rounded-2xl p-5 space-y-4 shadow-xl">
            <div>
              <span className="block text-[9px] font-black uppercase tracking-widest text-black/60">
                Weekly Goal:
              </span>
              <span className="text-sm font-black uppercase tracking-tight text-black">
                10K Discussion XP
              </span>
            </div>
            <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-black h-full rounded-full"
                style={{ width: "65%" }}
              />
            </div>
            <span className="block text-xs font-black text-black/80">
              6,500 / 10,000 XP Reached
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
