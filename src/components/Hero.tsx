
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display tracking-tight text-white"
          >
            Build as fast
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              as you think
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Design, Engineer, and Market AI-powered applications with our unified platform.
            Featuring streaming AI, UI components, and a real-time database - everything you need to build modern apps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-lg px-8 bg-white text-black hover:bg-gray-200">
              <a href="https://hanzo.app">Launch App</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 text-white border-white/20 bg-white/5 hover:bg-white/10"
            >
              <a href="https://docs.hanzo.ai">Read Docs</a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 rounded-xl bg-gray-900/50 p-4 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl"
        >
          <pre className="overflow-x-auto">
            <code className="text-sm sm:text-base text-gray-300">
              <span className="text-blue-400">import</span>{" "}
              <span className="text-purple-400">{"{ createAI }"}</span>{" "}
              <span className="text-blue-400">from</span>{" "}
              <span className="text-yellow-300">'@hanzo/ai'</span>
              {"\n"}
              <span className="text-blue-400">import</span>{" "}
              <span className="text-purple-400">{"{ Button }"}</span>{" "}
              <span className="text-blue-400">from</span>{" "}
              <span className="text-yellow-300">'@hanzo/ui'</span>
              {"\n"}
              <span className="text-blue-400">import</span>{" "}
              <span className="text-purple-400">{"{ createClient }"}</span>{" "}
              <span className="text-blue-400">from</span>{" "}
              <span className="text-yellow-300">'@hanzo/base'</span>
              {"\n\n"}
              <span className="text-purple-400">const</span> ai{" "}
              <span className="text-gray-400">=</span>{" "}
              <span className="text-blue-400">createAI</span>()
              {"\n"}
              <span className="text-purple-400">const</span> db{" "}
              <span className="text-gray-400">=</span>{" "}
              <span className="text-blue-400">createClient</span>()
              {"\n\n"}
              <span className="text-gray-500">// Stream AI responses in real-time</span>
              {"\n"}
              <span className="text-blue-400">await</span> ai.chat.completions.create({"{\n"}
              {"  "}messages: [{"{ role: 'user', content: 'Hello!' }"}],{"\n"}
              {"  "}stream: true{"\n"}
              {"}"})
            </code>
          </pre>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
