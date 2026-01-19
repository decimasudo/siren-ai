import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Siren - Voice Companion',
  description: 'Your gentle AI voice companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
