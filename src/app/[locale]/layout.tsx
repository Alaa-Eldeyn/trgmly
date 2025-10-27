import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Providers from "../providers";

const ibm = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trgmly",
  description: "Translate your components effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibm.variable} font-sans antialiased bg-[#f9fafb] text-[#1f2937]`} >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
