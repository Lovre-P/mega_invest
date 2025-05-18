import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PathCorrection from "@/components/PathCorrection";

export const metadata: Metadata = {
  title: "Mega Invest - Premium Investment Opportunities",
  description: "Discover premium investment opportunities with Mega Invest. Grow your wealth with our carefully selected investment options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased font-sans"
      >
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <PathCorrection />
        </div>
      </body>
    </html>
  );
}
