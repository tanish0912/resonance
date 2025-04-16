"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, Pause, Search, ChevronRight, Heart, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useSettings } from '@/lib/settings-context';

// Mock data for categories and playlists
const categories = [
  { id: 1, name: 'Classic', icon: '🎻' },
  { id: 2, name: '90s', icon: '💿' },
  { id: 3, name: 'New', icon: '🎵' },
  { id: 4, name: 'Instrumental', icon: '🎹' },
  { id: 5, name: 'Modern', icon: '🎧' },
];

const recentPlaylists = [
  {
    id: 1,
    title: 'Daily Chaos',
    artist: 'Eren Brown',
    cover: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 2,
    title: 'Simple Things',
    artist: 'Sarah Parker',
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 3,
    title: 'Not so good',
    artist: 'Steve Thompson',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
];

const favoritePlaylists = [
  {
    id: 1,
    title: 'Best of Eren',
    songCount: 32,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 2,
    title: 'Best of Eren',
    songCount: 32,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
];

export default function HomeContent() {
  const router = useRouter();
  const { settings } = useSettings();
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rotation, setRotation] = useState(0);

  const playSong = (song: any) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const goToPlayer = () => {
    router.push('/player');
  };

  return (
    <div className="w-full min-h-screen p-6 space-y-8">
      {/* Search and Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-96">
          <Input
            type="text"
            placeholder="Search for songs, artists..."
            className="pl-10 pr-4 py-2 bg-white/5 dark:bg-white/5 light:bg-black/5 border-none rounded-xl backdrop-blur-xl"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-white/40 light:text-black/40" size={18} />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Featured Player Section */}
        <div className="col-span-6 space-y-6">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-zinc-800 light:from-zinc-100 light:to-white p-8">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Album Art Turntable */}
            <div className="relative z-10">
              <motion.div 
                className="w-full aspect-square rounded-full overflow-hidden shadow-2xl"
                animate={{ rotate: isPlaying ? rotation + 360 : rotation }}
                onAnimationComplete={() => {
                  if (isPlaying) {
                    setRotation(prev => prev + 360);
                  }
                }}
                transition={{
                  duration: 12,
                  ease: "linear",
                }}
              >
                {currentSong ? (
                  <img 
                    src={currentSong.cover} 
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 dark:bg-zinc-800 light:bg-white flex items-center justify-center">
                    <span className="text-4xl">🎵</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/6 h-1/6 rounded-full bg-zinc-900 dark:bg-zinc-900 light:bg-zinc-100 border-4 border-zinc-700 dark:border-zinc-700 light:border-zinc-300" />
                </div>
              </motion.div>
            </div>

            {/* Track Info */}
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white dark:text-white light:text-zinc-900">
                    {currentSong ? currentSong.title : 'Select a song'}
                  </h2>
                  <p className="text-white/60 dark:text-white/60 light:text-zinc-600">
                    {currentSong ? currentSong.artist : 'No artist'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className="rounded-full hover:bg-white/10"
                >
                  <Heart 
                    size={20} 
                    className={`${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white/60'}`}
                  />
                </Button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white/60 dark:text-white/60 light:text-zinc-600">1:54</span>
                  <div className="w-32 h-1 bg-white/20 dark:bg-white/20 light:bg-black/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      animate={{ width: isPlaying ? "100%" : "0%" }}
                      transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                        paused: !isPlaying
                      }}
                    />
                  </div>
                  <span className="text-sm text-white/60 dark:text-white/60 light:text-zinc-600">3:35</span>
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="rounded-full bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-black/20"
                  disabled={!currentSong}
                >
                  {isPlaying ? (
                    <Pause size={20} className="text-white dark:text-white light:text-zinc-900" />
                  ) : (
                    <Play size={20} className="text-white dark:text-white light:text-zinc-900 ml-0.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories and Playlists Section */}
        <div className="col-span-6 space-y-8">
          {/* Music Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white light:text-zinc-900">Music Categories</h2>
              <Button variant="ghost" className="text-sm text-zinc-500 dark:text-white/60 light:text-zinc-600">
                View all
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  className="px-4 py-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-xl hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors flex flex-col items-center space-y-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white light:text-zinc-900">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Playlists */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white light:text-zinc-900">Recent Playlists</h2>
              <Button variant="ghost" className="text-sm text-zinc-500 dark:text-white/60 light:text-zinc-600">
                View all
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {recentPlaylists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => playSong(playlist)}
                >
                  <img
                    src={playlist.cover}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSong(playlist);
                        }}
                      >
                        <Play size={18} className="text-white ml-0.5" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{playlist.title}</h3>
                      <p className="text-white/60 text-sm">{playlist.artist}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Favorite Playlists */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white light:text-zinc-900">Favorite Playlists (4)</h2>
            </div>
            <div className="space-y-3">
              {favoritePlaylists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  className="flex items-center space-x-4 p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-xl hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => playSong(playlist)}
                >
                  <img
                    src={playlist.cover}
                    alt={playlist.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-white light:text-zinc-900">{playlist.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-white/60 light:text-zinc-600">{playlist.songCount} songs in this list</p>
                  </div>
                  <Button 
                    variant="ghost"
                    size="icon"
                    className="ml-auto rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(playlist);
                    }}
                  >
                    <Play size={18} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Player Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <Button
          variant="default"
          size="lg"
          onClick={goToPlayer}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Music2 size={24} className="text-white" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
} 