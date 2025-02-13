
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuickStart from "@/components/QuickStart";
import Features from "@/components/Features";
import Analytics from "@/components/sections/Analytics";
import Base from "@/components/sections/Base";
import Commerce from "@/components/sections/Commerce";
import Network from "@/components/sections/Network";
import Code from "@/components/sections/Code";
import Dev from "@/components/sections/Dev";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  useEffect(() => {
    // Smooth scroll behavior
    const smoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", smoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener("click", smoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Hero />
        <QuickStart />
        <Features />
        <Analytics />
        <Base />
        <Commerce />
        <Network />
        <Code />
        <Dev />
        <Products />
        <Testimonials />
      </main>
    </div>
  );
};

export default Index;
