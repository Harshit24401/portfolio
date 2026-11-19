import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google';
import { JsonLd } from '@/components/JsonLd';
import { Cursor } from '@/components/motion/Cursor';
import { FlowField } from '@/components/motion/FlowField';
import { Grain } from '@/components/motion/Grain';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { introBootScript } from '@/lib/intro';
import { site } from '@/data/site';
import 'lenis/dist/lenis.css';
import './globals.css';

// next/font downloads these at build time and serves them from our own domain,
// with size-adjusted fallbacks so text doesn't jump when the real font arrives.
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  // Relative URLs below (canonical, og:image) are resolved against this.
  metadataBase: new URL(site.url),
  title: 'Harshit Arora — Full-stack & AI/ML engineer',
  description:
    'Full-stack and AI/ML engineer in my final year of Computer Engineering at Thapar Institute. Open to 6-month internships, Jan–Jun 2027.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: site.name, locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: the boot script below may add data-intro and a
    // style to <html> before React hydrates; that difference is intended.
    <html
      suppressHydrationWarning
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript() }} />
      </head>
      <body className="min-h-screen">
        <JsonLd />
        {/* Behind everything, on every page (z-index -1, fixed to the viewport). */}
        <FlowField />
        {/* Scroll progress bar: pure CSS (animation-timeline: scroll()). */}
        <div className="progress" aria-hidden="true" />
        <RevealObserver />
        <Grain />
        <Cursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
