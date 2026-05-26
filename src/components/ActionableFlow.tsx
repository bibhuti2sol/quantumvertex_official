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
    <div style={{ marginTop: 18, padding: 14, borderRadius: 8, background: 'linear-gradient(180deg, #ffffff, #fbfdff)', boxShadow: '0 6px 20px rgba(16,24,40,0.04)' }}>
      <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Task Lifecycle (actionable)</h3>
      <p style={{ color: 'var(--muted)', marginTop: 6, marginBottom: 12 }}>Click any node to view the related section or start the workflow.</p>

      <svg width="100%" height="110" viewBox="0 0 900 110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="12" floodOpacity="0.06"/></filter>
        </defs>

        {/* Nodes */}
        <g style={{ cursor: 'pointer' }} onClick={() => goToSection('projects')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#eef2ff" stroke="#c7ddff" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 700, fill: '#1e3a8a' }}>Project</text>
        </g>

        <g transform="translate(190,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('tasks')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#ecfeff" stroke="#bff3f0" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 700, fill: '#064e3b' }}>Create Task</text>
        </g>

        <g transform="translate(370,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('kanban')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#fff7ed" stroke="#ffedd5" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 700, fill: '#92400e' }}>In Progress</text>
        </g>

        <g transform="translate(550,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('focus')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#f0fdf4" stroke="#dcfce7" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 700, fill: '#065f46' }}>Review</text>
        </g>

        <g transform="translate(730,0)" style={{ cursor: 'pointer' }} onClick={() => goToSection('dashboard')}>
          <rect x="10" y="20" rx="10" ry="10" width="160" height="60" fill="#fff1f2" stroke="#ffe4e6" />
          <text x="90" y="58" textAnchor="middle" style={{ fontWeight: 700, fill: '#7f1d1d' }}>Done</text>
        </g>

        {/* Arrows */}
        <g stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <path d="M170 50 L190 50" />
          <path d="M350 50 L370 50" />
          <path d="M530 50 L550 50" />
          <path d="M710 50 L730 50" />
        </g>
      </svg>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => goToSection('tasks')} style={{ padding: '8px 12px', borderRadius: 8, background: 'linear-gradient(90deg,#06b6d4,#06b6d4)', color: '#fff', border: 'none' }}>Start Create Task</button>
        <button onClick={() => goToSection('kanban')} style={{ padding: '8px 12px', borderRadius: 8, background: '#f3f4f6', border: '1px solid #e6e9ee' }}>Open Kanban</button>
      </div>
    </div>
  );
}
