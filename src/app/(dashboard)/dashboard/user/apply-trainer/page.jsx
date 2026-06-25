"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ApplyAsTrainerPage() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Status states: 'none' | 'pending' | 'rejected'
  const [applicationStatus, setApplicationStatus] = useState("none");
  const [adminFeedback, setAdminFeedback] = useState("");

  const [formData, setFormData] = useState({
    experienceYears: "",
    specialty: "",
    biography: "",
  });

  // 1. Verify Session & Fetch Current Application Status
  useEffect(() => {
    const verifyAndCheckStatus = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (!sessionData?.user) {
          router.push("/login");
          return;
        }
        setSessionUser(sessionData.user);

        // Fetch application status from backend
        const res = await fetch(
          `http://localhost:8000/api/trainer/status?email=${sessionData.user.email}`,
        );
        if (res.ok) {
          const statusData = await res.json();
          // Expecting statusData: { status: 'pending'|'rejected'|'none', feedback: '...' }
          setApplicationStatus(statusData.status || "none");
          setAdminFeedback(statusData.feedback || "");
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAndCheckStatus();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit Request Pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionUser?.email) return;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/trainer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sessionUser.email,
          name: sessionUser.name,
          ...formData,
        }),
      });

      if (!res.ok) throw new Error("Application transmission rejected.");

      setApplicationStatus("pending");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Error sending application state.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-600 text-xs font-black uppercase tracking-widest flex items-center justify-center">
        Verifying Security Credentials...
      </div>
    );
  }

  // State A: Pending View
  if (applicationStatus === "pending") {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#121214] border border-zinc-900 rounded-xl p-8 text-center space-y-4">
          <span className="text-4xl">⏳</span>
          <h2 className="text-xl font-black uppercase tracking-tight text-[#c4e42a]">
            Application Pending
          </h2>
          <p className="text-zinc-400 text-xs font-medium leading-relaxed">
            Your application registry node has been deployed successfully. The
            administrative board is currently reviewing your professional
            qualifications.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-2 text-xs font-black bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all"
          >
            Return to Overview
          </button>
        </div>
      </div>
    );
  }

  // State B: Base Layout (Handles 'none' / Fresh form and 'rejected' alert alerts)
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 md:p-12 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#c4e42a] uppercase block mb-1">
            CAREER OPPORTUNITIES
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">
            JOIN THE ELITE <br />
            <span className="text-[#c4e42a]">VANGUARD</span>
          </h1>
        </div>

        {/* State C: Explicit Rejected Notification Banner if applicable */}
        {applicationStatus === "rejected" && (
          <div className="bg-red-950/20 border border-red-900 rounded-xl p-5 space-y-2">
            <h3 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-2">
              ❌ Application Disapproved
            </h3>
            <p className="text-zinc-400 text-xs font-medium leading-relaxed">
              {adminFeedback ||
                "Your previous submission did not meet our standard requirements. You may adjust your details and re-apply below."}
            </p>
          </div>
        )}

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Application Panel */}
          <div className="lg:col-span-7 bg-[#121214] border border-zinc-900 rounded-xl p-6 md:p-8">
            {/* Context Notice for 'none' (First-time applicants) */}
            {applicationStatus === "none" && (
              <div className="mb-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                  🚀{" "}
                  <span className="text-white font-bold">
                    Ready to transition?
                  </span>{" "}
                  Complete the registry framework below to request your
                  administrative trainer credentials.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1.5 tracking-wider">
                    Years of Experience
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      name="experienceYears"
                      required
                      min="0"
                      placeholder="e.g. 5"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="w-full bg-[#18181c] border border-zinc-900 rounded-lg pl-3 pr-14 py-3 text-xs font-bold text-zinc-200 focus:outline-none focus:border-[#c4e42a] transition-all"
                    />
                    <span className="absolute right-3 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                      YEARS
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1.5 tracking-wider">
                    Primary Specialty
                  </label>
                  <select
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full bg-[#18181c] border border-zinc-900 rounded-lg px-3 py-3 text-xs font-bold text-zinc-400 focus:outline-none focus:border-[#c4e42a] transition-all cursor-pointer"
                  >
                    <option value="" disabled hidden>
                      Select Your Domain
                    </option>
                    <option value="Weights">Weights & Hyper-Strength</option>
                    <option value="Yoga">Yoga & Mobility Flow</option>
                    <option value="Cardio">Cardio & Core Endurance</option>
                    <option value="HIIT">HIIT & Conditioning Expert</option>
                    <option value="Recovery">
                      Recovery Science & Biomechanics
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1.5 tracking-wider">
                  Why do you want to join ElevateX?
                </label>
                <textarea
                  name="biography"
                  required
                  rows="5"
                  minLength={150}
                  maxLength={1000}
                  placeholder="Tell us about your philosophy, your training style..."
                  value={formData.biography}
                  onChange={handleChange}
                  className="w-full bg-[#18181c] border border-zinc-900 rounded-lg p-3 text-xs font-medium text-zinc-200 focus:outline-none focus:border-[#c4e42a] transition-all resize-none"
                />
                <div className="flex justify-between items-center mt-1 text-[9px] text-zinc-600 font-bold uppercase">
                  <span>Minimum 150 characters.</span>
                  <span>{formData.biography.length} / 1000</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#c4e42a] hover:bg-[#b5d325] text-black text-xs font-black uppercase tracking-wider py-3.5 rounded-lg transition-all disabled:opacity-50"
              >
                {submitting
                  ? "Processing..."
                  : applicationStatus === "rejected"
                    ? "Resubmit Application →"
                    : "Submit Application →"}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#121214] border-l-2 border-[#c4e42a] rounded-r-xl border-y border-r border-zinc-900 p-5 space-y-3">
              <h3 className="text-xs font-black text-zinc-200 uppercase tracking-wider">
                ⚙️ Requirements
              </h3>
              <ul className="space-y-2 text-[11px] text-zinc-400 font-medium">
                <li className="flex items-start gap-2">
                  ✔ Nationally recognized certification.
                </li>
                <li className="flex items-start gap-2">
                  ✔ Current CPR/AED certification.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
