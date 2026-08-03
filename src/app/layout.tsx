import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { DemoProvider } from "@/components/providers/DemoProvider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.brandName} | תיווך דירות בירושלים`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.aboutShort,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frank.variable} ${heebo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">
        <AuthProvider>
          <DemoProvider>{children}</DemoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
