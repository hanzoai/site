import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Brain, Database, ShoppingCart, Code, Settings, Globe, Book, MessageSquare, HelpCircle, Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
              alt="Hanzo" 
              className="h-8 w-8"
            />
            <span className="text-white font-bold text-xl">Hanzo</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-gray-300 hover:text-white transition-colors inline-flex items-center">
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[720px] p-6 bg-black/95 backdrop-blur-xl border-gray-800">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">DX Platform</h3>
                    <div className="space-y-4">
                      <a href="#" className="flex items-start space-x-3 group">
                        <Brain className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">AI</div>
                          <div className="text-sm text-gray-500">Powering breakthroughs</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <Database className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Base</div>
                          <div className="text-sm text-gray-500">Modern backend platform</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Commerce</div>
                          <div className="text-sm text-gray-500">Enhancing online profitability</div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Managed Infrastructure</h3>
                    <div className="space-y-4">
                      <a href="#" className="flex items-start space-x-3 group">
                        <Globe className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Analytics</div>
                          <div className="text-sm text-gray-500">Powering breakthroughs</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <Settings className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Marketing</div>
                          <div className="text-sm text-gray-500">Branding & market penetration</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <Code className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Payments</div>
                          <div className="text-sm text-gray-500">Seamless transactions</div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">OpenSource</h3>
                    <div className="space-y-4">
                      <a href="#" className="flex items-start space-x-3 group">
                        <Code className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Hanzo.js</div>
                          <div className="text-sm text-gray-500">Powering breakthroughs</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <Globe className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Engine</div>
                          <div className="text-sm text-gray-500">Decentralized application</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Shop.js</div>
                          <div className="text-sm text-gray-500">Powerful UI components</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="text-gray-300 hover:text-white transition-colors inline-flex items-center">
                  Solutions
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[480px] p-6 bg-black/95 backdrop-blur-xl border-gray-800">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Apps</h3>
                    <div className="space-y-4">
                      <a href="#" className="flex items-start space-x-3 group">
                        <Brain className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">AI Chat</div>
                          <div className="text-sm text-gray-500">Virtual assistance</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <Database className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Blockchain Apps</div>
                          <div className="text-sm text-gray-500">Decentralized application</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">ECommerce Apps</div>
                          <div className="text-sm text-gray-500">Seamless online shopping</div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Industries</h3>
                    <div className="space-y-4">
                      <a href="#" className="flex items-start space-x-3 group">
                        <Globe className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Crowdfunding</div>
                          <div className="text-sm text-gray-500">Public sale bootstrap</div>
                        </div>
                      </a>
                      <a href="#" className="flex items-start space-x-3 group">
                        <Settings className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Platform</div>
                          <div className="text-sm text-gray-500">Backend management</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="text-gray-300 hover:text-white transition-colors inline-flex items-center">
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[480px] p-6 bg-black/95 backdrop-blur-xl border-gray-800">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Community</h3>
                    <div className="space-y-4">
                      <a href="https://hanzo.forum" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 group">
                        <MessageSquare className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Hanzo Forum</div>
                          <div className="text-sm text-gray-500">Discuss with the community</div>
                        </div>
                      </a>
                      <a href="https://hanzo.community" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 group">
                        <Users className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Hanzo Community</div>
                          <div className="text-sm text-gray-500">Join our community</div>
                        </div>
                      </a>
                      <a href="https://hanzo.help" target="_blank" rel="noopener noreferrer" className="flex items-start space-x-3 group">
                        <HelpCircle className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Hanzo Help</div>
                          <div className="text-sm text-gray-500">Get support</div>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Documentation</h3>
                    <div className="space-y-4">
                      <a href="/docs" className="flex items-start space-x-3 group">
                        <Book className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Documentation</div>
                          <div className="text-sm text-gray-500">Guides and references</div>
                        </div>
                      </a>
                      <a href="/api" className="flex items-start space-x-3 group">
                        <Code className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">API Reference</div>
                          <div className="text-sm text-gray-500">API documentation</div>
                        </div>
                      </a>
                      <a href="/examples" className="flex items-start space-x-3 group">
                        <Globe className="h-6 w-6 text-gray-400 group-hover:text-white mt-1" />
                        <div>
                          <div className="text-gray-300 group-hover:text-white font-medium">Examples</div>
                          <div className="text-sm text-gray-500">Sample projects</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <a href="/docs" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </a>
            <a href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Login
              </Button>
              <Button className="bg-white text-black hover:bg-gray-100">
                Signup
              </Button>
            </div>
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
              href="#resources"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Resources
            </a>
            <a
              href="/docs"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Docs
            </a>
            <a
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Pricing
            </a>
            <div className="px-3 py-2 space-y-2">
              <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                Login
              </Button>
              <Button className="w-full bg-white text-black hover:bg-gray-100">
                Signup
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
