import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0D0B09",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Finaki — Websites, software, agents & everything else. Nairobi.",
  description:
    "Finaki is a Nairobi-born digital studio. Websites, software, AI agents, market entry — and everything in between.",
  openGraph: {
    title: "Finaki — Digital Studio, Nairobi",
    description:
      "Websites, software, AI agents, market entry — and everything in between. From Nairobi, shipping worldwide.",
    url: "https://finaki.co.ke",
    siteName: "Finaki",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "https://finaki.co.ke/og.png",
        width: 1200,
        height: 630,
        alt: "Finaki — Digital studio based in Nairobi, Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finaki — Digital Studio, Nairobi",
    description:
      "Websites, software, AI agents, market entry — and everything in between.",
    images: ["https://finaki.co.ke/og.png"],
  },
  alternates: {
    canonical: "https://finaki.co.ke",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://cdnjs.cloudflare.com"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600&f[]=general-sans@400,500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          defer
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          defer
        />
        <script
          src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"
          defer
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Finaki",
                url: "https://finaki.co.ke",
                logo: "https://finaki.co.ke/favicon.svg",
                description:
                  "Nairobi-born digital studio. Websites, software, AI agents, market entry — and everything in between.",
                foundingDate: "2023",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Nairobi",
                  addressCountry: "KE",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "hello@finaki.co.ke",
                  telephone: "+254700123456",
                  contactType: "customer service",
                },
                sameAs: [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Finaki",
                url: "https://finaki.co.ke",
                description:
                  "Digital studio — websites, software, AI agents, market entry. Nairobi, Kenya.",
                publisher: {
                  "@type": "Organization",
                  name: "Finaki",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "Finaki Studio",
                image: "https://finaki.co.ke/favicon.svg",
                url: "https://finaki.co.ke",
                telephone: "+254700123456",
                email: "hello@finaki.co.ke",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Nairobi",
                  addressRegion: "Nairobi",
                  addressCountry: "KE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: -1.2921,
                  longitude: 36.8219,
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    opens: "09:00",
                    closes: "18:00",
                  },
                ],
                priceRange: "$$",
              },
            ]),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
