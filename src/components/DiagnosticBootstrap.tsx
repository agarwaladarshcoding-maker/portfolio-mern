"use client";

import { useEffect } from "react";
import { runDiagnostics } from "@/utils/domDiagnostics";

/**
 * DiagnosticBootstrap Component
 * 
 * A client-side wrapper to initialize DOM diagnostics without 
 * converting the entire root layout into a Client Component.
 */
export function DiagnosticBootstrap() {
  useEffect(() => {
    const cleanup = runDiagnostics();
    return () => cleanup?.();
  }, []);

  return null; // This component doesn't render anything
}
