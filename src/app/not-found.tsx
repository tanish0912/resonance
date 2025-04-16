"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Home, Music2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();
  
  // Random animation values for the music notes
  const getRandomDelay = () => Math.random() * 0.5;
  const getRandomDuration = () => Math.random() * 5 + 5;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-purple-900/20 to-zinc-900 -z-10" />
      
      {/* Animated floating music notes */}
      <div className="absolute inset-0 overflow-hidden -z-5">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-4xl md:text-6xl font-bold"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`, 
              opacity: 0,
              scale: 0.5,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: ["0%", "100%", "0%"],
              opacity: [0, 0.5, 0],
              rotate: Math.random() * 360,
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: getRandomDuration(),
              delay: getRandomDelay(),
              ease: "linear"
            }}
          >
            {["♪", "♫", "♬", "♩", "♭", "♮"][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>
      
      {/* 404 content */}
      <motion.div 
        className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 max-w-lg w-full text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
            404
          </h1>
        </motion.div>
        
        <motion.h2 
          className="text-xl md:text-2xl font-semibold text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          We can't find that track
        </motion.h2>
        
        <motion.p 
          className="text-white/70 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          The page you're looking for is still being mastered. Check back soon or return to your playlist.
        </motion.p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-white/10 hover:bg-white/10 px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 