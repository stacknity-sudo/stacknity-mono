"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useInView } from "motion/react";
import { useRef } from "react";
import styles from "../styles/JoinUs.module.css";

export default function JoinUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      y: 60,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const contributionOpportunities = [
    {
      icon: "💻",
      title: "Frontend Development",
      description:
        "Help us build beautiful, responsive user interfaces with React, Next.js, and modern web technologies.",
    },
    {
      icon: "⚙️",
      title: "Backend Development",
      description:
        "Contribute to our server-side architecture using Node.js, databases, and API development.",
    },
    {
      icon: "🎨",
      title: "UI/UX Design",
      description:
        "Design intuitive user experiences and create stunning visual interfaces that users love.",
    },
    {
      icon: "📝",
      title: "Documentation",
      description:
        "Help us create comprehensive guides, tutorials, and documentation for developers.",
    },
    {
      icon: "🧪",
      title: "Testing & QA",
      description:
        "Ensure quality by writing tests, finding bugs, and improving our development processes.",
    },
    {
      icon: "🌍",
      title: "Community Building",
      description:
        "Help grow our community, moderate discussions, and support other contributors.",
    },
  ];

  const MotionLink = motion.create(Link);

  return (
    <section className={styles.joinUs} ref={ref}>
      <div className={styles.backgroundPattern} />

      <motion.div
        className={styles.joinUsContainer}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className={styles.statusBadge} variants={itemVariants}>
          🚧 Under Development
        </motion.div>

        <motion.h2 className={styles.joinUsTitle} variants={itemVariants}>
          Building Stacknity Together
        </motion.h2>

        <motion.p className={styles.joinUsSubtitle} variants={itemVariants}>
          Stacknity is an exciting new platform in active development.
          We&apos;re looking for passionate developers, designers, and
          contributors who want to be part of something innovative from the
          ground up. Join us in building the future of team collaboration!
        </motion.p>

        <motion.div
          className={styles.developmentStatus}
          variants={itemVariants}
        >
          <div className={styles.statusItem}>
            <motion.h3
              className={styles.statusValue}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                delay: 0.5,
                type: "spring" as const,
                stiffness: 200,
              }}
            >
              30%
            </motion.h3>
            <p className={styles.statusLabel}>Development Progress</p>
          </div>
          <div className={styles.statusItem}>
            <motion.h3
              className={styles.statusValue}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                delay: 0.7,
                type: "spring" as const,
                stiffness: 200,
              }}
            >
              Early
            </motion.h3>
            <p className={styles.statusLabel}>Stage Startup</p>
          </div>
          <div className={styles.statusItem}>
            <motion.h3
              className={styles.statusValue}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                delay: 0.9,
                type: "spring" as const,
                stiffness: 200,
              }}
            >
              ∞
            </motion.h3>
            <p className={styles.statusLabel}>Opportunities</p>
          </div>
          <div className={styles.statusItem}>
            <motion.h3
              className={styles.statusValue}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                delay: 1.1,
                type: "spring" as const,
                stiffness: 200,
              }}
            >
              You
            </motion.h3>
            <p className={styles.statusLabel}>We Need</p>
          </div>
        </motion.div>

        <div className={styles.contributionGrid}>
          {contributionOpportunities.map((opportunity, index) => (
            <motion.div
              key={index}
              className={styles.contributionCard}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: {
                  type: "spring" as const,
                  stiffness: 400,
                  damping: 10,
                },
              }}
            >
              <span className={styles.contributionIcon}>
                {opportunity.icon}
              </span>
              <h3 className={styles.contributionTitle}>{opportunity.title}</h3>
              <p className={styles.contributionDescription}>
                {opportunity.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div className={styles.callToAction} variants={itemVariants}>
          <h3 className={styles.ctaTitle}>Ready to Join Our Journey?</h3>
          <p className={styles.ctaDescription}>
            We&apos;re a bootstrap startup with big dreams and limited
            resources. While we can&apos;t offer salaries yet, we can offer
            equity, valuable experience, and the chance to build something
            amazing from scratch. Your contributions will shape the future of
            Stacknity!
          </p>
          <div className={styles.ctaButtons}>
            <motion.a
              href="https://github.com/stacknity"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.ctaButton} ${styles.primary}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View on GitHub
              <span>→</span>
            </motion.a>
            <MotionLink
              href="/contact"
              className={`${styles.ctaButton} ${styles.secondary}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
              <span>✉</span>
            </MotionLink>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
