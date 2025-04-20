import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/header";

const urbanist = Urbanist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bank Simulator",
  description: "Simulator for bytetracker service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={urbanist.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Toaster
            dir="ltr"
            position="bottom-right"
            mobileOffset={30}
            expand
            richColors
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
