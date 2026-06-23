"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { FiMessageSquare, FiHeart, FiEye, FiActivity } from "react-icons/fi";

export default function ForumManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & deletion states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const { data: session } = authClient.useSession();
  const trainerId = session?.user?.id;


  useEffect(() => {
    const fetchTrainerPosts = async () => {
      // If session is checked and no user id is found, stop loading
      if (!trainerId) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/getTrainerPosts/${trainerId}`,
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching trainer posts:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only turn off loading once the authClient session finishes resolving
    if (trainerId) {
      fetchTrainerPosts();
    } else if (session === null) {
      // Session resolved but user is unauthenticated
      setLoading(false);
    }
  }, [trainerId, session]);
  
  const openDeleteModal = (id) => {
    setSelectedPostId(id);
    setIsModalOpen(true);
  };

  // 1. Update your handleDelete function to close the modal on success:
  const handleDelete = async (postId) => {
    // if (!postId) return;
    console.log(postId);
    try {
      const response = await fetch(
        `http://localhost:8000/api/deletePost/${postId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Remove from UI state immediately
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId),
        );
        // Close modal and reset tracking state
        setIsModalOpen(false);
        setSelectedPostId(null);
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  console.log("Posts state:", posts);

  if (loading) {
    return (
      <div className="bg-[#0c0c0e] text-zinc-400 min-h-screen flex items-center justify-center text-sm font-medium">
        Loading workspace dashboard...
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] text-[#e3e3e3] min-h-screen px-12 py-10 font-sans relative">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[36px] font-bold text-white tracking-tight">
            Forum Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Review, manage, and curate your contributions to the ElevateX
            community. Keep your content high-energy and professional.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/trainer/create-post">
            <button className="flex items-center gap-2 bg-[#2ef0e0] hover:bg-[#25ccbe] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors shadow-lg shadow-[#2ef0e0]/10">
              <HiPlus size={16} /> New Post
            </button>
          </Link>
          <button className="px-5 py-2.5 border border-[#c4e42a] text-[#c4e42a] bg-transparent hover:bg-[#c4e42a]/10 rounded-full text-sm font-bold transition-colors">
            Bulk Action
          </button>
        </div>
      </div>

      {/* Analytics Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Total Posts */}
        <div className="bg-[#141416] border border-zinc-800/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-[#c4e42a]">
            <FiMessageSquare size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
              Total Posts
            </span>
            <span className="text-2xl font-bold text-zinc-100">
              {posts.length}
            </span>
          </div>
        </div>
        {/* Engagements */}
        <div className="bg-[#141416] border border-zinc-800/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-[#2ef0e0]">
            <FiHeart size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
              Engagements
            </span>
            <span className="text-2xl font-bold text-zinc-100">1.2k</span>
          </div>
        </div>
        {/* Post Reach */}
        <div className="bg-[#141416] border border-zinc-800/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-purple-400">
            <FiEye size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
              Post Reach
            </span>
            <span className="text-2xl font-bold text-zinc-100">8.4k</span>
          </div>
        </div>
        {/* Active Discussions */}
        <div className="bg-[#141416] border border-zinc-800/60 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-[#c4e42a]">
            <FiActivity size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
              Active Discussions
            </span>
            <span className="text-2xl font-bold text-zinc-100">3</span>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-[#141416] border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* Card Image Banner */}
              <div className="relative h-48 w-full bg-zinc-900">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900/80 flex items-center justify-center text-zinc-700 text-xs">
                    No banner fallback
                  </div>
                )}
                {/* Category Badge Tag Layout */}
                <span className="absolute top-4 left-4 bg-[#c4e42a] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {post.category || "Nutrition"}
                </span>
              </div>

              {/* Text Fields */}
              <div className="p-5 space-y-2">
                <span className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "October 12, 2023"}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug tracking-wide line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </div>

            {/* Action Row Footer Elements */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-zinc-800/30">
              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <FiHeart size={14} className="text-zinc-500" />{" "}
                  {post.likes || 0}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiMessageSquare size={14} className="text-zinc-500" />{" "}
                  {post.comments || 0}
                </span>
              </div>
              <button
                onClick={() => openDeleteModal(post._id)}
                className="flex items-center gap-1.5 bg-[#99000a] text-white px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors hover:bg-red-700"
              >
                <HiTrash size={14} /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Static Prompt Placeholder Creation Interface Card block */}
        <Link
          href="/dashboard/trainer/create-post"
          className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-transparent rounded-2xl p-6 min-h-[320px] flex flex-col items-center justify-center text-center group transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 group-hover:scale-105 transition-transform flex items-center justify-center text-white mb-4 shadow-lg">
            <HiPlus size={20} />
          </div>
          <h4 className="text-white text-base font-bold mb-1">
            New Community Insight
          </h4>
          <p className="text-zinc-500 text-xs max-w-[200px] leading-relaxed">
            Ready to share more knowledge? Click to start drafting your next big
            post.
          </p>
        </Link>
      </div>

      {/* FIXED MATCHING DESIGN MODAL BACKDROP POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-[440px] bg-[#161615] border border-white/10 rounded-[28px] p-8 text-center shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
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
              Delete Post?
            </h2>
            <p className="text-[#a4a4a3] text-[14px] leading-relaxed px-2 mb-8">
              Are you sure you want to delete this post? This action cannot be
              undone. All registration data and historical records for this
              session will be permanently removed.
            </p>

            <div className="w-full space-y-3">
              <button
                type="button"
                onClick={() => handleDelete(selectedPostId)}
                className="w-full py-3.5 bg-[#99000a] text-white font-bold text-[15px] rounded-full hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPostId(null);
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
