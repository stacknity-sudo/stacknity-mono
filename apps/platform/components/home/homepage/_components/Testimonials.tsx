"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import styles from "../styles/Testimonials.module.css";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialsProps {
  title: string;
  subtitle: string;
  items: Testimonial[];
}

export default function Testimonials({
  title,
  subtitle,
  items,
}: TestimonialsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <motion.span
        key={index}
        className={`${styles.star} ${index >= rating ? styles.empty : ""}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={
          isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
        }
        transition={{
          delay: 0.5 + index * 0.1,
          type: "spring" as const,
          stiffness: 200,
          damping: 10,
        }}
      >
        ★
      </motion.span>
    ));
  };

  return (
    <section className={styles.testimonials} ref={ref}>
      <motion.div
        className={styles.backgroundDecoration}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className={styles.backgroundDecoration}
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className={styles.testimonialsContainer}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          className={styles.testimonialsHeader}
          variants={headerVariants}
        >
          <h2 className={styles.testimonialsTitle}>{title}</h2>
          <p className={styles.testimonialsSubtitle}>{subtitle}</p>
        </motion.div>

        <div className={styles.testimonialsGrid}>
          {items.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className={styles.testimonialCard}
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
              <p className={styles.testimonialContent}>{testimonial.content}</p>

              <div className={styles.testimonialFooter}>
                <motion.img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className={styles.testimonialAvatar}
                  whileHover={{
                    scale: 1.1,
                    transition: {
                      type: "spring" as const,
                      stiffness: 400,
                      damping: 10,
                    },
                  }}
                />

                <div className={styles.testimonialInfo}>
                  <h4 className={styles.testimonialName}>{testimonial.name}</h4>
                  <p className={styles.testimonialRole}>
                    {testimonial.role}
                    <span className={styles.testimonialCompany}>
                      {" "}
                      at {testimonial.company}
                    </span>
                  </p>
                </div>

                <div className={styles.testimonialRating}>
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
