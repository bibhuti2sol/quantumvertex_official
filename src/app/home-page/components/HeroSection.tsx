"use client";

import { useEffect, useRef } from "react";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      heroRef.current.style.setProperty("--mouse-x", `${x}px`);
      heroRef.current.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--bg-primary)", paddingTop: "72px" }}>
      
      {/* Background orbs */}
      <div
        className="orb orb-cyan absolute"
        style={{ width: "600px", height: "600px", top: "-100px", left: "-150px", opacity: 0.6 }} />
      
      <div
        className="orb orb-violet absolute"
        style={{ width: "500px", height: "500px", top: "100px", right: "-100px", opacity: 0.5 }} />
      
      <div
        className="orb orb-amber absolute"
        style={{ width: "300px", height: "300px", bottom: "0px", left: "40%", opacity: 0.4 }} />
      

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:gap-7">
            {/* Badge */}
            <div className="animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
              <div className="section-label w-fit">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }} />
                
                Bangalore's Premier IT Partner
              </div>
            </div>

            {/* Headline */}
            <div className="animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
              <h1
                className="section-title text-3xl sm:text-5xl lg:text-7xl"
                style={{ lineHeight: 1.1 }}>
                
                Innovating Your{" "}
                <span className="gradient-text">Digital Future</span>
              </h1>
            </div>

            {/* Body */}
            <div className="animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)", maxWidth: "480px" }}>
                
                Transform your business with cutting-edge IT solutions. We deliver excellence in software development, cloud computing, and digital transformation — from Bangalore to the world.
              </p>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 sm:gap-4 animate-fade-up"
              style={{ animationDelay: "0.4s", opacity: 0, animationFillMode: "forwards" }}>
              
              <button onClick={() => scrollTo("services")} className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
                <span>Our Services</span>
                <Icon name="ArrowRightIcon" size={16} />
              </button>
              <button onClick={() => scrollTo("contact")} className="btn-secondary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
                <Icon name="ChatBubbleLeftRightIcon" size={16} />
                Get Started
              </button>
            </div>

            {/* Trust indicators */}
            <div
              className="flex items-center gap-6 pt-2 animate-fade-up"
              style={{
                animationDelay: "0.5s",
                opacity: 0,
                animationFillMode: "forwards",
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "24px"
              }}>
              
              {[
              { value: "500+", label: "Clients" },
              { value: "98%", label: "Satisfaction" },
              { value: "10+", label: "Awards" }].
              map((stat) =>
              <div key={stat.label} className="flex flex-col gap-0.5">
                  <span
                  className="font-jakarta font-800 text-xl"
                  style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                  
                    {stat.value}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {stat.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Visual composition */}
          <div
            className="lg:col-span-7 relative hidden lg:block animate-fade-up"
            style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards", height: "580px" }}>
            
            {/* Main image */}
            <div
              className="absolute rounded-3xl overflow-hidden"
              style={{
                top: "20px",
                left: "60px",
                right: "0",
                bottom: "20px",
                border: "1px solid rgba(0,212,255,0.15)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,212,255,0.08)"
              }}>
              
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1fe9e3f89-1766939132002.png"
                alt="Modern technology office workspace with developers collaborating on digital solutions"
                fill
                className="object-cover"
                style={{ filter: "brightness(0.75) saturate(1.1)" }}
                priority />
              
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, rgba(8,12,24,0.6) 0%, transparent 60%, rgba(8,12,24,0.4) 100%)"
                }} />
              
            </div>

            {/* Floating card 1 — Tech stack */}
            <div
              className="glass-card float-card absolute rounded-2xl p-5"
              style={{
                top: "40px",
                left: "0",
                width: "210px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                zIndex: 10
              }}>
              
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(0,212,255,0.15)" }}>
                  
                  <Icon name="CodeBracketIcon" size={16} style={{ color: "var(--accent-cyan)" } as React.CSSProperties} />
                </div>
                <span className="text-xs font-jakarta font-600 text-white" style={{ fontWeight: 600 }}>
                  Tech Stack
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "AWS", "Python", "Flutter"].map((tech) =>
                <span
                  key={tech}
                  className="text-[10px] px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "var(--accent-cyan)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    fontWeight: 500
                  }}>
                  
                    {tech}
                  </span>
                )}
              </div>
            </div>

            {/* Floating card 2 — Project status */}
            <div
              className="glass-card float-card-2 absolute rounded-2xl p-5"
              style={{
                bottom: "80px",
                left: "0",
                width: "230px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                zIndex: 10
              }}>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-jakarta font-600 text-white" style={{ fontWeight: 600 }}>
                  Active Projects
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(34,197,94,0.15)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.3)"
                  }}>
                  
                  Live
                </span>
              </div>
              {[
              { name: "North Express App", progress: 72, color: "var(--accent-cyan)" },
              { name: "Jogamaya Motors", progress: 100, color: "#22c55e" }].
              map((proj) =>
              <div key={proj.name} className="mb-2 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                      {proj.name}
                    </span>
                    <span className="text-[10px] font-600" style={{ color: proj.color, fontWeight: 600 }}>
                      {proj.progress}%
                    </span>
                  </div>
                  <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  
                    <div
                    className="h-full rounded-full"
                    style={{ width: `${proj.progress}%`, background: proj.color }} />
                  
                  </div>
                </div>
              )}
            </div>

            {/* Floating card 3 — Rating */}
            <div
              className="glass-card float-card-3 absolute rounded-2xl p-4"
              style={{
                top: "50%",
                right: "-10px",
                transform: "translateY(-50%)",
                width: "160px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                zIndex: 10
              }}>
              
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(245,158,11,0.15)" }}>
                
                <Icon name="StarIcon" size={20} variant="solid" style={{ color: "var(--accent-amber)" } as React.CSSProperties} />
              </div>
              <div
                className="font-jakarta font-800 text-2xl mb-0.5"
                style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                
                4.9<span className="text-sm text-white/40">/5</span>
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Client Rating
              </div>
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((s) =>
                <Icon
                  key={s}
                  name="StarIcon"
                  size={10}
                  variant="solid"
                  style={{ color: s <= 4 ? "var(--accent-amber)" : "rgba(245,158,11,0.4)" } as React.CSSProperties} />

                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-up"
        style={{ animationDelay: "1s", opacity: 0, animationFillMode: "forwards" }}>
        
        <span className="text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
          Scroll
        </span>
        <div
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}>
          
          <div
            className="w-1 h-2 rounded-full"
            style={{
              background: "var(--accent-cyan)",
              animation: "floatY 2s ease-in-out infinite"
            }} />
          
        </div>
      </div>
    </section>);

}