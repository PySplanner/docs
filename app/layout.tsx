import { Toaster } from "@/components/ui/sonner"
import { Instrument_Sans } from 'next/font/google';
import { ThemeProvider } from "next-themes"
import "./globals.css"

import { Footer } from '@/components/footer';

const instrumentSans = Instrument_Sans({
    subsets: ['latin'],
    variable: '--font-instrument-sans',
});

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" suppressHydrationWarning className={instrumentSans.className}>
      <body className="flex-1 flex flex-col h-screen w-screen overflow-y-auto relative">
        <ThemeProvider attribute="class" forcedTheme="dark">
          {children}
          <Footer className="w-full bg-background z-50 shrink-0" />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
