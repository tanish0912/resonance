"use client";

import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import musicAnimation from '../assets/music-animation.json';

interface LottieVisualizerProps {
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function LottieVisualizer({ 
  isPlaying, 
  size = 'md', 
  className = '',
  onClick
}: LottieVisualizerProps) {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(isPlaying ? 1 : 0.3);
      lottieRef.current.play();
    }
  }, [isPlaying]);

  // Define size classes
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48'
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      {/* Gradient background with blur */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm opacity-40"></div>
      
      {/* Animation */}
      <Lottie
        lottieRef={lottieRef}
        animationData={musicAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
        className={`opacity-${isPlaying ? '100' : '50'}`}
      />
    </div>
  );
} 