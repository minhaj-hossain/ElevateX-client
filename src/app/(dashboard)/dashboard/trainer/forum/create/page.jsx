"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

// Import standard react-icons matching the requested toolbar UI layout
import {
  HiBold,
  HiItalic,
  HiListBullet,
  HiLink,
  HiMinus, // Spacer replacement line
  HiCodeBracket,
} from "react-icons/hi2";
import { BiHeading } from "react-icons/bi"; // Dynamic indicator block variant or replacement
import { uploadImageToImgBB } from "@/utils/uploadImage";

export default function CreatePost() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Component State Tracking payloads
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag and drop / local drop file selection tracking context
  const handleFileChange = async (e) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;

    try {
      setIsUploading(true);
      const uploadedCdnUrl = await uploadImageToImgBB(targetFile);
      if (uploadedCdnUrl) {
        setImageUrl(uploadedCdnUrl);
      }
    } catch (error) {
      console.error("Cloud image storage pipeline failure:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (!title) return alert("A valid post title configuration is required.");

    try {
      setIsSubmitting(true);

      const payload = {
        title,
        description,
        image: imageUrl,
        trainerId: session?.user?.id || "anonymous",
        status: isDraft ? "draft" : "published",
        createdAt: new Date().toISOString(),
      };

      console.log(payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        // Clear window context or send back to localized tracking view dashboard
        // router.push("/dashboard/trainer/forum");
      }
    } catch (error) {
      console.error("Failed executing post creation lifecycle sync:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0c] text-[#e3e3e3] min-h-screen px-12 py-10 font-sans flex justify-center">
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-200">
        {/* Page Titles Section */}
        <div>
          <h1 className="text-[34px] font-bold text-white tracking-tight mb-2">
            Create New Post
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            Share your expertise, workout tips, or nutrition advice with the
            community. High-quality posts increase your visibility and
            engagement.
          </p>
        </div>

        {/* Global Input Workspace Field Submission Wrappers */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Post Title Block Container */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Post Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 Explosive Drills for Maximum Power"
              className="w-full bg-[#18181b]/50 border border-zinc-800 rounded-xl px-5 py-4 text-white text-[15px] focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Featured Image File Selection Gateway Layer */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Featured Image
            </label>

            <label className="group relative block w-full border-2 border-dashed border-zinc-800/80 bg-[#141416]/40 hover:bg-[#18181b]/30 rounded-2xl p-10 cursor-pointer text-center transition-all overflow-hidden min-h-55 flex flex-col justify-center items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />

              {imageUrl ? (
                // Safe Image Preview Layer once matching url criteria is processed
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={imageUrl}
                    alt="Featured Upload"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-semibold text-sm">
                    Change image selection
                  </div>
                </div>
              ) : (
                <>
                  {/* Dynamic Custom Styling matching design cloud parameters */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${isUploading ? "bg-zinc-800 animate-pulse" : "bg-[#cbf31d]/10"}`}
                  >
                    <svg
                      className={`w-6 h-6 ${isUploading ? "text-zinc-500" : "text-[#cbf31d]"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-base font-semibold mb-1">
                    {isUploading
                      ? "Uploading image assets..."
                      : "Click or drag to upload"}
                  </h3>
                  <p className="text-zinc-500 text-xs">
                    JPG, PNG or WEBP (Max. 5MB). High-resolution recommended.
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Post Description Rich Text Workspace Elements Mockup */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Post Description
            </label>

            <div className="w-full bg-[#141416]/60 border border-zinc-800/90 rounded-2xl overflow-hidden focus-within:border-zinc-700 transition-all">
              {/* Static Formatting Toolbar Grid Display Design System Configuration */}
              <div className="flex items-center gap-1 bg-[#1a1a1e]/60 px-4 py-3 border-b border-zinc-800/80 text-zinc-400">
                <button
                  type="button"
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                >
                  <HiBold size={15} />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                >
                  <HiItalic size={15} />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                >
                  <HiListBullet size={15} />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                >
                  <HiLink size={15} />
                </button>
                <span className="w-px h-4 bg-zinc-800 mx-2" />
                <button
                  type="button"
                  className="px-1.5 py-0.5 text-xs font-black font-serif hover:bg-zinc-800 hover:text-white rounded transition-colors"
                >
                  ”
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                >
                  <HiCodeBracket size={15} />
                </button>
              </div>

              {/* Main Description Target Capture Fields */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={12}
                placeholder="Start writing your masterpiece..."
                className="w-full bg-transparent px-5 py-5 text-zinc-200 text-[15px] leading-relaxed outline-none resize-none placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Action Footer Button Group Rows */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isSubmitting || isUploading}
                className="px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium text-sm hover:bg-zinc-900/30 transition-all disabled:opacity-50"
              >
                Save Draft
              </button>
              <span className="ml-2">Auto-saved at 14:23</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-7 py-3 bg-[#d4f227] text-black font-bold rounded-full text-sm hover:bg-[#c1dd20] shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish to Forum"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
