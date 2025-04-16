"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart,
  Settings,
  Maximize2,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import LottieVisualizer from './LottieVisualizer';
import MusicVisualizer from './MusicVisualizer';
import AnimatedVisualizer from "./AnimatedVisualizer";
import Image from "next/image";
import { useSettings } from '@/lib/settings-context';
import { useAuth } from '@/lib/auth-context';

// Placeholder song
const mockCurrentSong = {
  title: 'Midnight Serenade',
  artist: 'Luna Echo',
  cover: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
};

export default function MusicPlayer() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(settings.volume);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(30);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [visualizerType, setVisualizerType] = useState<'bars' | 'lottie' | 'animated'>('lottie');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(settings.volume);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const playerState = {
        isPlaying,
        progress,
        volume,
        isMuted,
        isFavorite,
        isShuffleOn,
        isRepeatOn,
        visualizerType,
        previousVolume
      };
      localStorage.setItem('playerState', JSON.stringify(playerState));
    }
  }, [isPlaying, progress, volume, isMuted, isFavorite, isShuffleOn, isRepeatOn, visualizerType, previousVolume]);
  
  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('playerState');
      if (savedState) {
        const state = JSON.parse(savedState);
        setIsPlaying(state.isPlaying);
        setProgress(state.progress);
        setVolume(state.volume);
        setIsMuted(state.isMuted);
        setIsFavorite(state.isFavorite);
        setIsShuffleOn(state.isShuffleOn);
        setIsRepeatOn(state.isRepeatOn);
        setVisualizerType(state.visualizerType);
        setPreviousVolume(state.previousVolume);
      }
    }
  }, []);
  
  // Sync volume with settings
  useEffect(() => {
    setVolume(settings.volume);
  }, [settings.volume]);
  
  // Save volume to settings when changed
  useEffect(() => {
    if (volume !== settings.volume) {
      updateSettings({ volume });
    }
  }, [volume, settings.volume, updateSettings]);
  
  // Simulate progress when playing
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 180) {
            // Auto-restart if repeat is on, otherwise pause
            if (isRepeatOn) {
              return 0;
            } else {
              clearInterval(progressInterval.current as NodeJS.Timeout);
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, isRepeatOn]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const toggleMute = () => {
    if (isMuted) {
      // Unmuting - restore previous volume
      setIsMuted(false);
      setVolume(previousVolume);
    } else {
      // Muting - store current volume and set to zero
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };
  
  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };
  
  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn);
  };

  const toggleVisualizerType = () => {
    setVisualizerType(prev => {
      if (prev === 'bars') return 'lottie';
      if (prev === 'lottie') return 'animated';
      return 'bars';
    });
  };
  
  // Skip to previous/next track (simulated)
  const skipPrevious = () => {
    setProgress(0);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };
  
  const skipNext = () => {
    setProgress(0);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };
  
  // Open player page
  const goToPlayerPage = () => {
    router.push('/player');
  };
  
  // Open settings page
  const goToSettings = () => {
    router.push('/settings');
  };
  
  // Update fullscreen state based on document state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const bounds = progressBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    setProgress(Math.floor(180 * percent));
  };
  
  // Handle volume slider click
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = e.currentTarget;
    const bounds = volumeBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    setVolume(Math.floor(percent * 100));
    if (percent > 0 && isMuted) setIsMuted(false);
  };

  // Toggle fullscreen - passing state in URL
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Store current player state in localStorage
        const playerState = {
          isPlaying,
          progress,
          volume: isMuted ? 0 : volume,
          isMuted,
          isFavorite,
          isShuffleOn,
          isRepeatOn,
          visualizerType,
          previousVolume
        };
        localStorage.setItem('playerState', JSON.stringify(playerState));
        
        // Navigate to player page and enter fullscreen
        await router.push('/player');
        if (playerRef.current) {
          await playerRef.current.requestFullscreen();
        }
      } else {
        // Exit fullscreen if already in fullscreen mode
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <>
      <motion.div 
        ref={playerRef}
        className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-xl bg-black/40 dark:bg-black/40 light:bg-white/40 border-t border-white/10 dark:border-white/10 light:border-black/10 z-50"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <img 
                  src={mockCurrentSong.cover} 
                  alt={mockCurrentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white">{mockCurrentSong.title || "No song playing"}</h3>
                <p className="text-xs text-zinc-600 dark:text-white/60">{mockCurrentSong.artist || "Unknown artist"}</p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleShuffle}
                  className={`rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer ${isShuffleOn ? 'text-purple-500' : 'text-zinc-700 dark:text-white/70'}`}
                >
                  <Shuffle size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={skipPrevious}
                  className="rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer text-zinc-700 dark:text-white/70"
                >
                  <SkipBack size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={togglePlay}
                  className="rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer text-zinc-700 dark:text-white/70"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={skipNext}
                  className="rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer text-zinc-700 dark:text-white/70"
                >
                  <SkipForward size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleRepeat}
                  className={`rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer ${isRepeatOn ? 'text-purple-500' : 'text-zinc-700 dark:text-white/70'}`}
                >
                  <Repeat size={18} />
                </Button>
              </div>
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className="text-xs text-zinc-600 dark:text-white/60">{formatTime(progress)}</span>
                <div className="flex-1 h-1 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full overflow-hidden cursor-pointer">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${progress/180*100}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-600 dark:text-white/60">{formatTime(180)}</span>
              </div>
            </div>

            {/* Volume Control and Fullscreen */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                  className="rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer text-zinc-700 dark:text-white/70"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>
                <div className="w-24 h-1 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full overflow-hidden cursor-pointer">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${isMuted ? 0 : volume*100}%` }}
                  />
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFullscreen}
                  className="rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer text-zinc-700 dark:text-white/70"
                >
                  <Maximize2 size={18} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sidebar Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsSidebarCollapsed(false)}
        className="fixed bottom-20 left-4 z-50 rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer backdrop-blur-md bg-black/30 dark:bg-black/30 light:bg-white/30 shadow-lg border border-white/10 dark:border-white/10 light:border-black/10"
      >
        <Menu size={20} />
      </Button>
    </>
  );
} 