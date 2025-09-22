"use client";

import React from "react";
import ThemedButton from "@/components/UI/button/ThemedButton";
import { useImpersonation } from "@/lib/hooks/users/useImpersonation";
import styles from "./ImpersonationBanner.module.css";

export default function ImpersonationBanner() {
  const { stopImpersonation, isWorking } = useImpersonation();
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        setActive(window.localStorage.getItem("impersonating") === "1");
      }
    } catch {}
  }, []);

  if (!active) return null;

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span className={styles.title}>Impersonating</span>
      <ThemedButton
        variant="secondary"
        size="small"
        onClick={() => void stopImpersonation()}
        disabled={isWorking}
        aria-label="Stop impersonation"
        className={styles.stopButton}
      >
        {isWorking ? "Stopping…" : "Stop impersonation"}
      </ThemedButton>
    </div>
  );
}
