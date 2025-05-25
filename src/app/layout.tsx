import type { Metadata } from "next";
import dynamic from "next/dynamic"; // Import dynamic
import "./globals.css";
import Navbar from "@/components/Navbar";
// Remove direct import of Footer: import Footer from "@/components/Footer";

// Dynamically import the Footer component
const DynamicFooter = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-16 bg-gray-100" />, // Optional loading skeleton for footer space
  ssr: false, // Optional: Render footer only on client-side if it has client-specific logic or to reduce initial server payload
});

export const metadata: Metadata = {
  title: "Mega Invest - Premium Investment Opportunities",
  description: "Discover premium investment opportunities with Mega Invest. Grow your wealth with our carefully selected investment options.",
};

import { Geist, Geist_Mono } from '@next/font/google'; // Using @next/font
import { Roboto, Libre_Baskerville } from '@next/font/google'; // Using @next/font

// Configure Geist Sans
const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-geist-sans', // CSS variable for Tailwind
});

// Configure Geist Mono
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-geist-mono', // CSS variable for Tailwind
});

// Configure Roboto
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'], // Assuming normal and italic might be used
  display: 'swap',
  variable: '--font-roboto',
});

// Configure Libre Baskerville
const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'], // Assuming regular and bold
  style: ['normal', 'italic'], // Assuming normal and italic might be used
  display: 'swap',
  variable: '--font-libre-baskerville',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${roboto.variable} ${libreBaskerville.variable}`}>
      <head>
        {/* Removed direct Google Font <link> tags. @next/font handles this. */}
      </head>
      <body
        className="antialiased font-sans" // font-sans will be configured in tailwind.config.js to use --font-geist-sans
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <DynamicFooter /> {/* Use the dynamically imported Footer */}
        </div>
      </body>
    </html>
  );
}
