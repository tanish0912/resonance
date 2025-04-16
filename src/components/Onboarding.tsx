"use client";

import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { setUser } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await setUser(name.trim());
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating orbs with parallax effect */}
      <motion.div 
        className="absolute w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl -z-10"
        style={{ 
          x: useTransform(springX, x => x * -1.2), 
          y: useTransform(springY, y => y * -1.2),
          top: '15%',
          right: '15%'
        }}
      />
      
      <motion.div 
        className="absolute w-80 h-80 rounded-full bg-pink-500/20 blur-3xl -z-10"
        style={{ 
          x: useTransform(springX, x => x * 1.5), 
          y: useTransform(springY, y => y * 1.5),
          bottom: '15%',
          left: '10%'
        }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 text-center"
        style={{ 
          x: useTransform(springX, x => x * 0.5), 
          y: useTransform(springY, y => y * 0.5),
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Welcome to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Resonance
          </span>
        </h1>
        <p className="mt-4 text-white/70 max-w-md">
          Your premium music player that brings your listening experience to the next level
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-sm"
        style={{ 
          x: useTransform(springX, x => x * -0.8), 
          y: useTransform(springY, y => y * -0.8),
        }}
      >
        <Card className="bg-black/30 border-white/20 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden relative">
          {/* Inner highlight effect */}
          <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>
          
          <CardContent className="pt-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  What should we call you?
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-purple-500 rounded-lg backdrop-blur-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg h-12 shadow-lg transition-all hover:shadow-purple-500/20 hover:scale-[1.02]"
                disabled={isSubmitting || !name.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Get Started'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 