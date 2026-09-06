import type { Metadata, Viewport } from 'next';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { RevealManager } from '../components/reveal-manager';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://virtuslabs.example'),
  title: 'VIRTUS LABS | Digital Products & Freelance Services',
  description: 'Premium digital products and freelance services for ambitious businesses.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'VIRTUS LABS | Digital Products & Freelance Services',
    description: 'Premium digital products and freelance services for ambitious businesses.',
    images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'Virtus Labs emblem' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#090909',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#top" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <RevealManager />
      </body>
    </html>
  );
}
