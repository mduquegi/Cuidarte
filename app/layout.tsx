import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CuidArte - Seguimiento de Salud para Adultos Mayores",
  description: "Plataforma de evaluación y seguimiento longitudinal de la salud de adultos mayores mediante tests clínicos validados.",
  icons: {
    icon: '/assets/img/favicons/favicon.ico',
    apple: '/assets/img/favicons/apple-touch-icon.png',
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
        {children}
      </body>
    </html>
  );
}
