"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
  Settings,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedVisualizer from "@/components/AnimatedVisualizer";
import LottieVisualizer from "@/components/LottieVisualizer";
import MusicVisualizer from "@/components/MusicVisualizer";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { useRouter } from "next/navigation";

// Placeholder song
const mockCurrentSong = {
  title: "Midnight Serenade",
  artist: "Luna Echo",
  cover: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  duration: 213, // 3:33 in seconds
};

// Animation constants
const PAGE_TRANSITION_CONFIG = {
  type: "spring",
  stiffness: 260,
  damping: 20
};

export default function PlayerPage() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [visualizerType, setVisualizerType] = useState<'bars' | 'lottie' | 'animated'>('lottie');
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(settings.volume);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(settings.volume);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dominantColor, setDominantColor] = useState("rgba(88, 28, 135, 0.8)"); // Default purple color
  const [isExiting, setIsExiting] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
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
        setPreviousVolume(state.previousVolume || settings.volume);
      }
    }
  }, [settings.volume]);
  
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
  
  // Toggle play state
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Toggle favorite state
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // Toggle mute state
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
  
  // Toggle shuffle state
  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };
  
  // Toggle repeat state
  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn);
  };
  
  // Toggle visualizer type
  const toggleVisualizerType = () => {
    setVisualizerType(prev => {
      if (prev === 'bars') return 'lottie';
      if (prev === 'lottie') return 'animated';
      return 'bars';
    });
  };
  
  // Navigate to settings
  const goToSettings = () => {
    router.push('/settings');
  };
  
  // Toggle fullscreen state
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerRef.current?.requestFullscreen) {
        playerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    }
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
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const bounds = progressBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    const newProgress = Math.floor(mockCurrentSong.duration * percent);
    setProgress(newProgress);
  };
  
  // Handle volume bar click
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = e.currentTarget;
    const bounds = volumeBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percent = x / bounds.width;
    setVolume(Math.floor(percent * 100));
    if (percent > 0 && isMuted) {
      setIsMuted(false);
      setPreviousVolume(Math.floor(percent * 100));
    }
  };
  
  // Simulate progress when playing
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= mockCurrentSong.duration) {
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
  }, [isPlaying, isRepeatOn, mockCurrentSong.duration]);
  
  // Shared motion variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    })
  };
  
  // Page transition variants
  const pageTransitionVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: 100
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 100,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  // Control button variants with theme-specific shadows
  const controlButtonVariants = {
    hover: { 
      scale: 1.1,
      filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95
    }
  };
  
  // Light mode specific button variants
  const lightModeButtonVariants = {
    hover: { 
      scale: 1.1,
      filter: "drop-shadow(0 0 8px rgba(0, 0, 0, 0.25))",
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95
    }
  };
  
  // Album pulse animation variants
  const albumPulseVariants = {
    playing: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    paused: {
      scale: [1, 1.005, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Continuous progress bar animation
  const progressAnimationVariants = {
    animate: (progress: number) => ({
      width: `${(progress / mockCurrentSong.duration) * 100}%`,
      transition: { duration: 0.8, ease: "linear" }
    })
  };
  
  // Handle exit animation when going back
  const handleBackClick = () => {
    // Save current state before exiting
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
    
    setIsExiting(true);
    // Wait for exit animation to complete
    setTimeout(() => {
      router.back();
    }, 300);
  };
  
  return (
    <motion.div 
      ref={playerRef}
      className="fixed inset-0 w-full h-full flex flex-col justify-center items-center overflow-hidden"
      variants={pageTransitionVariants}
      initial="initial"
      animate={isExiting ? "exit" : "animate"}
      exit="exit"
      transition={PAGE_TRANSITION_CONFIG}
    >
      {/* Dynamic background with animation */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        {/* Color overlay based on album art */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-purple-900 to-zinc-900 dark:from-zinc-900 dark:via-purple-900 dark:to-zinc-900 light:from-white light:via-purple-50 light:to-white"
          style={{ 
            background: `linear-gradient(135deg, ${dominantColor}, 
            ${settings.darkMode ? '#0f0f0f' : '#ffffff'} 80%)` 
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full bg-white/20 dark:bg-white/20 light:bg-purple-200/30"
              initial={{ 
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.1
              }}
              animate={{ 
                y: ["0%", "100%", "0%"],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="relative z-10 w-full h-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Album art with glassmorphism effect */}
          <motion.div 
            className="w-full flex justify-center"
            variants={fadeInVariants}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="relative w-full max-w-md aspect-square cursor-pointer"
              variants={albumPulseVariants}
              animate={isPlaying ? "playing" : "paused"}
            >
              {/* Glassmorphism container */}
              <div className="absolute -inset-4 bg-white/10 dark:bg-white/10 light:bg-purple-100/20 backdrop-blur-xl rounded-2xl 
                              border border-white/20 dark:border-white/20 light:border-purple-200/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] light:shadow-[0_8px_32px_rgba(0,0,0,0.15)]
                              before:absolute before:inset-0 before:rounded-2xl before:backdrop-blur-xl before:bg-gradient-to-br before:from-white/5 before:to-white/10 before:opacity-50" />
              
              {/* Album art */}
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <Image
                  src={mockCurrentSong.cover}
                  alt={mockCurrentSong.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Animated overlay when paused */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div 
                      className="absolute inset-0 bg-black/40 dark:bg-black/40 light:bg-purple-900/20 backdrop-blur-sm flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={settings.darkMode ? controlButtonVariants : lightModeButtonVariants}
                        className="w-20 h-20 rounded-full bg-white/20 dark:bg-white/20 light:bg-purple-100/30 backdrop-blur-md flex items-center justify-center cursor-pointer"
                        onClick={togglePlay}
                      >
                        <Play size={36} className="text-white dark:text-white light:text-purple-900 ml-1.5" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Music details and controls */}
          <div className="w-full flex flex-col space-y-10">
            {/* Song details */}
            <motion.div 
              className="flex flex-col items-center md:items-start"
              variants={fadeInVariants}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 dark:from-white dark:to-white/80 light:from-purple-900 light:to-purple-700">
                  {mockCurrentSong.title}
                </h1>
                <motion.button
                  className="ml-4 p-2 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFavorite}
                >
                  <Heart
                    size={28}
                    className={cn(
                      "transition-colors duration-300",
                      isFavorite ? "fill-pink-500 text-pink-500" : "text-white/70 dark:text-white/70 light:text-purple-700 hover:text-white dark:hover:text-white light:hover:text-purple-900"
                    )}
                  />
                </motion.button>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-white/70 dark:text-white/70 light:text-purple-700 mt-3">
                {mockCurrentSong.artist}
              </h2>
            </motion.div>
            
            {/* Music visualizer - center aligned and stops when paused */}
            <motion.div 
              className="w-full h-24 flex items-center justify-center md:justify-start"
              variants={fadeInVariants}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              {settings.visualizerEnabled && (
                <div className={`transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}>
                  {visualizerType === 'bars' ? (
                    <MusicVisualizer isPlaying={isPlaying} />
                  ) : visualizerType === 'lottie' ? (
                    <LottieVisualizer isPlaying={isPlaying} />
                  ) : (
                    <AnimatedVisualizer isPlaying={isPlaying} size="lg" />
                  )}
                </div>
              )}
            </motion.div>
            
            {/* Progress bar */}
            <motion.div 
              className="w-full space-y-2"
              variants={fadeInVariants}
              custom={3}
              initial="hidden"
              animate="visible"
            >
              <div 
                className="w-full h-2 bg-white/10 dark:bg-white/10 light:bg-purple-100/30 rounded-full overflow-hidden cursor-pointer relative"
                onClick={handleProgressClick}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 light:from-purple-600 light:to-pink-600 rounded-full"
                  custom={progress}
                  variants={progressAnimationVariants}
                  animate="animate"
                />
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-white light:bg-purple-100 rounded-full shadow-md"
                  style={{ left: `calc(${(progress / mockCurrentSong.duration) * 100}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between text-white/60 dark:text-white/60 light:text-purple-700/60 text-sm">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(mockCurrentSong.duration)}</span>
              </div>
            </motion.div>
            
            {/* Controls */}
            <motion.div 
              className="flex items-center justify-center space-x-6"
              variants={fadeInVariants}
              custom={4}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={settings.darkMode ? controlButtonVariants : lightModeButtonVariants}
                className={`p-3 text-white/70 dark:text-white/70 light:text-purple-700 hover:text-white dark:hover:text-white light:hover:text-purple-900 cursor-pointer ${isShuffleOn ? 'text-purple-400 dark:text-purple-400 light:text-purple-600' : ''}`}
                onClick={toggleShuffle}
              >
                <Shuffle size={24} />
              </motion.button>
              
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={settings.darkMode ? controlButtonVariants : lightModeButtonVariants}
                className="p-3 text-white/70 dark:text-white/70 light:text-purple-700 hover:text-white dark:hover:text-white light:hover:text-purple-900 cursor-pointer"
                onClick={skipPrevious}
              >
                <SkipBack size={28} />
              </motion.button>
              
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={settings.darkMode ? controlButtonVariants : lightModeButtonVariants}
                className="p-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-500 light:from-purple-600 light:to-pink-600 text-white shadow-lg cursor-pointer"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
              </motion.button>
              
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={settings.darkMode ? controlButtonVariants : lightModeButtonVariants}
                className="p-3 text-white/70 dark:text-white/70 light:text-purple-700 hover:text-white dark:hover:text-white light:hover:text-purple-900 cursor-pointer"
                onClick={skipNext}
              >
                <SkipForward size={28} />
              </motion.button>
              
              <motion.button
                whileHover="hover"
                whileTap="tap"
                variants={settings.darkMode ? controlButtonVariants : lightModeButtonVariants}
                className={`p-3 text-white/70 dark:text-white/70 light:text-purple-700 hover:text-white dark:hover:text-white light:hover:text-purple-900 cursor-pointer ${isRepeatOn ? 'text-purple-400 dark:text-purple-400 light:text-purple-600' : ''}`}
                onClick={toggleRepeat}
              >
                <Repeat size={24} />
              </motion.button>
            </motion.div>
            
            {/* Volume control */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={fadeInVariants}
              custom={5}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white/70 dark:text-white/70 light:text-purple-700 hover:text-white dark:hover:text-white light:hover:text-purple-900 cursor-pointer"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </motion.button>
              
              <div 
                className="flex-1 h-1.5 bg-white/10 dark:bg-white/10 light:bg-purple-100/30 rounded-full overflow-hidden cursor-pointer"
                onClick={handleVolumeClick}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-400 dark:from-purple-500 dark:to-pink-400 light:from-purple-600 light:to-pink-600"
                  style={{ width: isMuted ? "0%" : `${volume}%` }}
                  layoutId="volumeBar"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white/70 dark:text-white/70 light:text-purple-700 hover:text-white dark:hover:text-white light:hover:text-purple-900 cursor-pointer"
                onClick={goToSettings}
              >
                <Settings size={20} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Back/Minimize button */}
      <motion.button
        className="fixed top-6 left-6 z-50 p-3 rounded-full bg-white/10 dark:bg-white/10 light:bg-purple-100/20 backdrop-blur-md 
                 border border-white/20 dark:border-white/20 light:border-purple-200/30 shadow-lg 
                 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-purple-100/30 transition-all cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        onClick={handleBackClick}
      >
        <ArrowLeft size={24} className="text-white dark:text-white light:text-purple-900" />
      </motion.button>
    </motion.div>
  );
} 