import Image from "next/image";
import React from "react";
import { FiBell, FiHelpCircle, FiSearch } from "react-icons/fi";

const MyClassesHeader = () => {
  return (
    <div className="bg-[#1C1C1E] h-20 flex items-center justify-between px-8 text-white border-b border-[#313136]">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-[#D2E21D]">My Classes</h1>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A9F]"
            size={20}
          />

          <input
            type="search"
            placeholder="Search sessions..."
            className="
      w-[320px]
      h-12
      bg-[#313136]
      border-0
      rounded-full
      pl-12
      pr-4
      text-[#9A9A9F]
      placeholder:text-[#9A9A9F]
      text-lg
      focus-visible:ring-1
      focus-visible:ring-[#D2E21D]
    "
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-[#D1D1D6] hover:text-[#D2E21D] transition-colors">
            <FiBell size={24} />
          </button>

          <button className="p-2 text-[#D1D1D6] hover:text-[rgb(210,226,29)] transition-colors">
            <FiHelpCircle size={24} />
          </button>

          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D2E21D]">
            <Image
              src="https://via.placeholder.com/150"
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClassesHeader;
