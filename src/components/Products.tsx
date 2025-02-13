
import { motion } from "framer-motion";
import { Database, Brain, ShoppingCart, CreditCard, Megaphone, Users, Share2, Github, Zap, Lock, Globe, Cpu, Cloud, Blocks, Target, BarChart } from "lucide-react";
import { Button } from "./ui/button";

const products = [
  {
    icon: <Database className="h-8 w-8" />,
    title: "Hanzo Base",
    description: "A one-file backend with real-time DB, auth, and file storage—built for next-gen AI applications.",
    code: "import { createClient } from '@hanzo/base';",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "One-Line Spin-Up – Paste a single import, get an entire backend" },
      { icon: <Lock className="h-4 w-4" />, text: "Realtime & Authentication – Stay in sync effortlessly" },
      { icon: <Globe className="h-4 w-4" />, text: "Edge Optimized – Deploy globally for near-zero latency" },
      { icon: <Github className="h-4 w-4" />, text: "Open Source – No vendor lock-in, self-host or let us do it" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-base"
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Hanzo AI",
    description: "Transform your app with advanced ML, vector search, and self-learning automation.",
    code: "import { useAI } from '@hanzo/ai';",
    features: [
      { icon: <Cpu className="h-4 w-4" />, text: "LLM & Vector Search – Deep text analysis and semantic lookup" },
      { icon: <Cloud className="h-4 w-4" />, text: "Autonomous Operations – Automated workflows that evolve over time" },
      { icon: <Blocks className="h-4 w-4" />, text: "Decentralized Ready – Perfect for unstoppable, mesh-based solutions" },
      { icon: <Target className="h-4 w-4" />, text: "Easy SDK – Seamlessly integrate advanced AI calls in your code" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-ai"
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Hanzo Commerce",
    description: "Sell anything—physical, digital, or tokenized. Scale from day one with built-in intelligence.",
    code: "import { useCommerce } from '@hanzo/commerce';",
    features: [
      { icon: <CreditCard className="h-4 w-4" />, text: "One-Line Checkout – Quick deployment of cart and payment flows" },
      { icon: <BarChart className="h-4 w-4" />, text: "Subscriptions & Promotions – Auto-manage recurring revenue" },
      { icon: <Globe className="h-4 w-4" />, text: "E2E Analytics – Real-time data on sales and behavior" },
      { icon: <Github className="h-4 w-4" />, text: "Web2 & Web3 – Plug into traditional or decentralized payment rails" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-commerce"
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Hanzo Payments",
    description: "Secure, AI-enhanced transactions across fiat, crypto, and beyond.",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "Instant Onboarding – Start accepting payments in minutes" },
      { icon: <Globe className="h-4 w-4" />, text: "Global Coverage – Handle multiple currencies and networks" },
      { icon: <Lock className="h-4 w-4" />, text: "Fraud Detection – Machine learning insights reduce disputes" },
      { icon: <BarChart className="h-4 w-4" />, text: "Flexible Pricing – Transparent pay-as-you-grow structure" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-payments"
  },
  {
    icon: <Megaphone className="h-8 w-8" />,
    title: "Hanzo Marketing",
    description: "Supercharge your growth engine—automated ads, funnels, and engagement.",
    features: [
      { icon: <Cpu className="h-4 w-4" />, text: "AI-Optimized Campaigns – Launch targeted ads with minimal effort" },
      { icon: <Cloud className="h-4 w-4" />, text: "Multi-Channel Outreach – Facebook, Google Ads, email, affiliates" },
      { icon: <Blocks className="h-4 w-4" />, text: "Contextual Analytics – Understand user actions in real-time" },
      { icon: <Target className="h-4 w-4" />, text: "Affiliate & Referral Modules – Tap into influencer networks" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-marketing"
  },
  {
    icon: <Share2 className="h-8 w-8" />,
    title: "Hanzo Social",
    description: "One-stop management for all your social channels.",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "Scheduled Posts – Plan content across platforms at once" },
      { icon: <Lock className="h-4 w-4" />, text: "Social Insights – Track engagement, discover top content" },
      { icon: <Globe className="h-4 w-4" />, text: "Cross-Platform Integration – Seamless AI automation" },
      { icon: <Github className="h-4 w-4" />, text: "Community Building – Chat & moderation tools in one place" }
    ],
    github: "https://github.com/hanzo-ai/hanzo-social"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Hanzo People",
    description: "Bring user data, CRM, and authentication together.",
    features: [
      { icon: <Zap className="h-4 w-4" />, text: "Unified Identity – Manage logins, roles, and permissions" },
      { icon: <Lock className="h-4 w-4" />, text: "CRM Tools – Keep track of users, leads, and conversions" },
      { icon: <Globe className="h-4 w-4" />, text: "Behavior Tracking – Understand user journeys deeply" },
      { icon: <BarChart className="h-4 w-4" />, text: "Flexible Plans – Start small, scale to millions of users" }
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
            The Last Software You'll Ever Use
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto"
          >
            A single platform to build, run, and grow AI-powered apps—centralized or decentralized, fully autonomous, ever-learning, and unstoppable. Join us in shaping the future of mesh-networked decentralized super intelligence.
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
              {product.code && (
                <pre className="mt-4 p-3 bg-white/5 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{product.code}</code>
                </pre>
              )}
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
            <Globe className="h-8 w-8 text-white mb-4" />
            <h3 className="text-3xl font-bold text-white">1GW</h3>
            <p className="mt-2 text-gray-300">Green energy at 3.0 cent/kWh</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Products;
