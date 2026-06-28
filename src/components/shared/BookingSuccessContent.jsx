"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [sessionUser, setSessionUser] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Verify Active Identity State
  useEffect(() => {
    const verifyAuth = async () => {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        router.push("/login");
      } else {
        setSessionUser(data.user);
      }
    };
    verifyAuth();
  }, [router]);

  // 2. Fetch Verified Transaction Metadata from database
  useEffect(() => {
    if (!sessionUser || !sessionId) return;

    const fetchReceipt = async () => {

      const { data: tokenData } = await authClient.token();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/receipt?session_id=${sessionId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${tokenData?.token}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setBookingDetails(data.booking);
        }
      } catch (err) {
        console.error("Receipt lookup failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [sessionUser, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-zinc-600 text-xs font-black uppercase tracking-widest flex items-center justify-center">
        Verifying Secure Transaction Vault...
      </div>
    );
  }

  // Determine safely if amountPaid is a valid number, if not use fallback pricing string
  const getSafeAmount = (amt) => {
    if (amt === undefined || amt === null || isNaN(Number(amt))) {
      return "45.00";
    }
    return Number(amt).toFixed(2);
  };

  // Safe parsing fallback structure to completely avoid UI crashes (.split or .toFixed on nulls)
  const record = {
    className: bookingDetails?.className || "Premium Training Session",
    trainerName: bookingDetails?.trainerName || "Performance Coach",
    classDate: bookingDetails?.classDate || "SESSION DAY",
    startTime: bookingDetails?.startTime || "Scheduled Slot",
    location: bookingDetails?.location || "Main Arena",
    orderId:
      bookingDetails?.orderId ||
      bookingDetails?.id?.slice(-8).toUpperCase() ||
      "EVX-ORDER-B",
    paymentDate:
      bookingDetails?.paymentDate ||
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    paymentMethod: bookingDetails?.paymentMethod || "Card via Stripe Secure",
    amountPaid: getSafeAmount(bookingDetails?.amountPaid),
  };

  console.log("Booking Record:", record);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#c4e42a] selection:text-black">
      <div className="max-w-4xl w-full mx-auto text-center space-y-8">
        {/* Animated Badge & Hero Header Segment */}
        <div className="space-y-3 flex flex-col items-center">
          <div className="w-14 h-14 bg-[#c4e42a]/10 border-2 border-[#c4e42a] rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(196,228,42,0.2)]">
            <span className="text-[#c4e42a] text-xl font-bold">✓</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-[#c4e42a] mt-2">
            BOOKING CONFIRMED
          </h1>
          <p className="text-zinc-400 text-xs font-semibold max-w-lg leading-relaxed uppercase tracking-wide">
            YOUR ASCENT BEGINS NOW. Your spot is secured. Check your email for
            session details and preparation guidelines.
          </p>
        </div>

        {/* Master Layout Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left items-stretch">
          {/* Left Panel Block: Upcoming Session Specifics */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="bg-[#121214] border border-zinc-900 rounded-xl p-6 relative overflow-hidden border-l-4 border-l-[#c4e42a]">
              <span className="text-[9px] font-black tracking-widest text-[#c4e42a] bg-[#c4e42a]/10 px-2 py-0.5 rounded-sm uppercase">
                UPCOMING SESSION
              </span>

              <div className="mt-4 flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-zinc-100">
                    {record.className}
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold mt-1">
                    {record.trainerName
                      ? `👤  Trainer: ${record.trainerName}`
                      : "👤  Assigned Specialist Trainer"}
                  </p>
                </div>
                {/* Date Indicator Badge */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-center min-w-[55px] shrink-0">
                  <div className="text-[8px] text-zinc-500 font-black tracking-widest uppercase">
                    {record.classDate.includes(" ")
                      ? record.classDate.split(" ")[0]
                      : "DATE"}
                  </div>
                  <div className="text-sm font-black tracking-tight text-zinc-200">
                    {record.classDate.includes(" ")
                      ? record.classDate.split(" ")[1]
                      : record.classDate}
                  </div>
                </div>
              </div>

              {/* Time and Place Matrix Footer */}
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-900/60 pt-6 mt-6">
                <div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">
                    START TIME
                  </span>
                  <span className="text-xs font-black text-zinc-300 uppercase tracking-wide mt-0.5 block">
                    {record.startTime}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">
                    LOCATION
                  </span>
                  <span className="text-xs font-black text-zinc-300 uppercase tracking-wide mt-0.5 block">
                    {record.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Redirect Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/dashboard/user"
                className="flex-1 bg-[#c4e42a] hover:bg-[#b5d325] text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-full text-center transition-all shadow-[0_4px_12px_rgba(196,228,42,0.15)]"
              >
                GO TO DASHBOARD
              </Link>
              <Link
                href="/dashboard/user/bookings"
                className="flex-1 border border-zinc-700 bg-transparent hover:bg-zinc-900 text-zinc-300 text-xs font-black uppercase tracking-widest py-3.5 rounded-full text-center transition-all"
              >
                VIEW MY CLASSES
              </Link>
            </div>
          </div>

          {/* Right Panel Block: Transaction Receipt Summary Details */}
          <div className="md:col-span-5 bg-[#121214] border border-zinc-900 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900/80 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200">
                  Transaction Details
                </h3>
                <span className="text-xs text-zinc-500">📄</span>
              </div>

              {/* Parameter Rows */}
              <div className="space-y-2.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Order ID</span>
                  <span className="text-zinc-300 tracking-tight">
                    #{record.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Date</span>
                  <span className="text-zinc-300">{record.paymentDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Payment Method</span>
                  <span className="text-zinc-300 text-[11px] flex items-center gap-1">
                    💳 {record.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Block Wrapper */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-t border-zinc-900 pt-4">
                <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Amount Paid
                </span>
                <span className="text-xl font-black tracking-tight text-[#c4e42a]">
                  ${record.amountPaid}
                </span>
              </div>

              {/* Alert Footnote Warning */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-lg p-3 flex gap-2 items-start">
                <span className="text-[#c4e42a] text-xs mt-0.5">🛈</span>
                <p className="text-zinc-500 text-[10px] font-medium leading-relaxed">
                  A receipt has been sent to your registered email. Need help?
                  Contact our elite support squad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
