import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yunus İlgün | Yazılım Mühendisi & Bilgisayar Mühendisi",
  description: "Kişisel portfolyo ve blog web sitesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}