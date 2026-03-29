"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/AppIcon";

const founders = [
  {
    name: "Bibhuti Bhusan",
    role: "Co-Founder & CTO",
    initials: "BB",
    gradient: "linear-gradient(135deg, #00D4FF, #7C3AED)",
    bio: "Visionary technologist driving product innovation and engineering excellence at Quantum Vertex Solutions.",
    expertise: ["System Architecture", "Cloud Infrastructure", "R&D Strategy"],
    icon: "CpuChipIcon",
    iconColor: "var(--accent-cyan)",
  },
  {
    name: "Vikash Gupta",
    role: "Co-Founder, Engineering Head & CFO",
    initials: "VG",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    bio: "Bridging technical excellence with financial acumen to build a sustainable, high-growth IT company.",
    expertise: ["Engineering Leadership", "Financial Strategy", "Team Scaling"],
    icon: "BriefcaseIcon",
    iconColor: "var(--accent-amber)",
  },
  {
    name: "Shailesh Jha",
    role: "Co-Founder & Delivery Head",
    initials: "SJ",
    gradient: "linear-gradient(135deg, #a78bfa, #34d399)",
    bio: "Ensuring every project is delivered on time, on budget, and beyond client expectations.",
    expertise: ["Project Delivery", "Client Relations", "Quality Assurance"],
    icon: "RocketLaunchIcon",
    iconColor: "#a78bfa",
  },
];

export default function FoundersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".founder-animate").forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.15}s`;
              el.classList.add("animate-fade-up");
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="founders"
      className="relative py-12 sm:py-16 lg:py-28 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div
        className="orb orb-cyan absolute"
        style={{ width: "300px", height: "300px", right: "10%", top: "10%", opacity: 0.2 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20 founder-animate" style={{ opacity: 0 }}>
          <div className="section-label mx-auto w-fit">Leadership</div>
          <h2
            className="section-title mt-4 mb-5 text-2xl sm:text-3xl lg:text-4xl"
          >
            Meet Our{" "}
            <span className="gradient-text">Founders</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            The visionaries behind Quantum Vertex Solutions, united by a passion for technology and a commitment to client success.
          </p>
        </div>

        {/* Founders grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="founder-card founder-animate"
              style={{ opacity: 0 }}
            >
              {/* Avatar */}
              <div
                className="founder-avatar"
                style={{ background: founder.gradient }}
              >
                {founder.initials}
              </div>

              {/* Info */}
              <h3
                className="font-jakarta font-700 text-lg text-white mb-1"
                style={{ fontWeight: 700 }}
              >
                {founder.name}
              </h3>
              <div
                className="text-xs font-500 mb-4 px-3 py-1 rounded-full w-fit"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  color: "var(--accent-cyan)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  fontWeight: 500,
                }}
              >
                {founder.role}
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                {founder.bio}
              </p>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-2">
                {founder.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Bottom icon */}
              <div
                className="mt-5 pt-5 flex items-center gap-2"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <Icon
                  name={founder.icon as any}
                  size={16}
                  style={{ color: founder.iconColor } as React.CSSProperties}
                />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Quantum Vertex Solutions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}