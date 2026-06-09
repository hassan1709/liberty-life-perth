import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Montserrat, Dancing_Script } from "next/font/google";
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

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  weight: ["400", "700"],
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
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${montserrat.variable} ${dancingScript.variable}`}>
      <body className="min-h-screen flex flex-col bg-navy text-white antialiased">
        <Nav />
        <div className="mt-32 w-full bg-navy-dark/80 border-b border-white/10 text-center py-2 px-4">
          <p className="text-xs text-white/40 tracking-wide">
            Website currently under renovation — some content may be incomplete.
          </p>
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
