"use client";

import { useEffect, useRef, useState } from "react";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

const services = [
{
  id: "software",
  title: "Custom Software Development",
  description: "Tailored software solutions built to meet your unique business requirements and drive operational efficiency.",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e99c37e6-1772358728783.png",
  alt: "Software developer writing code on multiple monitors in modern workspace",
  icon: "CodeBracketIcon",
  color: "var(--accent-cyan)",
  tags: ["React", "Node.js", "Python", "TypeScript"]
},
{
  id: "cloud",
  title: "Cloud Computing Solutions",
  description: "Scalable cloud infrastructure and migration services to modernize your IT ecosystem and reduce costs.",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb404be8-1772094040226.png",
  alt: "Cloud computing network infrastructure visualization with interconnected nodes",
  icon: "CloudIcon",
  color: "#38BDF8",
  tags: ["AWS", "Azure", "GCP", "DevOps"]
},
{
  id: "security",
  title: "Cybersecurity Services",
  description: "Comprehensive security solutions to protect your data, infrastructure, and digital assets from evolving threats.",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_17f1bcdf4-1772611888038.png",
  alt: "Digital security lock and data protection technology visualization",
  icon: "ShieldCheckIcon",
  color: "#34d399",
  tags: ["Penetration Testing", "SOC", "Compliance"]
},
{
  id: "analytics",
  title: "Data Analytics & BI",
  description: "Transform raw data into actionable insights with advanced analytics and business intelligence tools.",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1de4e2c66-1772611885980.png",
  alt: "Data analytics dashboard showing charts, graphs and business intelligence metrics",
  icon: "ChartBarIcon",
  color: "var(--accent-amber)",
  tags: ["Power BI", "Tableau", "ML Models"]
},
{
  id: "mobile",
  title: "Mobile App Development",
  description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_173cbd5eb-1772611887120.png",
  alt: "Mobile app development process showing smartphone screens and development tools",
  icon: "DevicePhoneMobileIcon",
  color: "#a78bfa",
  tags: ["Flutter", "React Native", "iOS", "Android"]
},
{
  id: "ai",
  title: "AI & Machine Learning",
  description: "Intelligent automation and predictive analytics powered by cutting-edge AI and ML technologies.",
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_15163fc1c-1772281251799.png",
  alt: "Artificial intelligence and machine learning neural network visualization",
  icon: "CpuChipIcon",
  color: "#f472b6",
  tags: ["TensorFlow", "PyTorch", "NLP", "Computer Vision"]
}];


export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".service-animate").forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.1}s`;
              el.classList.add("animate-scale-in");
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
      id="services"
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-28 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}>
      
      {/* Orbs */}
      <div
        className="orb orb-cyan absolute"
        style={{ width: "500px", height: "500px", left: "-150px", top: "20%", opacity: 0.3 }} />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20 service-animate" style={{ opacity: 0 }}>
          <div className="section-label mx-auto w-fit">Our Services</div>
          <h2
            className="section-title mt-4 mb-5 text-2xl sm:text-3xl lg:text-4xl">
            
            Comprehensive IT Solutions
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}>
            
            Designed to accelerate your digital transformation journey — from concept to deployment and beyond.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {services.map((service, index) =>
          <div
            key={service.id}
            className="service-card service-animate group"
            style={{
              opacity: 0,
              // First card spans 2 cols on large screens
              ...(index === 0 ? { gridColumn: "span 1" } : {})
            }}
            onMouseEnter={() => setHoveredId(service.id)}
            onMouseLeave={() => setHoveredId(null)}>
            
              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: "200px" }}>
                <AppImage
                src={service.image}
                alt={service.alt}
                fill
                className="service-img object-cover"
                style={{ filter: "brightness(0.7) saturate(1.1)" }} />
              
                <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, transparent 30%, var(--bg-card) 100%)`
                }} />
              
                {/* Icon badge */}
                <div
                className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(8,12,24,0.8)",
                  border: `1px solid ${service.color}40`,
                  backdropFilter: "blur(8px)"
                }}>
                
                  <Icon
                  name={service.icon as any}
                  size={18}
                  style={{ color: service.color } as React.CSSProperties} />
                
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7">
                <h3
                className="font-jakarta font-700 text-lg mb-2 text-white"
                style={{ fontWeight: 700 }}>
                
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  {service.description}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) =>
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: `${service.color}12`,
                    color: service.color,
                    border: `1px solid ${service.color}25`,
                    fontWeight: 500
                  }}>
                  
                      {tag}
                    </span>
                )}
                </div>
                {/* CTA */}
                <div
                className="flex items-center gap-2 mt-4 text-sm font-500 transition-all duration-300"
                style={{
                  color: hoveredId === service.id ? service.color : "var(--text-muted)",
                  fontWeight: 500
                }}>
                
                  Learn more
                  <Icon
                  name="ArrowRightIcon"
                  size={14}
                  style={{
                    transform: hoveredId === service.id ? "translateX(4px)" : "translateX(0)",
                    transition: "transform 0.3s ease",
                    color: "inherit"
                  } as React.CSSProperties} />
                
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}