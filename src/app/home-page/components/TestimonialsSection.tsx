"use client";

import { useEffect, useRef, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  initials: string;
  accentColor: string;
  bgColor: string;
  quote: string;
  rating: number;
  companyInitials: string;
  companyColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Sharma",
    title: "CTO",
    company: "NovaTech Systems",
    initials: "RS",
    accentColor: "#00e5ff",
    bgColor: "rgba(0,229,255,0.15)",
    quote:
      "Quantum Vertex Solutions transformed our legacy infrastructure into a cloud-native platform in just 3 months. Their team's technical depth is unmatched — we saw a 40% reduction in operational costs immediately.",
    rating: 5,
    companyInitials: "NT",
    companyColor: "#00e5ff",
  },
  {
    id: 2,
    name: "Priya Menon",
    title: "VP of Engineering",
    company: "FinEdge Analytics",
    initials: "PM",
    accentColor: "#f59e0b",
    bgColor: "rgba(245,158,11,0.15)",
    quote:
      "The AI/ML pipeline QVS built for our fraud detection system processes 2M+ transactions daily with 99.7% accuracy. They didn't just deliver code — they delivered a competitive advantage.",
    rating: 5,
    companyInitials: "FE",
    companyColor: "#f59e0b",
  },
  {
    id: 3,
    name: "Arjun Kapoor",
    title: "Founder & CEO",
    company: "SwiftLogix",
    initials: "AK",
    accentColor: "#a78bfa",
    bgColor: "rgba(167,139,250,0.15)",
    quote:
      "From concept to deployment in 8 weeks — QVS built our entire logistics platform from scratch. The real-time tracking and route optimization alone saved our clients 25% in delivery costs.",
    rating: 5,
    companyInitials: "SL",
    companyColor: "#a78bfa",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    title: "Head of Digital",
    company: "MediCore Health",
    initials: "SI",
    accentColor: "#34d399",
    bgColor: "rgba(52,211,153,0.15)",
    quote:
      "QVS delivered a HIPAA-compliant telemedicine platform that now serves 50,000+ patients monthly. Their security-first approach and attention to compliance gave us complete confidence.",
    rating: 5,
    companyInitials: "MC",
    companyColor: "#34d399",
  },
  {
    id: 5,
    name: "Vikram Nair",
    title: "Director of Technology",
    company: "RetailPulse India",
    initials: "VN",
    accentColor: "#f472b6",
    bgColor: "rgba(244,114,182,0.15)",
    quote:
      "The e-commerce platform QVS built handles our peak sale events with zero downtime — 100K concurrent users on Day 1 of our annual sale. Their scalability engineering is world-class.",
    rating: 4,
    companyInitials: "RP",
    companyColor: "#f472b6",
  },
  {
    id: 6,
    name: "Deepak Verma",
    title: "COO",
    company: "BuildSmart Infra",
    initials: "DV",
    accentColor: "#fb923c",
    bgColor: "rgba(251,146,60,0.15)",
    quote:
      "QVS integrated IoT sensors, real-time dashboards, and predictive maintenance into our construction management system. Project delays dropped by 35% in the first quarter alone.",
    rating: 5,
    companyInitials: "BS",
    companyColor: "#fb923c",
  },
];

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? color : "rgba(255,255,255,0.15)"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.45)" }}>
        {rating}.0
      </span>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 w-[360px] md:w-[400px] rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${t.accentColor}28`,
        boxShadow: `0 0 30px ${t.accentColor}0a`,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out, background 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1.03)";
        el.style.borderColor = `${t.accentColor}70`;
        el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 30px ${t.accentColor}25, 0 0 60px ${t.accentColor}10`;
        el.style.background = `rgba(255,255,255,0.055)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1)";
        el.style.borderColor = `${t.accentColor}28`;
        el.style.boxShadow = `0 0 30px ${t.accentColor}0a`;
        el.style.background = "rgba(255,255,255,0.03)";
      }}
    >
      {/* Subtle corner accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10"
        style={{ background: `radial-gradient(circle, ${t.accentColor}, transparent)` }}
      />

      {/* Quote mark */}
      <div
        className="text-5xl font-serif leading-none select-none"
        style={{ color: t.accentColor, opacity: 0.35, lineHeight: 1, marginTop: -4 }}
      >
        &ldquo;
      </div>

      {/* Quote */}
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "rgba(255,255,255,0.72)", fontFamily: "DM Sans, sans-serif" }}
      >
        {t.quote}
      </p>

      {/* Rating */}
      <StarRating rating={t.rating} color={t.accentColor} />

      {/* Divider */}
      <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.accentColor}30, transparent)` }} />

      {/* Author row */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{
            background: t.bgColor,
            border: `1.5px solid ${t.accentColor}50`,
            color: t.accentColor,
            fontFamily: "Plus Jakarta Sans, sans-serif",
          }}
        >
          {t.initials}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "var(--text-primary)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {t.name}
          </p>
          <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
            {t.title}
          </p>
        </div>

        {/* Company badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg flex-shrink-0"
          style={{
            background: `${t.companyColor}12`,
            border: `1px solid ${t.companyColor}25`,
          }}
        >
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold"
            style={{ background: `${t.companyColor}20`, color: t.companyColor }}
          >
            {t.companyInitials}
          </div>
          <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
            {t.company}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Duplicate for seamless loop
  const doubled = [...testimonials, ...testimonials];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.5; // px per frame

    const animate = () => {
      if (!isPaused && track) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPaused]);

  return (
    <section
      id="testimonials"
      className="relative py-12 sm:py-16 lg:py-24 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 mb-10 sm:mb-12 lg:mb-14 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
          style={{
            background: "rgba(0,229,255,0.08)",
            border: "1px solid rgba(0,229,255,0.2)",
            color: "var(--accent-cyan)",
            fontFamily: "DM Sans, sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--accent-cyan)" }}
          />
          CLIENT TESTIMONIALS
        </div>

        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4"
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Trusted by{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00e5ff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Industry Leaders
          </span>
        </h2>
        <p
          className="text-base max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans, sans-serif" }}
        >
          Real results from real clients — see how we've helped businesses across industries scale,
          innovate, and outperform.
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, var(--bg-primary) 0%, transparent 100%)",
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(270deg, var(--bg-primary) 0%, transparent 100%)",
          }}
        />

        <div
          ref={trackRef}
          className="flex gap-5 py-4 px-6"
          style={{ willChange: "transform", width: "max-content" }}
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 mt-10 sm:mt-12 lg:mt-14">
        <div
          className="grid grid-cols-3 gap-4 rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {[
            { value: "50+", label: "Happy Clients", color: "#00e5ff" },
            { value: "4.9", label: "Average Rating", color: "#f59e0b" },
            { value: "100%", label: "Project Success Rate", color: "#a78bfa" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl md:text-3xl font-extrabold mb-1"
                style={{
                  color: stat.color,
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "DM Sans, sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
