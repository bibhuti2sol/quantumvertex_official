"use client";

import { useEffect, useRef } from "react";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

const stats = [
{ value: "500+", label: "Happy Clients", icon: "UserGroupIcon", color: "var(--accent-cyan)" },
{ value: "10+", label: "Awards Won", icon: "TrophyIcon", color: "var(--accent-amber)" },
{ value: "10+", label: "Projects Completed", icon: "CheckBadgeIcon", color: "#a78bfa" },
{ value: "98%", label: "Client Satisfaction", icon: "HeartIcon", color: "#34d399" }];


export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".scroll-animate").forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.12}s`;
              el.classList.add("animate-fade-up");
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-28 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      
      {/* Decorative orb */}
      <div
        className="orb orb-violet absolute"
        style={{ width: "400px", height: "400px", right: "-100px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: Image composition */}
          <div className="lg:col-span-5 relative scroll-animate" style={{ opacity: 0 }}>
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                height: "480px",
                border: "1px solid var(--border-subtle)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.4)"
              }}>
              
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_178e180e1-1772611886838.png"
                alt="Quantum Vertex Solutions team meeting and collaboration session in Bangalore office"
                fill
                className="object-cover"
                style={{ filter: "brightness(0.85)" }} />
              
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(8,12,24,0.8) 0%, transparent 60%)"
                }} />
              
              {/* Badge on image */}
              <div
                className="absolute bottom-6 left-6 right-6 glass-card rounded-2xl p-4"
                style={{ background: "rgba(8,12,24,0.85)" }}>
                
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,212,255,0.15)" }}>
                    
                    <Icon name="BuildingOffice2Icon" size={20} style={{ color: "var(--accent-cyan)" } as React.CSSProperties} />
                  </div>
                  <div>
                    <div className="font-jakarta font-700 text-sm text-white" style={{ fontWeight: 700 }}>
                      Headquartered in Bangalore
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      India's Silicon Valley
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative accent */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))",
                border: "1px solid rgba(0,212,255,0.2)",
                zIndex: -1
              }} />
            
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="scroll-animate" style={{ opacity: 0 }}>
              <div className="section-label">About Us</div>
              <h2
                className="section-title mt-3 text-2xl sm:text-3xl lg:text-4xl">
                
                About{" "}
                <span className="gradient-text-cyan">Quantum Vertex</span>{" "}
                Solutions
              </h2>
            </div>

            <div className="scroll-animate" style={{ opacity: 0 }}>
              <p className="text-base leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                Founded with a vision to revolutionize the IT industry, Quantum Vertex Solutions has grown to become a trusted partner for businesses seeking digital transformation.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Our team of expert developers, designers, and strategists work collaboratively to deliver innovative solutions that drive growth and efficiency. We specialize in custom software development, cloud infrastructure, cybersecurity, and digital consulting.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 scroll-animate" style={{ opacity: 0 }}>
              {[
              { icon: "ShieldCheckIcon", text: "Custom Software Development" },
              { icon: "CloudIcon", text: "Cloud Infrastructure" },
              { icon: "LockClosedIcon", text: "Cybersecurity Solutions" },
              { icon: "ChartBarIcon", text: "Digital Consulting" }].
              map((item) =>
              <div
                key={item.text}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
                
                  <Icon
                  name={item.icon as any}
                  size={18}
                  style={{ color: "var(--accent-cyan)", flexShrink: 0 } as React.CSSProperties} />
                
                  <span className="text-sm font-500" style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                    {item.text}
                  </span>
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 scroll-animate" style={{ opacity: 0 }}>
              {stats.map((stat) =>
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)"
                }}>
                
                  <Icon
                  name={stat.icon as any}
                  size={22}
                  style={{ color: stat.color } as React.CSSProperties} />
                
                  <span
                  className="font-jakarta font-800 text-2xl"
                  style={{ fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                  
                    {stat.value}
                  </span>
                  <span className="text-xs text-center leading-tight" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}