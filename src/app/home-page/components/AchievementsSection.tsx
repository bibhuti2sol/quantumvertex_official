"use client";

import { useEffect, useRef } from "react";

import Icon from "@/components/ui/AppIcon";

const achievements = [
  {
    type: "delivered",
    badge: "Delivered",
    badgeColor: "#22c55e",
    badgeBg: "rgba(34,197,94,0.12)",
    title: "Automobile Servicing Solution",
    client: "Jogamaya Motors",
    description:
      "Successfully delivered a comprehensive automobile servicing solution that streamlines service operations and enhances customer experience — from appointment booking to real-time service tracking.",
    link: "https://jogamayamotors.great-site.net/",
    linkLabel: "Visit Jogamaya Motors",
    icon: "WrenchScrewdriverIcon",
    accentColor: "#22c55e",
    highlights: ["Service Booking", "Customer Portal", "Real-time Tracking", "Analytics Dashboard"],
  },
  {
    type: "current",
    badge: "In Progress",
    badgeColor: "var(--accent-cyan)",
    badgeBg: "rgba(0,212,255,0.12)",
    title: "Centralized Logistics Application",
    client: "North Express",
    description:
      "Currently partnering with North Express, a leading logistics company, to build their centralized application platform. This solution will revolutionize logistics operations and dramatically improve fleet efficiency.",
    link: "https://www.northexpress.in/",
    linkLabel: "Visit North Express",
    icon: "TruckIcon",
    accentColor: "var(--accent-cyan)",
    highlights: ["Fleet Management", "Route Optimization", "Live Tracking", "Driver App"],
  },
];

export default function AchievementsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".achieve-animate").forEach((el, i) => {
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
      id="achievements"
      className="relative py-12 sm:py-16 lg:py-28 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div
        className="orb orb-amber absolute"
        style={{ width: "400px", height: "400px", right: "0", bottom: "0", opacity: 0.3 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16 achieve-animate" style={{ opacity: 0 }}>
          <div className="section-label mx-auto w-fit">Our Work</div>
          <h2
            className="section-title mt-4 mb-5 text-2xl sm:text-3xl lg:text-4xl"
          >
            Real Projects,{" "}
            <span className="gradient-text-amber">Real Impact</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            From concept to delivery, we've helped businesses transform their operations with bespoke technology solutions.
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {achievements.map((item, index) => (
            <div
              key={item.title}
              className="achievement-card achieve-animate"
              style={{ opacity: 0 }}
            >
              {/* Top accent bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(to right, ${item.accentColor}, transparent)`,
                }}
              />

              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: item.badgeBg, border: `1px solid ${item.accentColor}30` }}
                    >
                      <Icon
                        name={item.icon as any}
                        size={22}
                        style={{ color: item.accentColor } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <div
                        className="text-xs font-jakarta font-700 px-3 py-1 rounded-full w-fit mb-1"
                        style={{
                          background: item.badgeBg,
                          color: item.badgeColor,
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.badge}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Client: {item.client}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-jakarta font-700 text-xl mb-3 text-white"
                  style={{ fontWeight: 700 }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  {item.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: `${item.accentColor}10`,
                        color: item.accentColor,
                        border: `1px solid ${item.accentColor}25`,
                        fontWeight: 500,
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-600 transition-all duration-200 group"
                  style={{
                    color: item.accentColor,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {item.linkLabel}
                  <Icon
                    name="ArrowTopRightOnSquareIcon"
                    size={14}
                    style={{
                      color: "inherit",
                      transition: "transform 0.2s ease",
                    } as React.CSSProperties}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}