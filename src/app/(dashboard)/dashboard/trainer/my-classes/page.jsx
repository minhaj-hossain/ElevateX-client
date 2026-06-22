import MyClassesHeader from "@/components/dashboard/trainer/Header";
import ClassManagement from "@/components/dashboard/trainer/my-classes/ClassManagement";
import MetricDashboard from "@/components/dashboard/trainer/my-classes/MatrixDashboard";
import React from "react";

const MyClassPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <MyClassesHeader />
      <MetricDashboard />
      <ClassManagement />
    </div>
  );
};

export default MyClassPage;
