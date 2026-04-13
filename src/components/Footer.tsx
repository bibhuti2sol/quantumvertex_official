"use client";

import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

export default function Footer() {
  const currentYear = 2026;

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Partners", href: "#partners" },
  ];

  const services = [
    "Custom Software Development",
    "Cloud Computing",
    "Cybersecurity",
    "Data Analytics",
    "Mobile Development",
    "AI & Machine Learning",
  ];

  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <AppImage
                  src="/assets/images/QVS-1772610519791.jpeg"
                  alt="Quantum Vertex Solutions logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-jakarta font-800 text-[15px] tracking-tight text-white" style={{ fontWeight: 800 }}>
                Quantum<span style={{ color: "var(--accent-cyan)" }}>Vertex</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)", maxWidth: "280px" }}>
              Transforming businesses through innovative IT solutions and cutting-edge technology.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/quantum-vertex-solutions/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-secondary)",
                }}
                aria-label="Quantum Vertex Solutions on LinkedIn"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-cyan)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-cyan)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61586972631155"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-secondary)",
                }}
                aria-label="Quantum Vertex Solutions on Facebook"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-cyan)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-cyan)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-jakarta font-700 text-sm text-white mb-5" style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-cyan)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="font-jakarta font-700 text-sm text-white mb-5" style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-cyan)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-jakarta font-700 text-sm text-white mb-5" style={{ fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Icon name="MapPinIcon" size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent-cyan)" } as React.CSSProperties} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Bengaluru, Karnataka, India
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="PhoneIcon" size={16} className="flex-shrink-0" style={{ color: "var(--accent-cyan)" } as React.CSSProperties} />
                <a
                  href="tel:+917999659884"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                >
                  +91 79996 59884
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="EnvelopeIcon" size={16} className="flex-shrink-0" style={{ color: "var(--accent-cyan)" } as React.CSSProperties} />
                <a
                  href="mailto:support@qvs.co.in"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                >
                  support@qvs.co.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {currentYear} Quantum Vertex Solutions. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: "var(--text-muted)" }}>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
            >Privacy Policy</a>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
            >Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}