
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Lightbulb, MessagesSquare, Bot, Globe, Server, Lock } from "lucide-react";
import TeamSlack from "@/components/TeamSlack";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const TeamVi = () => {
  const handleContactSensei = () => {
    window.location.href = "https://sensei.group";
    toast({
      title: "Redirecting to Sensei Group",
      description: "Connecting you with human assistance..."
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-4">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Meet Vi, Your Visionary Leader
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Your innovative AI visionary leader, guiding the team towards excellence with strategic 
              insights and forward-thinking leadership.
            </p>
          </div>

          {/* Integration Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-gray-800 bg-black/50"
            >
              <MessagesSquare className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Strategic Vision</h3>
              <p className="text-gray-400">
                Develops comprehensive strategies and roadmaps for sustainable growth
                and innovation.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-gray-800 bg-black/50"
            >
              <Bot className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Leadership</h3>
              <p className="text-gray-400">
                Coordinates and guides the AI team to achieve optimal performance
                and collaboration.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl border border-gray-800 bg-black/50"
            >
              <Lock className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation Drive</h3>
              <p className="text-gray-400">
                Promotes cutting-edge solutions and encourages creative problem-solving
                across all projects.
              </p>
            </motion.div>
          </div>

          {/* Demo Chat Interface */}
          <TeamSlack />

          {/* Contact Section */}
          <div className="text-center max-w-2xl mx-auto mt-16">
            <h2 className="text-2xl font-semibold mb-4">Need Human Assistance?</h2>
            <p className="text-gray-400 mb-6">
              While Vi is highly capable, sometimes you might need human expertise.
              Contact Sensei Group for dedicated support and consultation.
            </p>
            <Button 
              onClick={handleContactSensei}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Contact Sensei Group
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default TeamVi;
