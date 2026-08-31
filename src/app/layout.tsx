import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '../lib/authContext';

export const metadata: Metadata = {
  title: 'Enterprise CRM | Lead & Sales Management',
  description: 'Production-ready Lead & Sales CRM system for Telecallers, Executives, Managers and Admins.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
