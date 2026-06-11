import type { Metadata } from "next";
import { Geist, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Flash from "@/components/Flash";
import Footer from "@/components/Footer";

// Latin UI font (English + numerals); Bengali glyphs fall through to Hind Siliguri.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Dedicated Bengali font — far nicer বাংলা rendering than the system fallback.
const bengali = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blood Finder — Find verified blood donors in Bangladesh",
  description:
    "Find verified blood donors near you in seconds. A trusted platform connecting donors and recipients across Bangladesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${geist.variable} ${bengali.variable}`}>
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased">
        <Navbar />
        <Flash />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
