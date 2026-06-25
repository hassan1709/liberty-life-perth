import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["300", "400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Liberty Life Perth",
  description: "A church where you're not a member but you're family. Join us this Sunday in Perth, Western Australia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col bg-navy text-white antialiased">
        <Nav />
        <main className="flex-1 mt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
