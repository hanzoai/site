
import { motion } from "framer-motion";
import { Settings, Users } from "lucide-react";
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
            <Settings className="h-4 w-4 text-white" />
            <span className="text-sm text-white">Developer Tools</span>
          </div>
          <h2 className="text-4xl font-display text-white mb-4">Built for Developers</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive tools and resources to help you build faster and better.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-white">AI-Powered Development</h3>
            <p className="text-gray-300">
              Work alongside intelligent agents that understand your codebase and help you build faster.
            </p>
            <div className="flex space-x-4">
              <Users className="h-12 w-12 text-white" />
              <motion.div
                animate={{
                  x: [0, 10, 0],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-12 w-12 text-white"
              >
                <Settings className="h-full w-full" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-xl ring-1 ring-white/10"
          >
            <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Settings className="h-16 w-16 text-white mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-400">AI Agent Collaborating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Dev;
