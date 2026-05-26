"use client";

import React from "react";

export default function ProductLogo({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
      aria-label="NextGenTask"
    >
      <span
        style={{
          color: '#2f8fe9',
          fontWeight: 700,
          fontSize: '2rem',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          fontFamily: "'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        }}
      >
        NextGenTask
      </span>

      <span
        style={{
          color: '#1f9a4a',
          fontWeight: 700,
          fontSize: '0.9rem',
          marginTop: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          fontFamily: "'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        }}
      >
        BE ORGANIZED
      </span>
    </div>
  );
}
