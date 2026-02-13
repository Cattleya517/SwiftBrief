import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SwiftBrief — 民事本票裁定聲請狀產生器",
  description:
    "線上填寫表單，即時預覽並產生符合台灣法院格式的民事本票裁定聲請狀 PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${jakarta.variable} antialiased`}>{children}</body>
    </html>
  );
}
