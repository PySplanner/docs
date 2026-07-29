import { Toaster } from "@/components/ui/sonner"
import { Instrument_Sans } from 'next/font/google';
import { ThemeProvider } from "next-themes"
import "./globals.css"

const instrumentSans = Instrument_Sans({
    subsets: ['latin'],
    variable: '--font-instrument-sans',
});

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" suppressHydrationWarning className={instrumentSans.className}>
      <body>
        <ThemeProvider attribute="class" forcedTheme="dark">
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
