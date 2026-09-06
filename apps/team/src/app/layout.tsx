import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Virtus Team | Find your engine',
  description: 'Join the Virtus team and find the work where your strengths compound.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
