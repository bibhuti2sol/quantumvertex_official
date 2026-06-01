"use client";

import React from "react";

export default function ProductLogo({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      aria-label="NextGenTask"
    >
      <img
        src="/assets/images/nextgen-logo.png"
        alt="NextGenTask Logo"
        style={{ width: "auto", height: "100%", maxHeight: "60px", objectFit: "contain" }}
        onError={(e) => {
          // Fallback if image isn't named nextgen-logo.png yet
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const fallback = document.createElement('span');
          fallback.textContent = 'NextGenTask';
          fallback.style.cssText = "color: #2f8fe9; font-weight: 700; font-size: 2rem; line-height: 1; letter-spacing: -0.02em; font-family: 'DM Sans', sans-serif;";
          e.currentTarget.parentElement?.insertBefore(fallback, e.currentTarget);
        }}
      />
      <span
        style={{
          color: '#1f9a4a',
          fontWeight: 700,
          fontSize: '0.9rem',
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
