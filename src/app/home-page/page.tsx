import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePageInteractive from "./components/HomePageInteractive";

export const metadata: Metadata = {
  title: "Quantum Vertex Solutions — Innovating Your Digital Future",
  description:
    "Quantum Vertex Solutions is Bangalore's premier IT partner delivering custom software development, cloud computing, cybersecurity, AI/ML, and digital transformation services.",
  keywords: [
    "Quantum Vertex Solutions",
    "IT company Bangalore",
    "custom software development India",
    "cloud computing services",
    "cybersecurity Bangalore",
    "digital transformation",
    "mobile app development",
    "AI machine learning",
  ],
  authors: [{ name: "Quantum Vertex Solutions" }],
  openGraph: {
    title: "Quantum Vertex Solutions — Innovating Your Digital Future",
    description:
      "Transform your business with cutting-edge IT solutions. Expert software development, cloud computing, and digital transformation from Bangalore.",
    type: "website",
    locale: "en_IN",
  },
  icons: {
    icon: "https://www.qvs.co.in/assets/logo-NHRZjvWU.png",
  },
};

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Header />
      <main>
        <HomePageInteractive />
      </main>
      <Footer />
    </div>
  );
}