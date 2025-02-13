
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Hanzo has helped us to streamline our complex challenges and processes. Their suite of tools has made it easier for us to launch, scale, and innovate our business.",
    author: "Jennifer Patel",
    role: "Founder & CEO"
  },
  {
    quote: "Hanzo's digital solutions have empowered us to redefine success. They have provided us with the tools we need to accelerate our growth and expand our reach.",
    author: "Beck Smirth",
    role: "Product Manager"
  },
  {
    quote: "We are impressed with Hanzo's pioneering approach to digital solutions. Their platform has helped us to transcend traditional boundaries and achieve new levels of success.",
    author: "Chris Jonathon",
    role: "Investor"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display text-white">Our Impact</h2>
          <p className="mt-4 text-lg text-gray-300">You don't have to take our word for it.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10"
            >
              <p className="text-gray-300 italic">{testimonial.quote}</p>
              <div className="mt-4">
                <p className="text-white font-semibold">{testimonial.author}</p>
                <p className="text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
