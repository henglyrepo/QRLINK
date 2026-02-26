import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://qrlink-weld.vercel.app";
const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || "ca-pub-1285117831702493";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QrLink - Free QR Code Generator | Create Custom QR Codes Online",
    template: "%s | QrLink",
  },
  description: "Generate beautiful QR codes instantly with QrLink. Free online QR code maker with logo support, custom colors, PNG/SVG download. Best QR code generator for business and marketing in 2025 2026.",
  keywords: [
    "qr code generator",
    "free qr code",
    "qr code maker",
    "create qr code",
    "qr code creator",
    "qr code with logo",
    "custom qr code",
    "qr code colors",
    "qr code download",
    "qr code png",
    "qr code svg",
    "qr code scanner",
    "qr code for business",
    "marketing qr code",
    "dynamic qr code",
    "best qr code generator",
    "online qr code generator",
    "qr code generator free",
    "qr code maker online",
  ],
  authors: [{ name: "QrLink" }],
  creator: "QrLink",
  publisher: "QrLink",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "QrLink",
    title: "QrLink - Free QR Code Generator | Create Custom QR Codes Online",
    description: "Generate beautiful QR codes instantly with QrLink. Free online QR code maker with logo support, custom colors, PNG/SVG download.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QrLink - Free QR Code Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QrLink - Free QR Code Generator",
    description: "Generate beautiful QR codes instantly with custom colors, logos, and free PNG/SVG download.",
    images: ["/og-image.png"],
    creator: "@qrlink",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={adsenseId} />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "QrLink",
              description: "Free QR code generator with logo support, custom colors, and PNG/SVG download",
              url: siteUrl,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "QrLink",
                url: siteUrl,
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased gradient-bg min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
