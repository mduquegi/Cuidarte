import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CuidArte - Health Monitoring for Older Adults | Seguimiento de Salud para Adultos Mayores",
  description: "Assessment and longitudinal monitoring platform for elderly health through validated clinical tests. | Plataforma de evaluación y seguimiento longitudinal de la salud de adultos mayores mediante tests clínicos validados.",
  icons: {
    icon: [
      { url: '/assets/img/favicons/favicon.png' },
      { url: '/assets/img/logo-cuidarte.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: '/assets/img/logo-cuidarte.png',
    shortcut: '/assets/img/favicons/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
