"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/lib/settings-context';

interface MusicVisualizerProps {
  isPlaying: boolean;
}

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying }) => {
  const { settings } = useSettings();
  const bars = Array.from({ length: 12 });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        bars.forEach((_, index) => {
          const element = document.getElementById(`bar-${index}`);
          if (element) {
            const height = Math.random() * 100;
            element.style.height = `${height}%`;
          }
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      bars.forEach((_, index) => {
        const element = document.getElementById(`bar-${index}`);
        if (element) {
          element.style.height = '20%';
        }
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center space-x-1 h-full">
      {bars.map((_, index) => (
        <motion.div
          key={index}
          id={`bar-${index}`}
          className={`w-1 rounded-full ${
            settings.darkMode 
              ? 'bg-gradient-to-t from-purple-500 to-pink-500' 
              : 'bg-gradient-to-t from-purple-600 to-pink-600'
          }`}
          initial={{ height: '20%' }}
          animate={{ height: isPlaying ? '100%' : '20%' }}
          transition={{
            duration: 0.5,
            repeat: isPlaying ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            height: '20%',
            transition: 'height 0.1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
};

export default MusicVisualizer; 