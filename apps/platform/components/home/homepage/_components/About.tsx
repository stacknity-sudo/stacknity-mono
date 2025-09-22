"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import styles from "../styles/About.module.css";

interface AboutProps {
  title: string;
  subtitle: string;
  description: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  image: string;
}

export default function About({
  title,
  subtitle,
  description,
  stats,
  image,
}: AboutProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const leftVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const rightVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const statVariants = {
    hidden: { y: 30, opacity: 0 },
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

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  return (
    <section className={styles.about} ref={ref}>
      <div className={styles.backgroundPattern} />

      <motion.div
        className={styles.aboutContainer}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className={styles.aboutContent} variants={leftVariants}>
          <h3 className={styles.aboutSubtitle}>{subtitle}</h3>
          <h2 className={styles.aboutTitle}>{title}</h2>
          <p className={styles.aboutDescription}>{description}</p>

          <div className={styles.aboutStats}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={styles.statItem}
                variants={statVariants}
                whileHover={{
                  y: -4,
                  transition: {
                    type: "spring" as const,
                    stiffness: 400,
                    damping: 10,
                  },
                }}
              >
                <motion.h4
                  className={styles.statValue}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 200,
                    damping: 15,
                    delay: 0.5 + index * 0.1,
                  }}
                >
                  {stat.value}
                </motion.h4>
                <p className={styles.statLabel}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className={styles.aboutVisual} variants={rightVariants}>
          <motion.div
            className={styles.visualDecoration}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className={styles.visualDecoration}
            animate={{
              rotate: [360, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.img
            src={image}
            alt="About us"
            className={styles.aboutImage}
            variants={imageVariants}
            whileHover={{
              scale: 1.05,
              transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 10,
              },
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
