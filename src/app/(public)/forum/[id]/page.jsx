"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client"; // Your authentication hook
import { toast } from "react-hot-toast";

export default function ForumPostDetailsPage() {
  const { id: postId } = useParams();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  // Resource States
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interactive States
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null

  // Commentary Input States
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Route protection gatekeeper check
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Authentication required. Please log in first.");
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Initial Data Fetch
  useEffect(() => {
    if (!postId || !userId) return;

    const fetchPostData = async () => {
      try {
        // 1. Fetch Post Metrics & Content
        const postRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${postId}`,
        );
        if (!postRes.ok) throw new Error("Post not found");
        const postData = await postRes.json();
        setPost(postData);
        setLikesCount(postData.likes || 0);
        setDislikesCount(postData.dislikes || 0);

        // 2. Fetch User Vote Status
        const voteRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${postId}/vote-status?userId=${userId}`,
        );
        const voteData = await voteRes.json();
        setUserVote(voteData.voteType); // Returns 'like', 'dislike', or null

        // 3. Fetch Comments
        const commentsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${postId}/comments`,
        );
        const commentsData = await commentsRes.json();
        setComments(commentsData || []);
      } catch (error) {
        console.error("Failed loading discussion contents:", error);
        toast.error("Could not load post content.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId, userId]);

  // Handle Voting (Like / Dislike)
  const handleVote = async (type) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${postId}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, type }),
        },
      );
      const data = await res.json();

      // console.log("Vote response:", data);

      if (res.ok) {
        setLikesCount(data.likes);
        setDislikesCount(data.dislikes);
        setUserVote(type === userVote ? null : type);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Voting error:", error);
    }
  };

  // Create Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forum-posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            userName,
            userImage,
            text: commentText,
          }),
        },
      );
      const newComment = await res.json();

      if (res.ok) {
        setComments([newComment, ...comments]);
        setCommentText("");
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("Comment submit error:", error);
    }
  };

  // Update Comment
  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text: editingText }),
        },
      );

      if (res.ok) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, text: editingText } : c,
          ),
        );
        setEditingCommentId(null);
        toast.success("Comment updated.");
      }
    } catch (error) {
      console.error("Comment edit error:", error);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${commentId}?userId=${userId}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success("Comment removed.");
      }
    } catch (error) {
      console.error("Comment delete error:", error);
    }
  };

  if (loading || isPending) {
    return (
      <div className="bg-[#0a0a0c] text-zinc-600 text-xs font-bold text-center py-20">
        Verifying access data...
      </div>
    );
  }

  if (!post)
    return (
      <div className="bg-[#0a0a0c] text-zinc-400 text-center py-20">
        Post details unavailable.
      </div>
    );

  return (
    <div className="bg-[#0a0a0c] text-white min-h-screen px-6 md:px-24 py-12 font-sans max-w-4xl mx-auto">
      {/* Meta info tags row */}
      <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-4">
        <span className="text-[#c4e42a] border border-[#c4e42a]/30 px-2 py-0.5 rounded">
          {post.category || "Technical Deep Dive"}
        </span>
        <span>• {post.timeAgo || "4 min read"}</span>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-zinc-100 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Author details profile container */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-full bg-zinc-800 relative overflow-hidden">
          {post.authorImage && (
            <Image
              src={post.authorImage}
              alt={post.authorName}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div>
          <span className="block text-xs font-bold text-zinc-200">
            {post.authorName}
          </span>
          <span className="block text-[10px] text-zinc-500">
            {post.authorRole || "Performance Scientist"}
          </span>
        </div>
      </div>

      {/* Main Post Cover Banner Display */}
      <div className="relative h-96 w-full bg-zinc-950 rounded-2xl overflow-hidden mb-10 border border-zinc-900">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Description Content Area */}
      <div className="text-zinc-300 text-sm leading-relaxed space-y-6 font-medium whitespace-pre-line border-b border-zinc-900 pb-8 mb-6">
        {post.description}
      </div>

      {/* Vote Interaction Controls Segment layout */}
      <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 mb-12">
        <button
          onClick={() => handleVote("like")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
            userVote === "like"
              ? "bg-[#c4e42a] text-black border-[#c4e42a]"
              : "bg-[#121214] border-zinc-900 hover:text-white"
          }`}
        >
          👍 <span>{likesCount}</span>
        </button>
        <button
          onClick={() => handleVote("dislike")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
            userVote === "dislike"
              ? "bg-red-500 text-white border-red-500"
              : "bg-[#121214] border-zinc-900 hover:text-white"
          }`}
        >
          👎 <span>{dislikesCount}</span>
        </button>
      </div>

      {/* Comments Engine View Panel wrapper */}
      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">
          Community Insights ({comments.length})
        </h3>

        {/* Create Input Box Element Form component */}
        <form
          onSubmit={handleAddComment}
          className="bg-[#121214] border border-zinc-900 rounded-xl p-4 space-y-3"
        >
          <textarea
            placeholder="Add to the technical discussion..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-black font-extrabold text-xs px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Post Comment
            </button>
          </div>
        </form>

        {/* Comments Feed Render List map view */}
        <div className="space-y-4 pt-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-[#121214]/60 border border-zinc-900/60 rounded-xl p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 relative overflow-hidden">
                    {comment.userImage && (
                      <Image
                        src={comment.userImage}
                        alt={comment.userName}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-zinc-300">
                      {comment.userName}
                    </span>
                    <span className="block text-[9px] text-zinc-600 font-semibold">
                      {comment.timeAgo || "Just now"}
                    </span>
                  </div>
                </div>

                {/* Conditional structural operational actions menu logic mapping targeting ownership */}
                {comment.userId === userId && (
                  <div className="flex gap-3 text-[10px] font-bold text-zinc-500">
                    <button
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingText(comment.text);
                      }}
                      className="hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === comment._id ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="text-zinc-500 text-[10px] font-bold px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="bg-[#c4e42a] text-black text-[10px] font-extrabold px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-400 text-xs leading-relaxed font-medium pl-9">
                  {comment.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
