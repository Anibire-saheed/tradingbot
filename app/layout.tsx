import { Suspense } from "react";
import { ActivityNotifications } from "@/components/ui/activity-notifications";
import { RetireServiceWorker } from "@/components/pwa/retire-service-worker";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from "@/lib/wallet/wallet-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OmniBot",
  applicationName: "OmniBot",
  icons: { apple: "/icons/icon-180.png", icon: "/favicon.ico" },
  description: "Build, test, and automate your trading plan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WalletProvider>
          {children}
          <Toaster />
          <RetireServiceWorker />
          <Suspense fallback={null}>
            <ActivityNotifications />
          </Suspense>
        </WalletProvider>
      </body>
    </html>
  );
}
