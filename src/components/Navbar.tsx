
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md border-b border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/28d53ec4-328f-4812-862b-b9a760bbabae.png" 
              alt="Hanzo AI" 
              className="h-8 w-8"
            />
            <span className="text-white font-bold text-xl">Hanzo</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <a href="#products" className="text-gray-300 hover:text-white transition-colors">
                Products
              </a>
              <div className="absolute hidden group-hover:block w-48 bg-black/90 backdrop-blur-md border border-gray-800 rounded-lg mt-2 p-2">
                <a href="#hanzo-base" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Hanzo Base</a>
                <a href="#hanzo-ai" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Hanzo AI</a>
                <a href="#hanzo-commerce" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Commerce</a>
                <a href="#hanzo-payments" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Payments</a>
              </div>
            </div>
            <div className="relative group">
              <a href="#solutions" className="text-gray-300 hover:text-white transition-colors">
                Solutions
              </a>
              <div className="absolute hidden group-hover:block w-48 bg-black/90 backdrop-blur-md border border-gray-800 rounded-lg mt-2 p-2">
                <a href="#enterprise" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Enterprise</a>
                <a href="#startups" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Startups</a>
                <a href="#agencies" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">Agencies</a>
              </div>
            </div>
            <a href="#case-studies" className="text-gray-300 hover:text-white transition-colors">
              Case Studies
            </a>
            <a href="https://network.hanzo.ai" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              Hanzo Network
            </a>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Get Started
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md border-b border-gray-800">
            <a
              href="#products"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Products
            </a>
            <a
              href="#solutions"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Solutions
            </a>
            <a
              href="#case-studies"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Case Studies
            </a>
            <a
              href="https://network.hanzo.ai"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Hanzo Network
            </a>
            <div className="px-3 py-2">
              <Button className="w-full bg-white text-black hover:bg-gray-100">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
