import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google';
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
  title: 'Harshit Arora — Full-stack & AI/ML engineer',
  description:
    'Full-stack and AI/ML engineer in my final year of Computer Engineering at Thapar Institute. Open to 6-month internships, Jan–Jun 2027.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
