import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

const DashboardLoyout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      {children}
    </div>
  );
};

export default DashboardLoyout;
