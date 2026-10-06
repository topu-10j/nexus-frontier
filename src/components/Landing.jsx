import { motion } from 'framer-motion';

export default function Landing({ onEnter }) {
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 stars-bg" />
      
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-6xl md:text-8xl font-bold text-white z-10"
      >
        NEXUS-FRONTIER
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-gray-400 text-xl mt-4 z-10"
      >
        Build a colony. Survive the frontier.
      </motion.p>
      
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={onEnter}
        className="mt-12 px-10 py-4 bg-cyan-500 text-black font-bold 
                   rounded-full text-lg z-10 hover:bg-cyan-400 
                   transition-all animate-pulse"
      >
        ENTER THE FRONTIER
      </motion.button>
    </div>
  );
}