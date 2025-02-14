
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { solutions } from "@/constants/navigation";
import { Globe2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Solutions = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Solutions for Every Industry
            </h1>
            <p className="text-gray-400 text-lg">
              Explore our comprehensive suite of solutions designed to transform businesses 
              across industries and capabilities.
            </p>
          </div>

          {solutions.map((section) => (
            <div key={section.title} className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ y: -5 }}
                    className="relative group rounded-xl border border-gray-800 bg-black/50 p-6 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <Globe2 className="h-6 w-6 text-purple-400" />
                        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                        {item}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Explore our solutions for {item.toLowerCase()} and discover how we can 
                        help transform your business.
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-20 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
              <p className="text-gray-400 mb-8">
                Connect with our team to learn how our solutions can help you achieve your goals.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Solutions;
