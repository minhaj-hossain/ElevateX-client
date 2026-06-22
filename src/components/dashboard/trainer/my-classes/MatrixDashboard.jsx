"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BiDumbbell } from "react-icons/bi";
import { FaUserSecret } from "react-icons/fa6";
import { GiBanknote } from "react-icons/gi";
// import { Dumbbell, Users, Banknote } from "lucide-react"; // Or use 'react-icons/fa6', etc.

const cardData = [
  {
    id: 1,
    title: "TOTAL CLASSES",
    value: "12",
    icon: BiDumbbell,
    iconColor: "text-[#CCFF00]", // Volt green
    bgColor: "bg-[#1E1E11]",
  },
  {
    id: 2,
    title: "ACTIVE STUDENTS",
    value: "142",
    icon: FaUserSecret,
    iconColor: "text-[#00E5FF]", // Cyan
    bgColor: "bg-[#111E1E]",
  },
  {
    id: 3,
    title: "MONTHLY REVENUE",
    value: "$4.8k",
    icon: GiBanknote,
    iconColor: "text-[#D6A3FF]", // Purple
    bgColor: "bg-[#1A1622]",
  },
];

export default function MetricDashboard() {
  

  return (
    <div className="flex flex-wrap gap-4 p-6 bg-[#0B0B0B] items-start">
      {cardData.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between min-w-70 flex-1 bg-[#141414] border border-[#1F1F1F] rounded-xl p-5 shadow-lg"
          >
            {/* Text details */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-wider text-[#8E8E82]">
                {card.title}
              </span>
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </span>
            </div>

            {/* Circular Icon Container */}
            <div
              className={`p-3.5 rounded-full ${card.bgColor} ${card.iconColor} flex items-center justify-center`}
            >
              <Icon size={22} strokeWidth={2.5} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
