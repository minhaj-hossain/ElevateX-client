import React from "react";

export default function IntelligentPerformanceSection() {
  const features = [
    {
      title: "AI-POWERED TRACKING",
      description:
        "Real-time form correction and biomechanical analysis using advanced computer vision.",
      icon: (
        <svg
          className="w-6 h-6 text-[#c4e42a]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      title: "PERSONAL RECORDS",
      description:
        "Automated PR tracking across all disciplines with predictive performance modeling.",
      icon: (
        <svg
          className="w-6 h-6 text-[#c4e42a]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ),
    },
    {
      title: "RECOVERY SCIENCE",
      description:
        "Personalized recovery protocols based on intensity data and biometric feedback.",
      icon: (
        <svg
          className="w-6 h-6 text-[#c4e42a]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#0a0a0c] text-white py-14 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider italic">
            INTELLIGENT{" "}
            <span className="text-[#c4e42a] not-italic font-black">
              PERFORMANCE
            </span>
          </h2>
          <p className="text-zinc-200 text-sm mt-1 font-medium tracking-tight">
            Data-driven insights to push your limits.
          </p>
        </div>

        {/* Feature Grid Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#121214] border border-[#c4e42a]/30 hover:border-[#c4e42a]/60 rounded-xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300"
            >
              {/* Feature Icon Indicator */}
              <div className="w-10 h-10 rounded-lg bg-[#c4e42a]/5 border border-[#c4e42a]/10 flex items-center justify-center">
                {feat.icon}
              </div>

              {/* Text Matrix Block */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wide text-zinc-100 italic">
                  {feat.title}
                </h3>
                <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
