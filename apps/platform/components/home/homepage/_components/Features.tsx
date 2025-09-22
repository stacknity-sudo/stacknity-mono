"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import styles from "../styles/Features.module.css";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface FeaturesProps {
  title: string;
  subtitle: string;
  items: Feature[];
}

export default function Features({ title, subtitle, items }: FeaturesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
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

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
  };

  return (
    <section className={styles.features} ref={ref}>
      <div className={styles.backgroundPattern} />

      <motion.div
        className={styles.featuresContainer}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className={styles.featuresHeader} variants={headerVariants}>
          <h2 className={styles.featuresTitle}>{title}</h2>
          <p className={styles.featuresSubtitle}>{subtitle}</p>
        </motion.div>

        <div className={styles.featuresGrid}>
          {items.map((feature) => (
            <motion.div
              key={feature.id}
              className={styles.featureCard}
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
              <motion.span
                className={styles.featureIcon}
                style={{ color: feature.color }}
                variants={iconVariants}
                whileHover="hover"
              >
                {feature.icon}
              </motion.span>

              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
