"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Download } from "lucide-react";
import styles from "./Navbar.module.css";

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navLinks}>
          <Link href="/" className="nav-link font-heading">
            Index
          </Link>
          <Link href="/grind" className="nav-link">
            Grind
          </Link>
          <Link href="/now" className="nav-link">
            Now
            <span className="indicator">
              <span className="indicator-ring"></span>
              <span className="indicator-dot"></span>
            </span>
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </div>
      </nav>

      <div className={styles.rightSection}>
        <a href="/resume.pdf" download className="button-outline">
          <Download size={14} style={{ marginRight: '0.5rem' }} />
          Resume
        </a>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className={styles.themeToggle}
          aria-label="Toggle Theme"
        >
          {mounted ? (
            resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />
          ) : (
            <div style={{ width: 18, height: 18 }} />
          )}
        </button>
      </div>
    </header>
  );
}
