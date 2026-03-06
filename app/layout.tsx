import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CuidArte - Seguimiento de Salud para Adultos Mayores",
  description: "Plataforma de evaluación y seguimiento longitudinal de la salud de adultos mayores mediante tests clínicos validados.",
  icons: {
    icon: [
      { url: '/assets/img/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/img/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/img/favicons/favicon.ico' },
    ],
    apple: [
      { url: '/assets/img/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="/assets/css/theme.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Bootstrap y LiveDoc Scripts */}
        <Script src="/vendors/@popperjs/popper.min.js" strategy="beforeInteractive" />
        <Script src="/vendors/bootstrap/bootstrap.min.js" strategy="beforeInteractive" />
        <Script src="/vendors/is/is.min.js" strategy="lazyOnload" />
        <Script src="/vendors/fontawesome/all.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/theme.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
