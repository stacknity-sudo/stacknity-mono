"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Suspense, lazy } from "react";
import styles from "../styles/Hero.module.css";

// Dynamically import Three.js components to avoid SSR issues
const Canvas = lazy(() =>
  import("@react-three/fiber").then((module) => ({ default: module.Canvas }))
);
const OrbitControls = lazy(() =>
  import("@react-three/drei").then((module) => ({
    default: module.OrbitControls,
  }))
);
const Sphere = lazy(() =>
  import("@react-three/drei").then((module) => ({ default: module.Sphere }))
);
const MeshDistortMaterial = lazy(() =>
  import("@react-three/drei").then((module) => ({
    default: module.MeshDistortMaterial,
  }))
);

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
    variant: "primary" | "secondary";
  };
  secondaryCTA: {
    text: string;
    href: string;
    variant: "primary" | "secondary";
  };
}

// 3D Animated Sphere Component
function AnimatedSphere() {
  return (
    <Suspense fallback={null}>
      <Sphere visible args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color="#0066ff"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
          transparent
          opacity={0.15}
        />
      </Sphere>
    </Suspense>
  );
}

// 3D Background Component
function ThreeBackground() {
  return (
    <div className={styles.heroBackground}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 8] }}
          style={{
            background: "transparent",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <AnimatedSphere />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={1}
            />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
}: HeroProps) {
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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  };

  const MotionLink = motion.create(Link);

  return (
    <section className={styles.hero}>
      <ThreeBackground />

      {/* Floating Elements */}
      <div className={styles.floatingElements}>
        <motion.div
          className={styles.floatingElement}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
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
            y: [0, -15, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className={styles.floatingElement}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        <motion.div
          className={styles.floatingElement}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <motion.div
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className={styles.heroSubtitle} variants={itemVariants}>
          {subtitle}
        </motion.h2>

        <motion.h1 className={styles.heroTitle} variants={itemVariants}>
          {title}
        </motion.h1>

        <motion.p className={styles.heroDescription} variants={itemVariants}>
          {description}
        </motion.p>

        <motion.div className={styles.heroCTAs} variants={itemVariants}>
          <MotionLink
            href={primaryCTA.href}
            className={`${styles.ctaButton} ${styles[primaryCTA.variant]}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {primaryCTA.text}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </MotionLink>

          <MotionLink
            href={secondaryCTA.href}
            className={`${styles.ctaButton} ${styles[secondaryCTA.variant]}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {secondaryCTA.text}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ▶
            </motion.span>
          </MotionLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
