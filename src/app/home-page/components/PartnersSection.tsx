"use client";

import { useEffect, useRef } from "react";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

const techPartners = [
{
  name: "Microsoft",
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_14f893309-1772610057294.png",
  alt: "Microsoft technology partner logo"
},
{
  name: "AWS",
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_19b9a8bc2-1772610059779.png",
  alt: "Amazon Web Services cloud partner logo"
},
{
  name: "Utho Cloud",
  logo: "/assets/images/Screenshot_2026-03-04_at_1.09.13_PM-1772609992162.png",
  alt: "Utho Cloud technology partner logo"
},
{
  name: "ZOHO",
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_17f9be9e2-1772610056625.png",
  alt: "Zoho business software partner logo"
},
{
  name: "Oracle",
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_138fbec9a-1772610058791.png",
  alt: "Oracle enterprise technology partner logo"
},
{
  name: "Atlassian",
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_160e8b1bd-1772610057362.png",
  alt: "Atlassian collaboration tools partner logo"
}];


const partnerBenefits = [
{ icon: "BookOpenIcon", text: "Access to exclusive resources and training" },
{ icon: "MegaphoneIcon", text: "Co-marketing opportunities" },
{ icon: "UserCircleIcon", text: "Dedicated partner support" },
{ icon: "CurrencyRupeeIcon", text: "Revenue sharing programs" }];


export default function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".partner-animate").forEach((el, i) => {
              (el as HTMLElement).style.animationDelay = `${i * 0.1}s`;
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
      id="partners"
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-28 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}>
      
      <div
        className="orb orb-violet absolute"
        style={{ width: "400px", height: "400px", left: "50%", top: "0", transform: "translateX(-50%)", opacity: 0.25 }} />
      

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-20 partner-animate" style={{ opacity: 0 }}>
          <div className="section-label mx-auto w-fit">Our Partners</div>
          <h2
            className="section-title mt-4 mb-5 text-2xl sm:text-3xl lg:text-4xl">
            
            Trusted Technology{" "}
            <span className="gradient-text-cyan">Partnerships</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}>
            
            We collaborate with industry-leading technology partners to deliver world-class solutions backed by enterprise-grade platforms.
          </p>
        </div>

        {/* Partner logos */}
        <div
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-5 lg:gap-7 mb-12 sm:mb-16 lg:mb-20 partner-animate"
          style={{ opacity: 0 }}>
          
          {techPartners.map((partner) =>
          <div
            key={partner.name}
            className="flex items-center justify-center px-5 sm:px-7 lg:px-9 py-4 sm:py-5 rounded-2xl transition-all duration-300 group cursor-pointer"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              minWidth: "130px",
              height: "72px"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-glow)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--glow-cyan)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-subtle)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}>
            
              <AppImage
              src={partner.logo}
              alt={partner.alt}
              width={110}
              height={36}
              className="object-contain partner-logo"
              style={{ maxHeight: "32px", maxWidth: "110px" }} />
            
            </div>
          )}
        </div>

        {/* Become a Partner section */}
        <div
          className="rounded-3xl overflow-hidden partner-animate"
          style={{
            opacity: 0,
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)"
          }}>
          
          <div className="grid md:grid-cols-2">
            {/* Left: Content */}
            <div className="p-6 sm:p-8 lg:p-14 flex flex-col justify-center">
              <div className="section-label w-fit mb-4">Partnership Program</div>
              <h3
                className="section-title mb-5"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                
                Become a{" "}
                <span className="gradient-text-cyan">Strategic Partner</span>
              </h3>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                Join our network of technology partners and collaborate with us to deliver innovative solutions to clients worldwide. Together, we can create greater impact.
              </p>
              <div className="space-y-4 mb-8">
                {partnerBenefits.map((benefit) =>
                <div key={benefit.text} className="flex items-center gap-3">
                    <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(0,212,255,0.1)" }}>
                    
                      <Icon
                      name={benefit.icon as any}
                      size={16}
                      style={{ color: "var(--accent-cyan)" } as React.CSSProperties} />
                    
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {benefit.text}
                    </span>
                  </div>
                )}
              </div>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-primary w-fit">
                
                <span>Apply to Partner</span>
                <Icon name="ArrowRightIcon" size={16} />
              </a>
            </div>

            {/* Right: Image */}
            <div className="relative overflow-hidden" style={{ minHeight: "380px" }}>
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1a6c1356e-1772610058152.png"
                alt="Business partnership handshake representing strategic technology collaboration"
                fill
                className="object-cover"
                style={{ filter: "brightness(0.6) saturate(0.9)" }} />
              
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, var(--bg-card) 0%, transparent 40%)"
                }} />
              
              {/* Floating stat */}
              <div
                className="absolute bottom-8 right-8 glass-card rounded-2xl p-5 text-center"
                style={{ background: "rgba(8,12,24,0.85)" }}>
                
                <div
                  className="font-jakarta font-800 text-3xl mb-1"
                  style={{ fontWeight: 800, color: "var(--accent-cyan)" }}>
                  
                  6+
                </div>
                <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Technology Partners
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}