"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useInView } from "motion/react";
import { useRef } from "react";
import styles from "../styles/Footer.module.css";

export default function Footer() {
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

  const itemVariants = {
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

  const linkVariants = {
    hover: {
      x: 4,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
  };

  const socialVariants = {
    hover: {
      y: -2,
      scale: 1.1,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
  };

  const MotionLink = motion.create(Link);

  return (
    <footer className={styles.footer} ref={ref}>
      <motion.div
        className={styles.footerDecoration}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className={styles.footerDecoration}
        animate={{
          rotate: [360, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className={styles.footerContainer}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className={styles.footerContent}>
          <motion.div className={styles.footerBrand} variants={itemVariants}>
            <MotionLink
              href="/"
              className={styles.footerLogo}
              whileHover={{ scale: 1.05 }}
              transition={{
                type: "spring" as const,
                stiffness: 400,
                damping: 10,
              }}
            >
              Stacknity
            </MotionLink>
            <p className={styles.footerDescription}>
              Empowering teams to build, deploy, and scale applications with
              unprecedented speed and reliability.
            </p>
            <div className={styles.footerSocial}>
              {[
                { icon: "𝕏", href: "#", label: "Twitter" },
                { icon: "in", href: "#", label: "LinkedIn" },
                { icon: "f", href: "#", label: "Facebook" },
                { icon: "ig", href: "#", label: "Instagram" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  variants={socialVariants}
                  whileHover="hover"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div className={styles.footerSection} variants={itemVariants}>
            <h3 className={styles.footerSectionTitle}>Product</h3>
            {[
              { text: "Features", href: "#features" },
              { text: "Pricing", href: "#pricing" },
              { text: "Security", href: "#security" },
              { text: "Integrations", href: "#integrations" },
            ].map((link) => (
              <MotionLink
                key={link.text}
                href={link.href}
                className={styles.footerLink}
                variants={linkVariants}
                whileHover="hover"
              >
                {link.text}
              </MotionLink>
            ))}
          </motion.div>

          <motion.div className={styles.footerSection} variants={itemVariants}>
            <h3 className={styles.footerSectionTitle}>Company</h3>
            {[
              { text: "About", href: "#about" },
              { text: "Blog", href: "#blog" },
              { text: "Careers", href: "#careers" },
              { text: "Contact", href: "/contact" },
            ].map((link) => (
              <MotionLink
                key={link.text}
                href={link.href}
                className={styles.footerLink}
                variants={linkVariants}
                whileHover="hover"
              >
                {link.text}
              </MotionLink>
            ))}
          </motion.div>

          <motion.div className={styles.footerSection} variants={itemVariants}>
            <h3 className={styles.footerSectionTitle}>Support</h3>
            {[
              { text: "Documentation", href: "#docs" },
              { text: "Help Center", href: "#help" },
              { text: "Community", href: "#community" },
              { text: "Status", href: "#status" },
            ].map((link) => (
              <MotionLink
                key={link.text}
                href={link.href}
                className={styles.footerLink}
                variants={linkVariants}
                whileHover="hover"
              >
                {link.text}
              </MotionLink>
            ))}
          </motion.div>
        </div>

        <motion.div className={styles.footerBottom} variants={itemVariants}>
          <p className={styles.footerCopyright}>
            © 2025 Stacknity. All rights reserved.
          </p>
          <div className={styles.footerBottomLinks}>
            {[
              { text: "Privacy Policy", href: "#privacy" },
              { text: "Terms of Service", href: "#terms" },
              { text: "Cookies", href: "#cookies" },
            ].map((link) => (
              <MotionLink
                key={link.text}
                href={link.href}
                className={styles.footerBottomLink}
                whileHover={{ color: "var(--brand-primary)" }}
              >
                {link.text}
              </MotionLink>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
