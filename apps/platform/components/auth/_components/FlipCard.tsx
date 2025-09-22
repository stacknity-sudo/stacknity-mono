"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import styles from "../_styles/AuthContainer.module.css";

interface FlipCardWrapperProps {
  isFlipped: boolean;
  onFlip: () => void;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

export const FlipCard: React.FC<FlipCardWrapperProps> = ({
  isFlipped,
  frontContent,
  backContent,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // For mobile, use a simple div without 3D animations
  if (isMobile) {
    return (
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}>
        {/* Front Side (Login) */}
        <div className={`${styles.cardSide} ${styles.cardFront}`}>
          {frontContent}
        </div>

        {/* Back Side (Register) */}
        <div className={`${styles.cardSide} ${styles.cardBack}`}>
          {backContent}
        </div>
      </div>
    );
  }

  // For desktop, use the 3D flip animation
  return (
    <motion.div
      className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
      initial={false}
      animate={{
        rotateY: isFlipped ? 180 : 0,
      }}
      transition={{
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Front Side (Login) */}
      <div className={`${styles.cardSide} ${styles.cardFront}`}>
        {frontContent}
      </div>

      {/* Back Side (Register) */}
      <div className={`${styles.cardSide} ${styles.cardBack}`}>
        {backContent}
      </div>
    </motion.div>
  );
};

export const useFlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const resetFlip = () => {
    setIsFlipped(false);
  };

  return {
    isFlipped,
    handleFlip,
    resetFlip,
  };
};
