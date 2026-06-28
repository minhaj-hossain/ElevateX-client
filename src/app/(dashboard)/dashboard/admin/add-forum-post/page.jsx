"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import {
  HiBold,
  HiItalic,
  HiListBullet,
  HiLink,
  HiCodeBracket,
} from "react-icons/hi2";
import { uploadImageToImgBB } from "@/utils/uploadImage";

export default function AdminCreatePost() {
  const router = useRouter();
  const textareaRef = useRef(null);
  const { data: session } = authClient.useSession();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Markdown Toolbar Injection Logic
  const insertMarkdown = (syntax, placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || placeholder;

    let replacement = "";
    if (syntax === "bold") replacement = `**${selectedText}**`;
    if (syntax === "italic") replacement = `*${selectedText}*`;
    if (syntax === "list") replacement = `\n- ${selectedText}`;
    if (syntax === "link") replacement = `[${selectedText}](url)`;
    if (syntax === "code") replacement = `\`\`\`\n${selectedText}\n\`\`\``;
    if (syntax === "quote") replacement = `\n> ${selectedText}`;

    const newValue =
      text.substring(0, start) + replacement + text.substring(end);
    setDescription(newValue);

    // Reposition cursor after render
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + replacement.length,
        start + replacement.length,
      );
    }, 0);
  };

  // Image Upload Handling
  const handleFileChange = async (e) => {
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;

    try {
      setIsUploading(true);
      const uploadedCdnUrl = await uploadImageToImgBB(targetFile);
      if (uploadedCdnUrl) {
        setImageUrl(uploadedCdnUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload failure:", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Form Submit Execution
  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();

    if (!session?.user?.id) {
      return toast.error("Unauthorized: Session not found. Please log in.");
    }
    if (!title.trim() || !description.trim()) {
      return toast.error("Title and description are required.");
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title,
        description,
        image: imageUrl,
        adminId: session.user.id,
        status: isDraft ? "draft" : "published",
      };

      const { data: tokenData } = await authClient.token();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Server responded with an error status.");
      }

      toast.success(
        isDraft ? "Draft saved successfully!" : "Announcement published live!",
      );

      // Reset Form State
      setTitle("");
      setDescription("");
      setImageUrl("");

      // Optional redirection
      // router.push("/admin/posts");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0c] text-[#e3e3e3] min-h-screen px-12 py-10 font-sans flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Block */}
        <div>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 font-black tracking-widest uppercase px-2.5 py-1 rounded border border-amber-500/20 mb-3 inline-block">
            Administrative Workspace
          </span>
          <h1 className="text-[34px] font-bold text-white tracking-tight mb-2">
            Create Official Forum Post
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            Publish site-wide updates, official community compliance frameworks,
            or high-level announcements straight to the platform stream.
          </p>
        </div>

        {/* Input Form Workspace */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Announcement Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Platform Upgrades: High-Density Analytics Dashboard Deployments"
              className="w-full bg-[#18181b]/50 border border-zinc-800 rounded-xl px-5 py-4 text-white text-[15px] focus:border-zinc-700 outline-none transition-all placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Banner Dropzone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Featured Banner Asset
            </label>

            <label className="group relative block w-full border-2 border-dashed border-zinc-800/80 bg-[#141416]/40 hover:bg-[#18181b]/30 rounded-2xl p-10 cursor-pointer text-center transition-all overflow-hidden min-h-[220px] flex flex-col justify-center items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />

              {imageUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={imageUrl}
                    alt="Featured Admin Upload"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-semibold text-sm">
                    Change image selection
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${isUploading ? "bg-zinc-800 animate-pulse" : "bg-[#d4f227]/10"}`}
                  >
                    <svg
                      className={`w-6 h-6 ${isUploading ? "text-zinc-500" : "text-[#d4f227]"}`}
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
                      ? "Uploading assets..."
                      : "Click or drag to upload"}
                  </h3>
                  <p className="text-zinc-500 text-xs">
                    JPG, PNG or WEBP (Max. 5MB).
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Rich Content Post Body Area */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Post Body Content
            </label>

            <div className="w-full bg-[#141416]/60 border border-zinc-800/90 rounded-2xl overflow-hidden focus-within:border-zinc-700 transition-all">
              {/* Working Interactive Toolbar Actions */}
              <div className="flex items-center gap-1 bg-[#1a1a1e]/60 px-4 py-3 border-b border-zinc-800/80 text-zinc-400">
                <button
                  type="button"
                  onClick={() => insertMarkdown("bold", "bold text")}
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                  title="Bold"
                >
                  <HiBold size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("italic", "italic text")}
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                  title="Italic"
                >
                  <HiItalic size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("list", "list item")}
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                  title="Bullet List"
                >
                  <HiListBullet size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("link", "link description")}
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                  title="Hyperlink"
                >
                  <HiLink size={15} />
                </button>
                <span className="w-px h-4 bg-zinc-800 mx-2" />
                <button
                  type="button"
                  onClick={() => insertMarkdown("quote", "quote block")}
                  className="px-1.5 py-0.5 text-xs font-black hover:bg-zinc-800 hover:text-white rounded transition-colors"
                  title="Blockquote"
                >
                  ”
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("code", "code syntax")}
                  className="p-1.5 hover:bg-zinc-800 hover:text-white rounded transition-colors"
                  title="Code Block"
                >
                  <HiCodeBracket size={15} />
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={12}
                placeholder="Write official platform update records... (Supports Markdown editing features above)"
                className="w-full bg-transparent px-5 py-5 text-zinc-200 text-[15px] leading-relaxed outline-none resize-none placeholder:text-zinc-600"
                required
              />
            </div>
          </div>

          {/* Action Group Footers */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting || isUploading}
              className="px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium text-sm hover:bg-zinc-900/30 transition-all disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-7 py-3 bg-[#d4f227] text-black font-bold rounded-full text-sm hover:bg-[#c1dd20] shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Official Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
