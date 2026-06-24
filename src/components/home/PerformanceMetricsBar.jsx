import React from "react";

export default function PerformanceMetricsBar() {
  const metrics = [
    { value: "15k+", label: "ACTIVE MEMBERS" },
    { value: "85+", label: "CERTIFIED TRAINERS" },
    { value: "120+", label: "DAILY CLASSES" },
    { value: "4.9", label: "USER RATING" },
  ];

  return (
    <div className="w-full bg-[#111112] text-white py-8 border-y border-zinc-900/40 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 text-center">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center space-y-1"
          >
            {/* Metric Number Counter Value */}
            <span className="text-[#c4e42a] text-sm md:text-base font-black italic tracking-wide">
              {metric.value}
            </span>
            {/* Descriptive Group Label */}
            <span className="text-zinc-400 text-[10px] md:text-xs font-black tracking-widest uppercase">
              {metric.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
