
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
          <div className="flex items-center">
            <a href="/" className="font-display text-2xl text-white">
              hanzo.ai
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#tools"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Tools
            </a>
            <a
              href="#demo"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Demo
            </a>
            <Button variant="secondary" className="text-white bg-white/10 hover:bg-white/20">
              Get Started
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#tools"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Tools
            </a>
            <a
              href="#demo"
              className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Demo
            </a>
            <div className="px-3 py-2">
              <Button variant="secondary" className="w-full text-white bg-white/10 hover:bg-white/20">
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
