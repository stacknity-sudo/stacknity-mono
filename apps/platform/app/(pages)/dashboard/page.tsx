"use client";

import React from "react";
import { DashboardContainer } from "../../../components/dashboard/DashboardContainer";

export default function DashboardPage() {
  // Sample user data
  const currentUser = {
    name: "Alex Johnson",
    email: "alex.johnson@stacknity.com",
    role: "Project Manager",
    avatar: "/images/avatars/alex.jpg",
  };

  return <DashboardContainer user={currentUser} />;
}
