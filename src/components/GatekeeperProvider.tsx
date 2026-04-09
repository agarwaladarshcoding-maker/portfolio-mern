"use client";

import { useEffect, useState, ReactNode } from "react";
import { Gatekeeper } from "./Gatekeeper";
import { AnimatePresence, motion } from "framer-motion";

interface GatekeeperProviderProps {
  children: ReactNode;
}

export function GatekeeperProvider({ children }: GatekeeperProviderProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    const unlocked = sessionStorage.getItem("isGatekeeperUnlocked") === "true";
    setIsUnlocked(unlocked);
    setHasChecked(true);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem("isGatekeeperUnlocked", "true");
  };

  // Don't render anything until we've checked session storage to avoid flickers
  if (!hasChecked) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!isUnlocked ? (
        <motion.div
          key="gatekeeper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
        >
          <Gatekeeper onUnlock={handleUnlock} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
