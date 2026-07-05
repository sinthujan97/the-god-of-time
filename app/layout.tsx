import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import RegisterSW from "@/components/RegisterSW";
import "../styles/globals.css";
import { cn } from "@/lib/utils";

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
    url: "https://thegodoftime.com",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <RegisterSW />
          <Navbar />
          <main className="flex-grow pt-14 md:pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
