
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dev = () => {
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
            <Settings className="h-4 w-4 text-pink-400" />
            <span className="text-sm text-pink-400">Developer Tools</span>
          </div>
          <h2 className="text-4xl font-display text-white mb-4">Built for Developers</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive tools and resources to help you build faster and better.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Dev;
