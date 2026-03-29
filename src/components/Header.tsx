"use client";

import { useState, useEffect } from "react";

import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["home", "about", "services", "achievements", "testimonials", "partners", "founders", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Achievements", href: "#achievements" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Partners", href: "#partners" },
  { label: "Founders", href: "#founders" },
  { label: "Contact Us", href: "#contact" }];


  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ?
          "rgba(8, 12, 24, 0.92)" :
          "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ?
          "1px solid rgba(255,255,255,0.07)" :
          "1px solid transparent"
        }}>
        
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-3 group"
            aria-label="Quantum Vertex Solutions - Go to home">
            
            <div
              className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
              style={{
                border: "2px solid rgba(0, 229, 255, 0.7)",
                boxShadow: "0 0 10px rgba(0, 229, 255, 0.35), 0 0 20px rgba(0, 229, 255, 0.15)",
                background: "#ffffff"
              }}>
              
              <AppImage
                src="/assets/images/QVS-1772610519791.jpeg"
                alt="Quantum Vertex Solutions logo"
                width={80}
                height={80}
                className="w-full h-full object-contain" />
              
            </div>
            <span
              className="font-jakarta font-800 text-[15px] tracking-tight"
              style={{ color: "var(--text-primary)", fontWeight: 800 }}>
              
              Quantum<span style={{ color: "var(--accent-cyan)" }}>Vertex</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 ml-12">
            {navItems.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="nav-link relative"
                  style={{
                    color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                    fontWeight: isActive ? 600 : 500,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontFamily: "DM Sans, sans-serif",
                    padding: "8px 16px"
                  }}>
                  
                  {item.label}
                  {isActive &&
                  <span
                    className="absolute bottom-[-4px] left-4 right-4 h-[2px] rounded-full"
                    style={{ background: "var(--accent-cyan)" }} />

                  }
                </button>);

            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick("#contact")}
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: "1rem" }}>
              
              <span>Get Started</span>
              <Icon name="ArrowRightIcon" size={18} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu">
            
            <Icon
              name={mobileOpen ? "XMarkIcon" : "Bars3Icon"}
              size={24}
              className="text-white" />
            
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen &&
      <div
        className="fixed inset-0 z-40 md:hidden flex flex-col"
        style={{ background: "rgba(8,12,24,0.98)", backdropFilter: "blur(20px)" }}>
        
          <div className="h-20" />
          <nav className="flex flex-col items-center justify-center flex-1 gap-8 px-6">
            {navItems.map((item, i) =>
          <button
            key={item.label}
            onClick={() => handleNavClick(item.href)}
            className="text-2xl font-jakarta font-700 transition-colors duration-200"
            style={{
              color: "var(--text-primary)",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              animationDelay: `${i * 0.08}s`
            }}>
            
                {item.label}
              </button>
          )}
            <button
            onClick={() => handleNavClick("#contact")}
            className="btn-primary mt-4">
            
              <span>Get Started</span>
              <Icon name="ArrowRightIcon" size={16} />
            </button>
          </nav>
        </div>
      }
    </>);

}