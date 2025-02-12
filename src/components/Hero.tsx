
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display tracking-tight text-gray-900"
          >
            Build Better Apps
            <span className="block text-primary">with AI-Powered Tools</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Transform your development workflow with our AI code editor, analytics
            integration, and powerful app builder. Build, deploy, and scale faster
            than ever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg px-8">
              Start Building
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Code preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 rounded-xl bg-gray-900 p-4 backdrop-blur-xl ring-1 ring-gray-800/10 shadow-2xl"
        >
          <pre className="overflow-x-auto">
            <code className="text-sm sm:text-base text-gray-300">
              <span className="text-blue-400">import</span>{" "}
              <span className="text-green-400">{"{ AI }"}</span>{" "}
              <span className="text-blue-400">from</span>{" "}
              <span className="text-yellow-300">'hanzo/ai'</span>
              {"\n\n"}
              <span className="text-purple-400">const</span> editor{" "}
              <span className="text-gray-400">=</span>{" "}
              <span className="text-blue-400">new</span>{" "}
              <span className="text-green-400">AI.CodeEditor</span>
              {"\n"}
              <span className="text-purple-400">const</span> result{" "}
              <span className="text-gray-400">=</span>{" "}
              <span className="text-blue-400">await</span>{" "}
              editor.improveCode(myCode)
              {"\n\n"}
              <span className="text-gray-500">// The AI understands your code</span>
              {"\n"}console.<span className="text-blue-400">log</span>(result)
            </code>
          </pre>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
