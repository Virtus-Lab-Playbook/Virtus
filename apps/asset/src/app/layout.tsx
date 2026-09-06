import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Virtus Asset Engine',
  description: 'A clear operating view for products, versions, licenses, and downloads.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
