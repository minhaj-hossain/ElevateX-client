import {  getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";

const TrainerLayout = async ({ children }) => {
  const user = await getUserSession();

  if (!user) return redirect("/login");
  if (user?.role !== "trainer") return redirect("/unauthorized");

  return <div>{children}</div>;
};

export default TrainerLayout;
