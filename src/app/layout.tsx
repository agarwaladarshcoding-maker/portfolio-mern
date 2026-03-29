import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { EntranceSequencer } from "@/components/EntranceSequencer";
import { StartupBubble } from "@/components/StartupBubble";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import "@/components/StartupBubble.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700", "900"],
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: 'swap',
});

// Next 16 / React 19 viewport metadata
export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

// Simplified metadata
export const metadata: Metadata = {
  title: "Adarsh Agarwala | Systems & Quant",
  description: "Advanced systems engineer and quantitative developer portfolio.",
  metadataBase: new URL("https://adarshagarwala.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          {isMaintenance ? (
            <MaintenanceScreen />
          ) : (
            <>
              <EntranceSequencer />
              <StartupBubble />
              <div className="container">
                <Navbar />
                <main>{children}</main>
                <footer style={{ 
                  marginTop: '5rem', 
                  paddingTop: '2rem', 
                  paddingBottom: '3rem', 
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div className="font-data" style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                    &copy; {new Date().getFullYear()} Adarsh Agarwala. Systems engineer &amp; quant developer.<br/>
                    <a href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem' }}>Let&apos;s connect &rarr;</a>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="https://github.com/adarshagarwala" target="_blank" rel="noopener noreferrer" className="font-data" style={{ color: 'var(--fg-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>GITHUB()</a>
                    <a href="https://linkedin.com/in/adarshagarwala" target="_blank" rel="noopener noreferrer" className="font-data" style={{ color: 'var(--fg-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>LINKEDIN()</a>
                    <a href="https://codeforces.com/profile/AdarshAg" target="_blank" rel="noopener noreferrer" className="font-data" style={{ color: 'var(--fg-muted)', textDecoration: 'none', fontSize: '0.8rem' }}>CF()</a>
                  </div>
                </footer>
              </div>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
