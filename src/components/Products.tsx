
import { motion } from "framer-motion";
import { Database, Brain, ShoppingCart, CreditCard, Megaphone, Users, Share2 } from "lucide-react";
import { Button } from "./ui/button";

const products = [
  {
    icon: <Database className="h-8 w-8" />,
    title: "Hanzo Base",
    description: "One-file backend with real-time DB, auth, and file storage—built for next-gen AI applications.",
    features: [
      "One-Line Spin-Up",
      "Realtime & Authentication",
      "Edge Optimized",
      "Open Source"
    ]
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Hanzo AI",
    description: "Transform your app with advanced ML, vector search, and self-learning automation.",
    features: [
      "LLM & Vector Search",
      "Autonomous Operations",
      "Decentralized Ready",
      "Easy SDK"
    ]
  },
  {
    icon: <ShoppingCart className="h-8 w-8" />,
    title: "Hanzo Commerce",
    description: "Sell anything—physical, digital, or tokenized. Scale from day one with built-in intelligence.",
    features: [
      "One-Line Checkout",
      "Subscriptions & Promotions",
      "E2E Analytics",
      "Web2 & Web3"
    ]
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Hanzo Payments",
    description: "Secure, AI-enhanced transactions across fiat, crypto, and beyond.",
    features: [
      "Instant Onboarding",
      "Global Coverage",
      "Fraud Detection",
      "Flexible Pricing"
    ]
  },
  {
    icon: <Megaphone className="h-8 w-8" />,
    title: "Hanzo Marketing",
    description: "Supercharge your growth engine—automated ads, funnels, and engagement.",
    features: [
      "AI-Optimized Campaigns",
      "Multi-Channel Outreach",
      "Contextual Analytics",
      "Affiliate & Referral Modules"
    ]
  },
  {
    icon: <Share2 className="h-8 w-8" />,
    title: "Hanzo Social",
    description: "One-stop management for all your social channels.",
    features: [
      "Scheduled Posts",
      "Social Insights",
      "Cross-Platform Integration",
      "Community Building"
    ]
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Hanzo People",
    description: "Bring user data, CRM, and authentication together.",
    features: [
      "Unified Identity",
      "CRM Tools",
      "Behavior Tracking",
      "Flexible Plans"
    ]
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
            A single platform to build, run, and grow AI-powered apps—centralized or decentralized, 
            fully autonomous, ever-learning, and unstoppable.
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
              className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10 hover:ring-white/20 transition-all"
            >
              <div className="p-2 bg-white/10 w-fit rounded-lg text-blue-400">
                {product.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{product.title}</h3>
              <p className="mt-2 text-gray-300">{product.description}</p>
              <ul className="mt-4 space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="text-gray-400 flex items-center">
                    <span className="mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button variant="outline" className="w-full text-white border-white/20 bg-white/5 hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
