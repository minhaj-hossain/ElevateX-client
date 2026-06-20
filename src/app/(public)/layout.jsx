import Navbar from "@/components/shared/Navbar";
import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default PublicLayout;
