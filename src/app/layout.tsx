import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingNav } from "@/components/FloatingNav";
import { GatekeeperProvider } from "@/components/GatekeeperProvider";
import { siteConfig } from "@/config/site";
import { StartupBubble } from "@/components/StartupBubble";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";
import { MobileHeader } from "@/components/MobileHeader";
import { DiagnosticBootstrap } from "@/components/DiagnosticBootstrap";
import "@/components/StartupBubble.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
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
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE?.trim() === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          {isMaintenance ? (
            <MaintenanceScreen />
          ) : (
            <GatekeeperProvider>
              <div style={{ minHeight: '100vh', position: 'relative' }}>
                <DiagnosticBootstrap />
                <MobileHeader />
                <main style={{ width: '100%' }}>{children}</main>
                <FloatingNav />
              </div>
            </GatekeeperProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
