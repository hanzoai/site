import { motion } from "framer-motion";
import { Database, Brain, ShoppingCart, CreditCard, Megaphone, Users, Share2, Github, Zap, Lock, Globe, Cpu, Cloud, Blocks, Target, BarChart } from "lucide-react";
import { Button } from "./ui/button";

const products = [
  {
    icon: <Database className="h-8 w-8" />,
    title: "Hanzo Base",
    description: "One-file backend with real-time DB, auth, and file storage—built for next-gen AI applications.",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "One-Line Spin-Up" },
      { icon: <Lock className="h-4 w-4" />, text: "Realtime & Authentication" },
      { icon: <Globe className="h-4 w-4" />, text: "Edge Optimized" },
      { icon: <Github className="h-4 w-4" />, text: "Open Source" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-base"
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Hanzo AI",
    description: "Transform your app with advanced ML, vector search, and self-learning automation.",
    features: [
      { icon: <Cpu className="h-4 w-4" />, text: "LLM & Vector Search" },
      { icon: <Cloud className="h-4 w-4" />, text: "Autonomous Operations" },
      { icon: <Blocks className="h-4 w-4" />, text: "Decentralized Ready" },
      { icon: <Target className="h-4 w-4" />, text: "Easy SDK" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-ai"
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Hanzo Commerce",
    description: "Sell anything—physical, digital, or tokenized. Scale from day one with built-in intelligence.",
    features: [
      { icon: <CreditCard className="h-4 w-4" />, text: "One-Line Checkout" },
      { icon: <BarChart className="h-4 w-4" />, text: "Subscriptions & Promotions" },
      { icon: <Globe className="h-4 w-4" />, text: "E2E Analytics" },
      { icon: <Github className="h-4 w-4" />, text: "Web2 & Web3" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-commerce"
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Hanzo Payments",
    description: "Secure, AI-enhanced transactions across fiat, crypto, and beyond.",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "Instant Onboarding" },
      { icon: <Globe className="h-4 w-4" />, text: "Global Coverage" },
      { icon: <Lock className="h-4 w-4" />, text: "Fraud Detection" },
      { icon: <BarChart className="h-4 w-4" />, text: "Flexible Pricing" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-payments"
  },
  {
    icon: <Megaphone className="h-8 w-8" />,
    title: "Hanzo Marketing",
    description: "Supercharge your growth engine—automated ads, funnels, and engagement.",
    features: [
      { icon: <Cpu className="h-4 w-4" />, text: "AI-Optimized Campaigns" },
      { icon: <Cloud className="h-4 w-4" />, text: "Multi-Channel Outreach" },
      { icon: <Blocks className="h-4 w-4" />, text: "Contextual Analytics" },
      { icon: <Target className="h-4 w-4" />, text: "Affiliate & Referral Modules" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-marketing"
  },
  {
    icon: <Share2 className="h-8 w-8" />,
    title: "Hanzo Social",
    description: "One-stop management for all your social channels.",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "Scheduled Posts" },
      { icon: <Lock className="h-4 w-4" />, text: "Social Insights" },
      { icon: <Globe className="h-4 w-4" />, text: "Cross-Platform Integration" },
      { icon: <Github className="h-4 w-4" />, text: "Community Building" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-social"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Hanzo People",
    description: "Bring user data, CRM, and authentication together.",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "Unified Identity" },
      { icon: <Lock className="h-4 w-4" />, text: "CRM Tools" },
      { icon: <Globe className="h-4 w-4" />, text: "Behavior Tracking" },
      { icon: <BarChart className="h-4 w-4" />, text: "Flexible Plans" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-people"
  }
];

const Products = () => {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-display text-white"
          >
            The Heroku of AI (and Beyond)
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto"
          >
            Redefining modern application development with AI-powered tooling and cloud infrastructure—all running on sustainable energy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 bg-black rounded-xl ring-1 ring-white/10 hover:ring-white/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white/5 w-fit rounded-lg text-white">
                  {product.icon}
                </div>
                {product.github && (
                  <a 
                    href={product.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                )}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{product.title}</h3>
              <p className="mt-2 text-gray-300">{product.description}</p>
              <ul className="mt-4 space-y-3">
                {product.features.map((feature) => (
                  <li key={feature.text} className="text-gray-400 flex items-center space-x-2">
                    {feature.icon}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <motion.div 
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <a href="https://docs.hanzo.ai" target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white text-black hover:bg-gray-100 border-2 border-white group-hover:translate-y-[-2px] transition-transform duration-300"
                  >
                    Learn More
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 bg-black rounded-xl ring-1 ring-white/10"
          >
            <BarChart className="h-8 w-8 text-white mb-4" />
            <h3 className="text-3xl font-bold text-white">$2T+</h3>
            <p className="mt-2 text-gray-300">AI software market by 2030</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-black rounded-xl ring-1 ring-white/10"
          >
            <Target className="h-8 w-8 text-white mb-4" />
            <h3 className="text-3xl font-bold text-white">70%</h3>
            <p className="mt-2 text-gray-300">Enterprise AI adoption by 2025</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-black rounded-xl ring-1 ring-white/10"
          >
            <Leaf className="h-8 w-8 text-white mb-4" />
            <h3 className="text-3xl font-bold text-white">1GW</h3>
            <p className="mt-2 text-gray-300">Green energy at 3.0 cent/kWh</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Products;
