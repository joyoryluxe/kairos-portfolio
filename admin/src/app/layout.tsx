import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kairos Admin Panel',
  description: 'Content Management System for Kairos Studio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
