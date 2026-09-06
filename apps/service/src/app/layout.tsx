import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Virtus Service Engine',
  description: 'A clear operating view for client work, projects, and approvals.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
