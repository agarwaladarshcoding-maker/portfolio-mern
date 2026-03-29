import Link from 'next/link';

/**
 * NotFound — Custom 404 page
 * Styled as an HFT order book routing error.
 */
export default function NotFound() {
  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '2rem 0',
    }}>
      {/* Terminal top-bar */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--fg-muted)',
        marginBottom: '2rem',
        letterSpacing: '0.05em',
      }}>
        adarsh@macbook ~ % route-table --lookup
      </div>

      <h1
        className="font-data"
        style={{
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          color: 'var(--accent)',
          lineHeight: 1,
          marginBottom: '0.5rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        404
      </h1>

      <div
        className="font-data"
        style={{
          color: 'var(--fg-muted)',
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
          marginBottom: '1.5rem',
        }}
      >
        [ERR] Route not found in order book. No matching bid/ask.
      </div>

      <p
        className="font-body"
        style={{
          maxWidth: '45ch',
          lineHeight: 1.7,
          color: 'var(--foreground)',
          opacity: 0.7,
          marginBottom: '3rem',
          fontSize: '1rem',
        }}
      >
        The requested path does not exist in the current routing topology.
        All packets have been dropped. Return to root and try again.
      </p>

      <Link
        href="/"
        className="font-data"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: 'var(--accent)',
          color: 'var(--background)',
          textDecoration: 'none',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          transition: 'all 0.2s ease',
        }}
      >
        &lt; REBOOT_SYSTEM()
      </Link>
    </div>
  );
}
