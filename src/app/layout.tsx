import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Next.js with Tailwind CSS',
  description: 'A boilerplate project with Next.js and Tailwind CSS',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

// Ensure no debug overlays or third-party components are rendering the 'N' button
// If the issue persists, inspect the DOM to identify the source of the button

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const body = document.querySelector('body');
                if (body) {
                  body.removeAttribute('data-new-gr-c-s-check-loaded');
                  body.removeAttribute('data-gr-ext-installed');
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Ensure no debug overlays or third-party components are rendering the 'N' button */}
        {children}
      </body>
    </html>
  );
}
