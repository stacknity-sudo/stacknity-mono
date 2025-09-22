import React from "react";
import { motion } from "motion/react";
import { FiMail } from "react-icons/fi";
import type { VerificationState } from "../_types/verification";
import {
  getStatusIcon,
  getStatusTitle,
  getStatusColor,
} from "../_utils/verificationHelpers";
import styles from "../_styles/AuthContainer.module.css";

interface VerificationStatusProps {
  state: VerificationState;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  state,
}) => {
  return (
    <>
      {/* Status Icon */}
      <motion.div
        className={styles.statusContainer}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ color: getStatusColor(state.status) }}
      >
        {getStatusIcon(state.status, styles)}
      </motion.div>

      {/* Status Title */}
      <motion.h1
        className={styles.verifyTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ color: getStatusColor(state.status) }}
      >
        {getStatusTitle(state.status)}
      </motion.h1>

      {/* Status Message */}
      <motion.p
        className={styles.verifyMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {state.message}
      </motion.p>

      {/* Email Display */}
      {state.email && (
        <motion.div
          className={styles.emailDisplay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <FiMail className={styles.emailIcon} />
          <span className={styles.emailText}>{state.email}</span>
        </motion.div>
      )}
    </>
  );
};
