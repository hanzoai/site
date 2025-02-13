
import { motion } from "framer-motion";
import { Code as CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Code = () => {
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
            <CodeIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">Development Environment</span>
          </div>
          <h2 className="text-4xl font-display text-white mb-4">Code with Confidence</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A powerful development environment built for the AI era.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Code;
