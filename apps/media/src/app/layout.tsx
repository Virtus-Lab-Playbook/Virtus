import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Virtus Media Engine',
  description: 'A production operating view for stories, schedules, crew, and media assets.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
