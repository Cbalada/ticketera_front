import type { Metadata } from "next";
import { Sora, Hanken_Grotesk } from "next/font/google";
import { AppProviders } from "@/providers";
import { Toaster } from "sonner";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticket + | Sentí el Pulso",
  description: "La plataforma definitiva para vivir la música en vivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${sora.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
        <AppProviders>
          {children}
        </AppProviders>
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
