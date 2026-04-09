"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Terminal } from "lucide-react";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`${styles.header} ${scrolled ? styles.scrolled : styles.hidden}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: scrolled ? '0.75rem 2rem' : '1.5rem 2rem',
        backgroundColor: scrolled ? 'rgba(11, 12, 16, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '2px solid var(--accent)' : 'none',
        transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
        opacity: scrolled ? 1 : 0,
        pointerEvents: scrolled ? 'auto' : 'none'
      }}
    >
      <div 
        className="container"
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 0,
          border: 'none'
        }}
      >
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <Link href="/" className="nav-link font-heading" style={{ fontSize: '1rem', fontWeight: 700 }}>
              INDEX_
            </Link>
            <Link href="/grind" className="nav-link" style={{ fontSize: '0.85rem' }}>
              GRIND
            </Link>
            <Link href="/now" className="nav-link" style={{ fontSize: '0.85rem' }}>
              NOW
            </Link>
            <Link href="/contact" className="nav-link" style={{ fontSize: '0.85rem' }}>
              CONTACT
            </Link>
          </div>
        </nav>

        <div className={styles.rightSection}>
          <a href="/resume.pdf" download className="button-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', border: '2px solid var(--accent)' }}>
            <Download size={14} style={{ marginRight: '0.5rem' }} />
            RESUME
          </a>
        </div>
      </div>
    </header>
  );
}
