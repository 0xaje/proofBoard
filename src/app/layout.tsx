import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ProofBoard | Walrus-Native Feedback & Reputation platform",
  description: "The premier platform for builders and users to collaborate in the Walrus ecosystem. Submit bug reports, request features, and earn reputation through verified contributions.",
  keywords: ["Walrus Protocol", "Feedback", "Reputation", "Crypto", "Web3", "Hackathon", "Decentralized Storage"],
  openGraph: {
    title: "ProofBoard | Walrus-Native Feedback & Reputation",
    description: "Shape the future of Walrus Protocol through verified feedback.",
    images: ["/hero-asset.png"],
  },
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
