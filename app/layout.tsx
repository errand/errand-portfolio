import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aleksandr Shatskikh - full-stack web-developer",
  description: "Full-stack web-engineer with more than 15 years experience.",
  authors: [{ name: 'Aleksandr Shatskikh @errand', url: "https://errand.ru" }],
  openGraph: {
    type: "website",
    url: "https://errand.ru",
    title: "Aleksandr Shatskikh - my site",
    description: "Full-stack web-engineer with more than 15 years experience.",
    siteName: "Full-stack web-developer",
    images: [{
      url: "https://errand.ru/site-image-192x192.png",
    }],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
