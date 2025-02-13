
import { motion } from "framer-motion";
import { AppWindow, Rocket, Bot, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickApps = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI Chat Assistant",
    description: "Launch your own ChatGPT-style AI assistant",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "E-commerce Store",
    description: "Start selling products online in minutes",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: <AppWindow className="h-6 w-6" />,
    title: "Web3 dApp",
    description: "Build a decentralized application",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Custom App",
    description: "Start from scratch with our App Builder",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
];

const QuickStart = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display text-white mb-4">
            Quick Launch Apps
          </h2>
          <p className="text-lg text-gray-400">
            Get started quickly with our pre-built templates
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickApps.map((app, index) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10 hover:ring-white/20 transition-all"
            >
              <div className={`${app.bgColor} p-3 rounded-lg w-fit ${app.color}`}>
                {app.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {app.title}
              </h3>
              <p className="mt-2 text-gray-400">{app.description}</p>
              <Button 
                className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                variant="outline"
              >
                Launch App
                <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickStart;
