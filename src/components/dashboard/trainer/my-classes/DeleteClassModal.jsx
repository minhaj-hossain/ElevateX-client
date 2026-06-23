"use client";

import React from "react";

export default function DeleteClassModal({ isOpen, onClose, onDeleteConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px] p-4">
      {/* Modal Container */}
      <div className="w-full max-w-110 bg-[#161615] border border-white/10 rounded-[28px] p-8 text-center shadow-2xl flex flex-col items-center">
        {/* Warning Icon Container */}
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

        {/* Modal Heading */}
        <h2 className="text-[26px] font-bold text-white tracking-wide mb-3">
          Delete Class?
        </h2>

        {/* Modal Body Description */}
        <p className="text-[#a4a4a3] text-[14px] leading-relaxed px-2 mb-8">
          Are you sure you want to delete this class? This action cannot be
          undone. All registration data and historical records for this session
          will be permanently removed.
        </p>

        {/* Call to Actions */}
        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={onDeleteConfirm}
            className="w-full py-3.5 bg-[#99000a] text-white font-bold text-[15px] rounded-full hover:bg-red-700 transition-colors"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-transparent border border-white/10 text-white font-bold text-[15px] rounded-full hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
