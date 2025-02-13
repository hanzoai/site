
import { motion } from "framer-motion";
import { Code2, BarChart3, CreditCard, Wand2 } from "lucide-react";

const features = [
  {
    icon: <Code2 className="h-8 w-8" />,
    title: "AI Code Editor",
    description:
      "Intelligent code completion, refactoring suggestions, and automated bug fixing powered by advanced AI.",
  },
  {
    icon: <Wand2 className="h-8 w-8" />,
    title: "App Builder",
    description:
      "Drag-and-drop interface combined with AI assistance to build professional applications quickly.",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Analytics Integration",
    description:
      "Built-in PostHog integration for comprehensive user behavior tracking and analysis.",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Payment Processing",
    description:
      "Seamless Stripe integration for handling payments and subscriptions in your applications.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-display text-white"
          >
            Powerful Features for Modern Development
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto"
          >
            Everything you need to build professional applications, powered by
            cutting-edge AI technology.
          </motion.p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-lg ring-1 ring-white/10 hover:ring-white/20 transition-all"
            >
              <div className="p-2 bg-white/10 w-fit rounded-lg text-blue-400">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
