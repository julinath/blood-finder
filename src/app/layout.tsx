import type { Metadata } from "next";
import { Geist, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Flash from "@/components/Flash";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth state is resolved on the SERVER and passed down. The browser client's
  // cookie reads proved unreliable for aged/OAuth sessions in production
  // (server saw the session, client didn't → navbar showed Login while the
  // user was signed in), so the server is the single source of truth here.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let viewer: { id: string; email: string; name: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    viewer = {
      id: user.id,
      email: user.email ?? "",
      name: profile?.full_name ?? "",
    };
  }

  return (
    <html lang="bn" className={`${geist.variable} ${bengali.variable}`}>
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased">
        <Navbar initialViewer={viewer} />
        <Flash />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
