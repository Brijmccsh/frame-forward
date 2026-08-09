import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-head",
});

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const title = "Frame Forward — Photography that gives back.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: title,
    template: "%s · Frame Forward",
  },
  description: BRAND.description,
  applicationName: "Frame Forward",
  keywords: [
    "student photography",
    "nonprofit photos",
    "community service hours",
    "free photos for nonprofits",
    "teen photographers",
  ],
  authors: [{ name: "Frame Forward" }],
  openGraph: {
    type: "website",
    siteName: "Frame Forward",
    title,
    description: BRAND.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#16171B" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${figtree.variable}`}
    >
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
