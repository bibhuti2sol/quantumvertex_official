"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/AppIcon";

const contactInfo = [
  {
    icon: "MapPinIcon",
    label: "Address",
    value: "#655, 7th main, 11th cross, Opposite To Central Library, BTM 2nd Stage, Bengaluru 560076",
    href: "https://maps.google.com/?q=BTM+2nd+Stage+Bengaluru+560076",
    color: "var(--accent-cyan)",
  },
  {
    icon: "PhoneIcon",
    label: "Phone",
    value: "+91 79996 59884",
    href: "tel:+917999659884",
    color: "var(--accent-amber)",
  },
  {
    icon: "EnvelopeIcon",
    label: "Email",
    value: "support@qvs.co.in",
    href: "mailto:support@qvs.co.in",
    color: "#a78bfa",
  },
];

const businessHours = [
  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".contact-animate").forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.12}s`;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock submit handler — connect backend here
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-28 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className="orb orb-cyan absolute"
        style={{ width: "500px", height: "500px", left: "-100px", bottom: "-100px", opacity: 0.25 }}
      />
      <div
        className="orb orb-violet absolute"
        style={{ width: "400px", height: "400px", right: "-80px", top: "10%", opacity: 0.2 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16 contact-animate" style={{ opacity: 0 }}>
          <div className="section-label mx-auto w-fit">Contact</div>
          <h2
            className="section-title mt-4 mb-5 text-2xl sm:text-3xl lg:text-4xl"
          >
            Let's Build Something{" "}
            <span className="gradient-text-cyan">Together</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Have a project in mind? Let's discuss how we can help transform your business with the right technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-7 contact-animate" style={{ opacity: 0 }}>
            <div
              className="rounded-3xl p-8 lg:p-10"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h3
                className="font-jakarta font-700 text-xl text-white mb-6"
                style={{ fontWeight: 700 }}
              >
                Send Us a Message
              </h3>

              {submitted ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center gap-4"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(34,197,94,0.15)" }}
                  >
                    <Icon name="CheckBadgeIcon" size={32} style={{ color: "#22c55e" } as React.CSSProperties} />
                  </div>
                  <h4
                    className="font-jakarta font-700 text-xl text-white"
                    style={{ fontWeight: 700 }}
                  >
                    Message Sent!
                  </h4>
                  <p style={{ color: "var(--text-secondary)" }}>
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="btn-secondary mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="block text-xs font-600 mb-2 uppercase tracking-wide"
                        style={{ color: "var(--text-muted)", fontWeight: 600 }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Arjun Sharma"
                        className="input-field"
                        required
                        aria-label="Full name"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-600 mb-2 uppercase tracking-wide"
                        style={{ color: "var(--text-muted)", fontWeight: 600 }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="arjun@company.com"
                        className="input-field"
                        required
                        aria-label="Email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-600 mb-2 uppercase tracking-wide"
                      style={{ color: "var(--text-muted)", fontWeight: 600 }}
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project inquiry / Partnership / General"
                      className="input-field"
                      required
                      aria-label="Message subject"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-600 mb-2 uppercase tracking-wide"
                      style={{ color: "var(--text-muted)", fontWeight: 600 }}
                    >
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, goals, and timeline..."
                      className="input-field"
                      style={{ minHeight: "140px" }}
                      required
                      aria-label="Your message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center"
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="w-4 h-4 border-2 border-t-transparent rounded-full"
                          style={{
                            borderColor: "rgba(8,12,24,0.4)",
                            borderTopColor: "transparent",
                            animation: "spinSlow 0.8s linear infinite",
                          }}
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Icon name="PaperAirplaneIcon" size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Contact info */}
          <div className="lg:col-span-5 flex flex-col gap-6 contact-animate" style={{ opacity: 0 }}>
            {/* Contact details */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h3
                className="font-jakarta font-700 text-lg text-white mb-6"
                style={{ fontWeight: 700 }}
              >
                Contact Information
              </h3>
              <div className="space-y-5">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex gap-4 group"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        background: `${info.color}15`,
                        border: `1px solid ${info.color}25`,
                      }}
                    >
                      <Icon
                        name={info.icon as any}
                        size={18}
                        style={{ color: info.color } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-600 mb-1 uppercase tracking-wide" style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                        {info.label}
                      </div>
                      <div
                        className="text-sm leading-relaxed transition-colors duration-200"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.color = "white"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.color = "var(--text-secondary)"; }}
                      >
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Business hours */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Icon name="ClockIcon" size={18} style={{ color: "var(--accent-amber)" } as React.CSSProperties} />
                <h3
                  className="font-jakarta font-700 text-lg text-white"
                  style={{ fontWeight: 700 }}
                >
                  Business Hours
                </h3>
              </div>
              <div className="space-y-3">
                {businessHours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between items-center py-2"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {h.day}
                    </span>
                    <span
                      className="text-sm font-500"
                      style={{
                        color: h.hours === "Closed" ? "var(--text-muted)" : "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick CTA */}
            <div
              className="rounded-3xl p-6 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(0,212,255,0.15)" }}
              >
                <Icon name="BoltIcon" size={22} style={{ color: "var(--accent-cyan)" } as React.CSSProperties} />
              </div>
              <h4
                className="font-jakarta font-700 text-base text-white mb-2"
                style={{ fontWeight: 700 }}
              >
                Need a Quick Response?
              </h4>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                For urgent inquiries, call us directly. We typically respond within 2 hours.
              </p>
              <a
                href="tel:+917999659884"
                className="btn-primary w-full justify-center"
              >
                <span>Call Now</span>
                <Icon name="PhoneIcon" size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}