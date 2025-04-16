"use client";

import React, { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import musicAnimation from '@/assets/music-animation.json';
import { useSettings } from '@/lib/settings-context';

interface AnimatedVisualizerProps {
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const AnimatedVisualizer: React.FC<AnimatedVisualizerProps> = ({
  isPlaying,
  size = 'md',
  className = '',
  onClick,
}) => {
  const { settings } = useSettings();
  const lottieRef = useRef<any>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  useEffect(() => {
    if (lottieRef.current) {
      if (isPlaying) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div
      className={`relative ${sizeClasses[size]} ${className} cursor-pointer group`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 rounded-full backdrop-blur-sm" />
      <Lottie
        lottieRef={lottieRef}
        animationData={musicAnimation}
        loop={true}
        className="w-full h-full"
        style={{
          filter: settings.darkMode ? 'none' : 'brightness(0.8) saturate(1.2)',
        }}
      />
    </div>
  );
};

export default AnimatedVisualizer; 