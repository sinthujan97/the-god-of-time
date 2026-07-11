import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import RegisterSW from "@/components/RegisterSW";
import "../styles/globals.css";
import { cn } from "@/lib/utils";

// Set NEXT_PUBLIC_ADSENSE_CLIENT_ID (format "ca-pub-XXXXXXXXXXXXXXXX") once an
// AdSense Publisher ID exists. Renders nothing until then.
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const GA_MEASUREMENT_ID = "G-WY92F7LZ6L";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

const spaceGroteskHeadline = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-headline",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thegodoftime.com"),
  title: "The God of Time",
  description: "A hub of utility time calculators and immersive relativistic cosmic experiences.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "The God of Time",
    description: "A hub of utility time calculators and immersive relativistic cosmic experiences.",
    url: "/",
    siteName: "The God of Time",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "The God of Time Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", cormorant.variable, spaceGrotesk.variable, spaceGroteskHeadline.variable, jetbrains.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary" suppressHydrationWarning>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <RegisterSW />
          <Navbar />
          <main className="flex-grow pt-14 md:pt-16">
            {/* Left Floating Ad Skyscraper */}
            <aside className="desktop-ad-rail-left">
              <div className="desktop-ad-placeholder">
                <span className="text-[9px] font-mono text-text-faint uppercase block text-center mb-1.5 tracking-wider">Advertisement</span>
                <div className="desktop-ad-box text-center">
                  <span className="text-xl mb-2">🎁</span>
                  <span className="text-[10px] font-mono text-text-muted font-bold block mb-1">Skyscraper Ad</span>
                  <span className="text-[9px] font-mono text-text-faint block">160 × 600 Slot</span>
                </div>
              </div>
            </aside>

            {children}

            {/* Right Floating Ad Skyscraper */}
            <aside className="desktop-ad-rail-right">
              <div className="desktop-ad-placeholder">
                <span className="text-[9px] font-mono text-text-faint uppercase block text-center mb-1.5 tracking-wider">Advertisement</span>
                <div className="desktop-ad-box text-center">
                  <span className="text-xl mb-2">🎁</span>
                  <span className="text-[10px] font-mono text-text-muted font-bold block mb-1">Skyscraper Ad</span>
                  <span className="text-[9px] font-mono text-text-faint block">160 × 600 Slot</span>
                </div>
              </div>
            </aside>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
