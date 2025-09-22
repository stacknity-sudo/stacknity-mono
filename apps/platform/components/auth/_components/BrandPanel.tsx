"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FiShield, FiZap, FiUsers } from "react-icons/fi";
import type { BrandContentItem } from "../_types/auth";
import styles from "../_styles/AuthContainer.module.css";

interface BrandPanelProps {
  isFlipped: boolean;
}

const features: BrandContentItem[] = [
  {
    icon: <FiShield />,
    title: "Our Mission",
    description:
      "To unify the fragmented toolsets of modern teams into one secure, developer-first ecosystem — where collaboration, innovation, and community thrive through connected workspaces, shared knowledge, and scalable technology.",
  },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" },
];

export const BrandPanel: React.FC<BrandPanelProps> = ({ isFlipped }) => {
  return (
    <motion.div
      className={styles.rightPanel}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <div className={styles.brandContent}>
        {/* Background Elements */}
        <div className={styles.backgroundElements}>
          <motion.div
            className={styles.floatingElement}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={styles.floatingElement}
            animate={{
              y: [0, 15, 0],
              rotate: [0, -3, 3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Dynamic Content Based on Current Side */}
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            // Login content
            <motion.div
              key="login-content"
              className={styles.heroContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.heroIcon}>
                <FiZap />
              </div>
              <h2 className={styles.heroTitle}>Power your development</h2>
              <p className={styles.heroDescription}>
                Join thousands of developers building the future with our
                comprehensive platform.
              </p>
            </motion.div>
          ) : (
            // Register content
            <motion.div
              key="register-content"
              className={styles.heroContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.heroIcon}>
                <FiUsers />
              </div>
              <h2 className={styles.heroTitle}>Join our community</h2>
              <p className={styles.heroDescription}>
                Connect with like-minded developers and accelerate your growth.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Image */}
        <motion.div
          className={styles.brandImage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Image
            src="/images/auth-image.png"
            alt="Stacknity Platform"
            width={550}
            height={413}
            className={styles.authImage}
            priority
          />
        </motion.div>

        {/* Feature List */}
        <motion.div
          className={styles.featureList}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className={styles.stat}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
