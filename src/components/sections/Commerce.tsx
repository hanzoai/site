
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Commerce = () => {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1 rounded-full mb-6">
            <ShoppingCart className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">E-commerce Platform</span>
          </div>
          <h2 className="text-4xl font-display text-white mb-4">Complete Commerce Stack</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to build and scale your e-commerce business.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Commerce;
