"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Background() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Get container dimensions
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();
      
      // Calculate relative mouse position
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate transform values based on mouse position
  const getTransform = (depth: number) => {
    const maxMove = 40; // Maximum movement in pixels
    const moveX = (mousePosition.x - 0.5) * maxMove * depth;
    const moveY = (mousePosition.y - 0.5) * maxMove * depth;
    return `translate(${moveX}px, ${moveY}px)`;
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-black"
    >
      {/* Gradient overlay with reduced opacity */}
      <div className="absolute inset-0 bg-white/70 dark:bg-black/70 z-10" />
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-100/30 via-pink-100/20 to-white dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-black animate-gradient-slow" />
      
      {/* Animated circles with parallax effect */}
      <motion.div 
        className="absolute -top-20 -left-20 w-[40rem] h-[40rem] rounded-full bg-blue-200/20 dark:bg-blue-500/10 blur-[6rem]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: getTransform(0.5) }}
      />
      
      <motion.div 
        className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-purple-200/20 dark:bg-purple-500/10 blur-[5rem]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{ transform: getTransform(0.3) }}
      />
      
      <motion.div 
        className="absolute top-1/3 right-1/4 w-[25rem] h-[25rem] rounded-full bg-pink-200/20 dark:bg-pink-500/10 blur-[4rem]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{ transform: getTransform(0.8) }}
      />
      
      {/* Particle-like elements scattered around */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 dark:bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Sound wave simulation */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-24 px-4">
        <div className="flex items-end gap-1 h-full">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-gradient-to-t from-purple-300/30 to-pink-200/20 dark:from-purple-500/30 dark:to-pink-500/20 rounded-full"
              animate={{
                height: [
                  `${Math.random() * 30 + 5}%`,
                  `${Math.random() * 80 + 20}%`,
                  `${Math.random() * 30 + 5}%`
                ]
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 