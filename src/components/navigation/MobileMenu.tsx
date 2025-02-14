
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenu = ({ isOpen, onToggle }: MobileMenuProps) => {
  return (
    <>
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-white"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
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
              href="https://docs.hanzo.ai"
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
            <a
              href="/team"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Team
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
    </>
  );
};
