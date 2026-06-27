"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LatestForumPostsSection() {
  const router = useRouter();
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        // Requesting the top 4 most recent posts from the Express API
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/latest?limit=4`,
        );
        if (!res.ok) throw new Error("Failed to load community insights");
        const data = await res.json();
        setLatestPosts(data.posts || []);
      } catch (error) {
        console.error("Error loading forum feed records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <section className="bg-[#0a0a0c] text-white py-12 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Section Header */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider">
            COMMUNITY <span className="text-[#c4e42a]">PULSE</span>
          </h2>
          <p className="text-zinc-400 text-xs mt-1 font-medium">
            Insights and tips from the ElevateX community.
          </p>
        </div>

        {/* Dynamic Content Grid Layout */}
        {loading ? (
          <div className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest py-10 text-center">
            Streaming latest network submissions...
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest py-10 text-center">
            No active forum conversations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestPosts.map((post) => (
              <div
                key={post._id}
                onClick={() => router.push(`/forum/${post._id}`)}
                className="bg-[#121214] border border-zinc-900 rounded-xl p-5 flex flex-col justify-between h-40 cursor-pointer hover:border-zinc-800 transition-all duration-200 group"
              >
                {/* Category Header Label */}
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  <span className="text-[#c4e42a] text-xs leading-none">•</span>
                  <span>{post.category || "General"}</span>
                </div>

                {/* Post Title */}
                <h3 className="text-xs font-black uppercase tracking-normal leading-snug text-zinc-200 group-hover:text-white line-clamp-3 my-2">
                  {post.title}
                </h3>

                {/* Card Footer row content */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-900/40 text-[10px] text-zinc-500 font-bold">
                  <span>By {post.authorName || "ElevateX Member"}</span>

                  {/* Chat Speech Icon indicator asset layout */}
                  <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-xs">
                    💬
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
