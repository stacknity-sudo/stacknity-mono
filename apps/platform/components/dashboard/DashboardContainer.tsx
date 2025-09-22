"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./_components/Sidebar";
import { SidebarUser } from "./_types/sidebar";
import { Button } from "@stacknity/shared-ui";
import {
  FiActivity,
  FiUsers,
  FiFolder,
  FiTrendingUp,
  FiPlus,
  FiFilter,
  FiDownload,
  FiMoreHorizontal,
} from "react-icons/fi";
import styles from "./DashboardContainer.module.css";

interface DashboardContainerProps {
  children?: React.ReactNode;
  user?: SidebarUser;
  className?: string;
}

// Sample data for the dashboard
const stats = [
  {
    id: "projects",
    label: "Active Projects",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: FiFolder,
  },
  {
    id: "team",
    label: "Team Members",
    value: "47",
    change: "+5",
    changeType: "positive" as const,
    icon: FiUsers,
  },
  {
    id: "activity",
    label: "This Week",
    value: "152",
    change: "+23%",
    changeType: "positive" as const,
    icon: FiActivity,
  },
  {
    id: "growth",
    label: "Growth Rate",
    value: "98.2%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: FiTrendingUp,
  },
];

const recentProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    status: "In Progress",
    progress: 75,
    team: 5,
    dueDate: "2025-10-15",
  },
  {
    id: 2,
    name: "Mobile App Redesign",
    status: "Review",
    progress: 90,
    team: 3,
    dueDate: "2025-09-30",
  },
  {
    id: 3,
    name: "Analytics Dashboard",
    status: "Planning",
    progress: 25,
    team: 4,
    dueDate: "2025-11-20",
  },
];

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  children,
  user,
  className = "",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Handle sidebar collapse changes
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Sample user data if none provided
  const defaultUser: SidebarUser = {
    name: "Alex Johnson",
    email: "alex.johnson@stacknity.com",
    role: "Project Manager",
    avatar: "/images/avatars/alex.jpg",
  };

  const containerClasses = [
    styles.dashboardContainer,
    className,
    sidebarCollapsed && !isMobile && styles.sidebarCollapsed,
    isMobile && styles.mobile,
  ]
    .filter(Boolean)
    .join(" ");

  const currentUser = user || defaultUser;

  return (
    <div className={containerClasses}>
      {/* Sidebar */}
      <Sidebar
        user={currentUser}
        onCollapseChange={handleSidebarCollapseChange}
        defaultCollapsed={false}
        className={styles.sidebar}
      />

      {/* Main Content */}
      <main
        className={styles.mainContent}
        style={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 96 : 296, // Account for 1rem (16px) card margin: 80+16=96, 280+16=296
        }}
      >
        <div className={styles.contentWrapper}>
          {children || (
            <div className={styles.dashboardPage}>
              {/* Header Section */}
              <div className={styles.header}>
                <div className={styles.headerContent}>
                  <div>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>
                      Welcome back, {currentUser.name}. Here&apos;s what&apos;s
                      happening with your projects.
                    </p>
                  </div>
                  <div className={styles.headerActions}>
                    <Button
                      variant="outline"
                      leftIcon={<FiFilter />}
                      className={styles.actionButton}
                    >
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={<FiDownload />}
                      className={styles.actionButton}
                    >
                      Export
                    </Button>
                    <Button
                      variant="primary"
                      leftIcon={<FiPlus />}
                      className={styles.actionButton}
                    >
                      New Project
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                {stats.map((stat) => (
                  <div key={stat.id} className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <div className={styles.statIcon}>
                        <stat.icon />
                      </div>
                      <button className={styles.statMenu}>
                        <FiMoreHorizontal />
                      </button>
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>{stat.value}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                      <div
                        className={`${styles.statChange} ${
                          styles[stat.changeType]
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className={styles.contentGrid}>
                {/* Recent Projects */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Projects</h2>
                    <Button variant="ghost" size="small">
                      View All
                    </Button>
                  </div>
                  <div className={styles.projectsList}>
                    {recentProjects.map((project) => (
                      <div key={project.id} className={styles.projectCard}>
                        <div className={styles.projectHeader}>
                          <h3 className={styles.projectName}>{project.name}</h3>
                          <span
                            className={`${styles.projectStatus} ${
                              styles[
                                project.status.toLowerCase().replace(" ", "")
                              ]
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className={styles.projectDetails}>
                          <div className={styles.progressContainer}>
                            <div className={styles.progressLabel}>
                              Progress: {project.progress}%
                            </div>
                            <div className={styles.progressBar}>
                              <div
                                className={styles.progressFill}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                          <div className={styles.projectMeta}>
                            <span>{project.team} team members</span>
                            <span>
                              Due:{" "}
                              {new Date(project.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Quick Actions</h2>
                  </div>
                  <div className={styles.quickActions}>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<FiPlus />}
                      className={styles.quickAction}
                    >
                      Create New Project
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<FiUsers />}
                      className={styles.quickAction}
                    >
                      Invite Team Member
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<FiActivity />}
                      className={styles.quickAction}
                    >
                      View Reports
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<FiFolder />}
                      className={styles.quickAction}
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardContainer;
