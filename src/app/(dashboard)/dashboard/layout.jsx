"use client";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "@/components/dashboard/Sidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#131313] border-b border-white/10 flex items-center px-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-[#c6c9ab] hover:text-[#d2f000] transition-colors"
        >
          <FiMenu size={22} />
        </button>
        <span className="ml-4 text-xl font-black text-[#d2f000]">ElevateX</span>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 lg:pt-0 pt-14">{children}</div>
    </div>
  );
};

export default DashboardLayout;
