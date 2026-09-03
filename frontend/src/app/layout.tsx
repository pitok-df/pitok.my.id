import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Combined from old site pitok.my.id + enhanced
  title: "Pito Desri Pauzi - Portfolio | Full Stack Developer",
  description:
    "Explore the portfolio of Full Stack Developer Pito Desri Pauzi, showcasing expertise in React, Next.js, Node.js, Laravel, and more. Membangun pengalaman digital yang intuitif dan berperforma tinggi.",
  keywords: [
    // English keywords
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "React",
    "Next.js",
    "Laravel",
    "Node.js",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "Portfolio",
    // Indonesian local keywords (from old site)
    "Pengembang Web",
    "Portofolio Developer Padang",
    "Programmer Padang",
    "Politeknik Negeri Padang",
    "Pito Desri Pauzi",
  ],
  authors: [{ name: "Pito Desri Pauzi", url: "https://github.com/PitokDf" }],
  creator: "Pito Desri Pauzi",
  metadataBase: new URL("https://pitok.my.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://pitok.my.id",
    title: "Pito Desri Pauzi - Portfolio",
    description:
      "Full Stack Developer Portfolio — React, Node.js, Laravel, and more.",
    siteName: "Pito Desri Pauzi",
    images: [
      {
        url: "https://pitok.my.id/pito-desri-pauzi.webp",
        width: 800,
        height: 800,
        alt: "Pito Desri Pauzi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pito Desri Pauzi - Portfolio",
    description:
      "Full Stack Developer Portfolio — React, Node.js, Laravel, and more.",
    images: ["https://pitok.my.id/pito-desri-pauzi.webp"],
  },
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
  icons: {
    icon: "/pito-desri-pauzi.webp",
    shortcut: "/pito-desri-pauzi.webp",
    apple: "/pito-desri-pauzi.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://pitok.my.id" />
        <link rel="author" href="https://github.com/PitokDf" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            // Default to dark mode (same as old site) and add bios-booting class immediately if not booted yet
            __html: `(function(){try{var c=document.documentElement.classList;var t=localStorage.getItem('theme');if(t==='light'){c.add('light')}else{c.add('dark');if(!t)localStorage.setItem('theme','dark')}if(sessionStorage.getItem('biosBooted')!=='true'){c.add('bios-booting')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="noise">{children}</body>
    </html>
  );
}
