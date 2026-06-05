"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ActionableFlow() {
  const router = useRouter();

  function goToSection(id: string) {
    // If the section exists on the current page, scroll to it.
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    // Otherwise, navigate to the site home (or landing) with the hash.
    router.push(`/home-page#${id}`);
  }

  return (
    <div style={{ marginTop: 18, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 18px 45px rgba(0,0,0,0.24)', overflow: 'auto' }}>
      <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Task Lifecycle</h3>
      <p style={{ color: '#9fb0c7', marginTop: 6, marginBottom: 12 }}>Click any node to view the related section or start the workflow.</p>

      <svg width="100%" height="110" viewBox="0 0 900 110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="12" floodOpacity="0.06"/></filter>
        </defs>

        {/* Nodes */}
        <g style={{ cursor: 'pointer' }} onClick={() => goToSection('projects')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#172554" stroke="#67e8f9" opacity="0.95" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 800, fill: '#e0f2fe' }}>Project</text>
        </g>

        <g transform="translate(190,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('tasks')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#064e3b" stroke="#a3e635" opacity="0.95" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 800, fill: '#ecfccb' }}>Create Task</text>
        </g>

        <g transform="translate(370,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('kanban')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#713f12" stroke="#facc15" opacity="0.95" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 800, fill: '#fef9c3' }}>In Progress</text>
        </g>

        <g transform="translate(550,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('focus')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#4c1d95" stroke="#c4b5fd" opacity="0.95" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 800, fill: '#ede9fe' }}>Review</text>
        </g>

        <g transform="translate(730,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('dashboard')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#881337" stroke="#fb7185" opacity="0.95" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 800, fill: '#ffe4e6' }}>Done</text>
        </g>

        {/* Arrows */}
        <g stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" opacity="0.75">
          <path d="M170 50 L190 50" />
          <path d="M350 50 L370 50" />
          <path d="M530 50 L550 50" />
          <path d="M710 50 L730 50" />
        </g>
      </svg>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => goToSection('tasks')} style={{ padding: '9px 13px', borderRadius: 10, background: 'linear-gradient(135deg,#67e8f9,#a3e635)', color: '#06111c', fontWeight: 800, border: 'none' }}>Start Create Task</button>
        <button onClick={() => goToSection('kanban')} style={{ padding: '9px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}>Open Kanban</button>
      </div>
    </div>
  );
}
