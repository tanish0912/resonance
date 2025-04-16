"use client";

import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const { user } = useAuth();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse motion tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to window
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate parallax values
  const moveX = (mousePosition.x - 0.5) * 30;
  const moveY = (mousePosition.y - 0.5) * 30;
  
  // Spring animations for smoother movement
  const springConfig = { stiffness: 150, damping: 20 };
  const springX = useSpring(moveX, springConfig);
  const springY = useSpring(moveY, springConfig);

  useEffect(() => {
    springX.set(moveX);
    springY.set(moveY);
  }, [moveX, moveY, springX, springY]);

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Floating orbs with parallax effect */}
      <motion.div 
        className="absolute w-72 h-72 rounded-full bg-purple-500/20 blur-3xl -z-10"
        style={{ 
          x: useTransform(springX, x => x * -1.2), 
          y: useTransform(springY, y => y * -1.2),
          top: '10%',
          left: '15%'
        }}
      />
      
      <motion.div 
        className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl -z-10"
        style={{ 
          x: useTransform(springX, x => x * 1.5), 
          y: useTransform(springY, y => y * 1.5),
          bottom: '10%',
          right: '15%'
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8 relative"
        style={{ 
          x: useTransform(springX, x => x * 0.5), 
          y: useTransform(springY, y => y * 0.5),
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Welcome back, 
          </motion.span>{" "}
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {user?.name || "Friend"}
          </motion.span>
        </h1>
        <motion.p
          className="mt-4 text-white/70 text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Your premium music experience awaits. Ready to feel the beat?
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
        className="w-full max-w-sm relative"
        style={{ 
          x: useTransform(springX, x => x * -0.8), 
          y: useTransform(springY, y => y * -0.8),
        }}
      >
        <Card className="bg-black/30 border-white/20 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden relative">
          {/* Inner highlight effect */}
          <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>
          
          <CardContent className="pt-6 pb-6 flex flex-col items-center relative">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg h-12 shadow-lg transition-all hover:shadow-purple-500/20 hover:scale-[1.02]"
              onClick={goToDashboard}
            >
              Enter Music Hub
            </Button>
            <p className="mt-4 text-xs text-white/60 text-center">
              Unlock your premium music experience
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 