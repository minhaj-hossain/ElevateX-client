"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ForumPostManagePage() {
  const [posts, setPosts] = useState([]);
  const [metrics, setMetrics] = useState({ totalPosts: 0, flaggedPosts: 0 });
  const [pagination, setPagination] = useState({
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // "all" | "flagged"

  const fetchForumPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/forum-posts?page=${page}&limit=4&filter=${filter}`,
      );
      if (!res.ok) throw new Error("Could not pull network moderation logs.");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setMetrics(data.metrics);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error synchronizing community board context matrices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset back to first page when changing filters
  }, [filter]);

  useEffect(() => {
    fetchForumPosts();
  }, [page, filter]);

  const handleDeletePost = async (postId, postTitle) => {
    const confirmPurge = window.confirm(
      `MODERATION OVERRIDE ALERT:\nAre you sure you want to permanently delete the post:\n"${postTitle}"?\nThis action cannot be undone and will erase all nested user replies.`,
    );
    if (!confirmPurge) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/forum-posts/${postId}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (data.success) {
        toast.success("Post successfully removed by administrator.");
        fetchForumPosts();
      } else {
        toast.error(data.error || "Failed to purge targeted thread.");
      }
    } catch (err) {
      toast.error("Moderation channel communication error.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen p-6 md:p-10 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Grid Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
              Community Forum
            </h1>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wide mt-1">
              Manage user-generated content, monitor discussions, and maintain
              community standards across the ElevateX ecosystem.
            </p>
          </div>

          {/* Metric Cards Top Layout */}
          <div className="flex gap-3">
            <div className="bg-[#121214] border border-zinc-900 rounded-lg py-2 px-5 text-center min-w-[110px]">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                Total Posts
              </span>
              <span className="text-lg font-black text-zinc-100 block mt-1">
                {loading ? "..." : metrics.totalPosts.toLocaleString()}
              </span>
            </div>
            <div className="bg-[#121214] border border-zinc-900 rounded-lg py-2 px-5 text-center min-w-[110px]">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                Flagged
              </span>
              <span className="text-lg font-black text-[#ef4444] block mt-1">
                {loading ? "..." : metrics.flaggedPosts}
              </span>
            </div>
          </div>
        </div>

        {/* Filter View Selector Bar (from image_f5da22.png inner header controls) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121214]/40 border border-zinc-900 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                filter === "all"
                  ? "bg-[#27272a] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All Discussions
            </button>
            <button
              onClick={() => setFilter("flagged")}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                filter === "flagged"
                  ? "bg-red-950/40 text-red-400 border border-red-900/40"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Flagged Only
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
            <span>Sort by:</span>
            <select className="bg-zinc-950 border border-zinc-900 text-zinc-100 px-3 py-1.5 rounded-lg font-bold text-xs focus:outline-none">
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Discussions Table Moderation Grid List Box */}
        <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 overflow-hidden">
          {loading ? (
            <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center py-20">
              Scanning conversation entry threads...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-zinc-500 text-xs font-black uppercase tracking-widest text-center py-20">
              No content items found matching current category filter matrix
              paths.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-[11px] font-black uppercase text-zinc-500 tracking-widest">
                    <th className="pb-4 w-[50%]">Discussion Title</th>
                    <th className="pb-4">Author</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/30 text-xs font-bold text-zinc-200">
                  {posts.map((post) => {
                    const isReported = post.reportCount > 0;

                    return (
                      <tr
                        key={post._id}
                        className={`group hover:bg-zinc-900/10 transition-all ${isReported ? "bg-red-950/5" : ""}`}
                      >
                        {/* Title & Body Sample Field Columns */}
                        <td className="py-5 pr-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-sm font-extrabold uppercase tracking-wide text-zinc-100 group-hover:text-[#c4e42a] transition-colors line-clamp-1">
                                {post.title}
                              </span>

                              {/* Reported Badges from image_f5da22.png view layer */}
                              {isReported && (
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black px-1.5 py-0.5 rounded tracking-tighter uppercase shrink-0">
                                  REPORTED ({post.reportCount})
                                </span>
                              )}
                            </div>
                            <p className="text-zinc-500 text-xs font-medium line-clamp-1 max-w-xl">
                              {post.description ||
                                post.content ||
                                "No body overview summary text attached."}
                            </p>
                          </div>
                        </td>

                        {/* Author Field layout element box alignment */}
                        <td className="py-5 pr-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 text-[10px] font-black rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0 tracking-tighter">
                              {getInitials(post.authorName)}
                            </div>
                            <span className="uppercase tracking-wide text-zinc-300 font-extrabold text-[11px]">
                              {post.authorName || "Community Member"}
                            </span>
                          </div>
                        </td>

                        {/* Posted Date Context Display */}
                        <td className="py-5 pr-4 text-zinc-500 whitespace-nowrap">
                          {post.datePosted ||
                            new Date(
                              post.createdAt || Date.now(),
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                        </td>

                        {/* Administrative Delete Function Trigger Action column row line */}
                        <td className="py-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {/* Inspect Link Icon representation matching layout template */}
                            <button
                              title="Inspect Item Details"
                              className="p-1.5 rounded bg-transparent border border-zinc-900 text-zinc-600 hover:text-zinc-300 hover:border-zinc-800 transition-all"
                            >
                              👁️
                            </button>

                            <button
                              onClick={() =>
                                handleDeletePost(post._id, post.title)
                              }
                              className="px-3 py-1.5 rounded bg-transparent border border-red-950 text-red-400/90 hover:bg-red-500 hover:text-black hover:border-red-500 font-black uppercase text-[10px] tracking-wider transition-all inline-flex items-center gap-1"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls Block Row elements */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-zinc-900 mt-6 pt-4 text-xs font-bold text-zinc-500 uppercase tracking-wide">
              <div>
                Showing {pagination.showingCount} of {pagination.totalPosts}{" "}
                posts
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((item) => (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`w-7 h-7 font-black rounded transition-all text-center ${
                      page === item
                        ? "bg-[#c4e42a] text-black"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}

                <button
                  disabled={page === pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
