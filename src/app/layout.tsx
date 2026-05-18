import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Flash from "@/components/Flash";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
        <Navbar />
        <Flash />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
