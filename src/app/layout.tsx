import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { EntranceSequencer } from "@/components/EntranceSequencer";
import { StartupBubble } from "@/components/StartupBubble";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { cookies } from "next/headers";
import "@/components/StartupBubble.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Adarsh Agarwala | Terminal meets Editorial",
  description: "I code anything. I figure out everything else. Quant, ML, and scalable architecture engineer.",
  openGraph: {
    type: "website",
    url: "https://adarshagarwala.com",
    title: "Adarsh Agarwala | Quant & Systems Engineer",
    description: "I code anything. I figure out everything else.",
    siteName: "Adarsh Agarwala - Portfolio",
    images: [{
      url: "https://adarshagarwala.com/og-image.png",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adarsh Agarwala | Professional",
    description: "Quant & ML engineer. I figure out everything else.",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasSeenBoot = cookieStore.get('hasSeenBootV2')?.value === 'true';
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          {isMaintenance ? (
            <MaintenanceScreen />
          ) : (
            <>
              {!hasSeenBoot && <EntranceSequencer />}
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
