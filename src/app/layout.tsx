import React from 'react';
import { UserProvider } from '@/components/common/UserContext';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'NextGen TaskManager',
  description: 'Manage your tasks with next-generation tools and efficiency.',
};

import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <UserProvider>
          <ProtectedRoute>{children}</ProtectedRoute>
        </UserProvider>
      </body>
    </html>
  );
}
