"use client";

import React, { useRef, useMemo, memo, useCallback, Suspense } from "react";
import { motion } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Box, Sphere } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useTheme } from "@stacknity/shared-theme/client";
import Image from "next/image";
import Link from "next/link";
import type { Mesh } from "three";
import styles from "./NotFound.module.css";

// 3D Animation Components - Memoized to prevent unnecessary re-renders
const FloatingCube = memo(
  ({
    position,
    color,
  }: {
    position: [number, number, number];
    color: string;
  }) => {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      }
    });

    return (
      <Box ref={meshRef} args={[0.8, 0.8, 0.8]} position={position}>
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </Box>
    );
  }
);

FloatingCube.displayName = "FloatingCube";

const FloatingSphere = memo(
  ({
    position,
    color,
  }: {
    position: [number, number, number];
    color: string;
  }) => {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.008;
        meshRef.current.rotation.z += 0.008;
        meshRef.current.position.x =
          position[0] + Math.cos(state.clock.elapsedTime + position[2]) * 0.3;
      }
    });

    return (
      <Sphere ref={meshRef} args={[0.5, 16, 16]} position={position}>
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </Sphere>
    );
  }
);

FloatingSphere.displayName = "FloatingSphere";

const AnimatedScene = memo(({ isDark }: { isDark: boolean }) => {
  const cubeColor = isDark ? "#4a8dff" : "#1d6fe0";
  const sphereColor = isDark ? "#4be0b8" : "#3ad29f";
  const accentColor = isDark ? "#d4b5ff" : "#ff8c42";
  const textColor = isDark ? "#ffffff" : "#1e293b";

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      <FloatingCube position={[-2, 0, 0]} color={cubeColor} />
      <FloatingCube position={[2, 1, -1]} color={accentColor} />
      <FloatingSphere position={[0, -1, 1]} color={sphereColor} />
      <FloatingSphere position={[-1, 2, -2]} color={cubeColor} />
      <FloatingCube position={[3, -1, 2]} color={sphereColor} />

      <Text
        position={[0, 0, -3]}
        fontSize={1.2}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/outfit/Outfit-Bold.woff2"
      >
        404
      </Text>
    </>
  );
});

AnimatedScene.displayName = "AnimatedScene";

export default function NotFound() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  const logoSrc = useMemo(() => {
    return isDarkMode
      ? "/logo/stacknitydarktheme.png"
      : "/logo/stacknitylighttheme.png";
  }, [isDarkMode]);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className={styles.notFoundContainer}>
      {/* Background with subtle pattern */}
      <div className={styles.notFoundBackground} />

      {/* 3D Animation Canvas */}
      <div className={styles.animationCanvas}>
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            performance={{ min: 0.5 }}
            dpr={[1, 2]}
          >
            <AnimatedScene isDark={isDarkMode} />
          </Canvas>
        </Suspense>
      </div>

      {/* Main Content */}
      <motion.div
        className={styles.notFoundContent}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className={styles.logoContainer}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.6,
            type: "spring",
            stiffness: 200,
          }}
        >
          <Image
            src={logoSrc}
            alt="Stacknity Logo"
            width={580}
            height={500}
            className={styles.logo}
            priority
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          className={styles.errorCode}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.div
          className={styles.errorMessage}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2>Page Not Found</h2>
          <p>
            Oops! The page you&apos;re looking for seems to have wandered off
            into the digital void. Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className={styles.actionButtons}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleGoBack();
            }}
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Go Back
          </Link>
          <Link href="/" className={`${styles.btn} ${styles.btnPrimary}`}>
            Go Home
          </Link>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className={styles.floatingElements}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          <motion.div
            className={`${styles.floatingElement} ${styles.element1}`}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className={`${styles.floatingElement} ${styles.element2}`}
            animate={{
              y: [0, 15, 0],
              rotate: [360, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className={`${styles.floatingElement} ${styles.element3}`}
            animate={{
              y: [0, -10, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
