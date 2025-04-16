"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  Volume2,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useSettings } from "@/lib/settings-context";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { user, setUser } = useAuth();
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [visualizerEnabled, setVisualizerEnabled] = useState(settings.visualizerEnabled);
  const [volume, setVolume] = useState(settings.volume);
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when settings change
  useEffect(() => {
    setDarkMode(settings.darkMode);
    setVisualizerEnabled(settings.visualizerEnabled);
    setVolume(settings.volume);
  }, [settings]);

  // Update local state when user changes
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // Handle save settings
  const handleSave = () => {
    setIsSaving(true);
    
    // Update app settings
    updateSettings({
      darkMode,
      visualizerEnabled,
      volume
    });
    
    // Update user name if changed
    if (user?.name !== name && name.trim() !== "") {
      setUser(name);
    }
    
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  // Reset settings to defaults
  const handleReset = () => {
    resetSettings();
    setDarkMode(true);
    setVisualizerEnabled(true);
    setVolume(80);
  };

  // Re-onboard (go to home page)
  const handleReOnboard = () => {
    router.push("/");
  };

  // Staggered animation for each element
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen w-full py-12 flex flex-col items-center justify-center px-4">
      {/* Background with gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-50 via-pink-50/20 to-white dark:from-zinc-900 dark:via-purple-900/20 dark:to-zinc-900" />
      
      <motion.div
        className="w-full max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Settings</h1>
          <p className="text-zinc-600 dark:text-white/70">Customize your music experience</p>
        </motion.div>

        {/* Settings Card */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-xl bg-white/30 dark:bg-black/30 border-black/10 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-white">Application Settings</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-white/70">Configure your preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Theme Toggle */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  )}
                  <div>
                    <Label htmlFor="theme-mode" className="text-base text-zinc-900 dark:text-white">
                      Theme Mode
                    </Label>
                    <p className="text-sm text-zinc-600 dark:text-white/70">
                      {darkMode ? "Dark mode enabled" : "Light mode enabled"}
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              {/* Visualizer Toggle */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  {visualizerEnabled ? (
                    <Eye className="h-5 w-5 text-purple-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-zinc-400" />
                  )}
                  <div>
                    <Label htmlFor="visualizer" className="text-base text-zinc-900 dark:text-white">
                      Audio Visualizer
                    </Label>
                    <p className="text-sm text-zinc-600 dark:text-white/70">
                      {visualizerEnabled
                        ? "Show visualizer animations"
                        : "Hide visualizer animations"}
                    </p>
                  </div>
                </div>
                <Switch
                  id="visualizer"
                  checked={visualizerEnabled}
                  onCheckedChange={setVisualizerEnabled}
                />
              </div>

              {/* Volume Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <Volume2 className="h-5 w-5 text-green-400" />
                    <Label htmlFor="volume" className="text-base text-zinc-900 dark:text-white">
                      Default Volume
                    </Label>
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-white/70">
                    {volume}%
                  </span>
                </div>
                <Slider
                  id="volume"
                  min={0}
                  max={100}
                  step={1}
                  value={[volume]}
                  onValueChange={([value]) => setVolume(value)}
                  className="[&_[role=slider]]:bg-purple-600"
                />
              </div>

              {/* User Name Input */}
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <User className="h-5 w-5 text-purple-400" />
                  <Label htmlFor="name" className="text-base text-zinc-900 dark:text-white">
                    Display Name
                  </Label>
                </div>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 dark:bg-black/10 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-white/50"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="bg-white/10 dark:bg-black/10 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReOnboard}
                  className="bg-white/10 dark:bg-black/10 border-black/10 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Re-onboard
                </Button>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Back Button */}
        <motion.div
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Back to Player
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
} 