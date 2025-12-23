import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import { Marcellus } from "next/font/google";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

export const metadata: Metadata = {
  title: "The Sporadic Thinker",
  description: "A blog about thoughts, ideas, and everything in between",
  icons: {
    icon: "/webtile.png",
    shortcut: "/webtile.png",
    apple: "/webtile.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={marcellus.variable}>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
