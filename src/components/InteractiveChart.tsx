"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function InteractiveChart() {
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();

  const segments = [
    { key: 'complete', label: 'Complete', color: '#10b981', value: 45 },
    { key: 'inprogress', label: 'In Progress', color: '#60a5fa', value: 30 },
    { key: 'overdue', label: 'Overdue', color: '#fb7185', value: 25 },
  ];

  function goToAnalytics() {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('analytics');
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    router.push('/home-page#analytics');
  }

  const total = segments.reduce((s, x) => s + x.value, 0);

  let angle = 0;
  const slices = segments.map((seg) => {
    const start = angle;
    const portion = (seg.value / total) * 360;
    angle += portion;
    const large = portion > 180 ? 1 : 0;
    const x1 = 100 + 90 * Math.cos((Math.PI * start) / 180);
    const y1 = 100 + 90 * Math.sin((Math.PI * start) / 180);
    const x2 = 100 + 90 * Math.cos((Math.PI * (start + portion)) / 180);
    const y2 = 100 + 90 * Math.sin((Math.PI * (start + portion)) / 180);
    const path = `M100 100 L ${x1} ${y1} A 90 90 0 ${large} 1 ${x2} ${y2} Z`;
    return { seg, path };
  });

  return (
    <div style={{ marginTop: 12, display: 'flex', gap: 18, alignItems: 'center', padding: 12, background: '#fff', borderRadius: 10, boxShadow: '0 6px 20px rgba(16,24,40,0.04)' }}>
      <svg width={200} height={200} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="#f8fafc" />
        {slices.map((s, i) => (
          <path key={s.seg.key} d={s.path} fill={s.seg.color} opacity={active && active !== s.seg.key ? 0.45 : 1} style={{ transition: 'opacity 200ms' }} onClick={() => setActive(s.seg.key)} />
        ))}
        <circle cx="100" cy="100" r="36" fill="#ffffff" />
        <text x="100" y="105" textAnchor="middle" style={{ fontWeight: 700 }}>{active ? segments.find(s => s.key === active)?.label : 'Tasks'}</text>
      </svg>

      <div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          {segments.map(s => (
            <button key={s.key} onClick={() => setActive(active === s.key ? null : s.key)} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 8px', borderRadius: 8, background: active === s.key ? '#f1f5f9' : 'transparent', border: 'none', cursor: 'pointer' }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: s.color, display: 'inline-block' }} />
              <span style={{ fontWeight: 600 }}>{s.label}</span>
              <span style={{ color: '#6b7280', marginLeft: 6 }}>{s.value}%</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setActive(null)} style={{ padding: '8px 12px', borderRadius: 8, background: '#f3f4f6', border: '1px solid #e6e9ee' }}>Reset</button>
          <button onClick={goToAnalytics} style={{ padding: '8px 12px', borderRadius: 8, background: 'linear-gradient(90deg,#06b6d4,#06b6d4)', color: '#fff', border: 'none' }}>Open Analytics</button>
        </div>

        {active && (
          <div style={{ marginTop: 10, padding: 10, background: '#f8fafc', borderRadius: 8 }}>
            <strong>{segments.find(s => s.key === active)?.label}</strong>
            <p style={{ margin: 0, color: '#6b7280' }}>This segment represents {segments.find(s => s.key === active)?.value}% of tasks. Click "Open Analytics" for deeper insights.</p>
          </div>
        )}
      </div>
    </div>
  );
}
