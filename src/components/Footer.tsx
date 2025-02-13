
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    title: "DX Platform",
    items: ["AI", "Base", "Commerce"]
  },
  {
    title: "Managed Infrastructure",
    items: ["Analytics", "Marketing", "Payments"]
  },
  {
    title: "OpenSource",
    items: ["Hanzo.js", "Engine", "Shop.js"]
  }
];

const solutions = [
  {
    title: "Apps",
    items: ["AI Chat", "Blockchain Apps", "ECommerce Apps"]
  },
  {
    title: "Industries",
    items: ["Crowdfunding", "Platform"]
  }
];

const resources = [
  "Documentation",
  "API Reference",
  "Guides",
  "Examples"
];

const company = [
  "About",
  "Blog",
  "Careers",
  "Contact"
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and Status */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/28d53ec4-328f-4812-862b-b9a760bbabae.png" 
                alt="Hanzo" 
                className="h-8 w-8"
              />
              <span className="text-white font-bold text-xl">Hanzo</span>
            </div>
            <a href="/status" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-4">
              <Check className="h-4 w-4 text-green-500" />
              <span>All systems operational</span>
            </a>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-3">Products</h3>
            <ul className="space-y-2">
              {products.map(category => (
                <li key={category.title}>
                  <span className="text-gray-400 font-medium">{category.title}</span>
                  <ul className="mt-1 space-y-1">
                    {category.items.map(item => (
                      <li key={item}>
                        <a href="#" className="text-gray-500 hover:text-white text-sm">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-white font-semibold mb-3">Solutions</h3>
            <ul className="space-y-2">
              {solutions.map(category => (
                <li key={category.title}>
                  <span className="text-gray-400 font-medium">{category.title}</span>
                  <ul className="mt-1 space-y-1">
                    {category.items.map(item => (
                      <li key={item}>
                        <a href="#" className="text-gray-500 hover:text-white text-sm">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {resources.map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-white text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {company.map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-white text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © 2016-2025 Hanzo AI Inc. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-500 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="/security" className="text-gray-500 hover:text-white text-sm">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
