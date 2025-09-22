import React from "react";
import { motion } from "motion/react";
import styles from "../_styles/AuthContainer.module.css";

export const VerificationFooter: React.FC = () => {
  return (
    <motion.div
      className={styles.verifyFooter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <p className={styles.footerText}>
        Having trouble? Contact our{" "}
        <a href="mailto:support@stacknity.com" className={styles.supportLink}>
          support team
        </a>
      </p>
    </motion.div>
  );
};
