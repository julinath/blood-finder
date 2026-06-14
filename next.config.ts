import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The lab-exam deck lives at public/presentation/index.html; let people
      // type just /presentation. Non-permanent so browsers don't cache it
      // after the deck is removed post-exam.
      {
        source: "/presentation",
        destination: "/presentation/index.html",
        permanent: false,
      },
      // Same idea for the lab report: /report opens the print-ready PDF.
      {
        source: "/report",
        destination: "/report/Blood-Finder-Lab-Report.pdf",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
