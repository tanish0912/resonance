"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Music2, 
  PlayCircle, 
  Radio, 
  Disc3, 
  Heart, 
  History, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const navItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/dashboard', active: pathname === '/dashboard' },
    { icon: <Music2 size={20} />, label: 'Browse', path: '/browse', active: pathname === '/browse' },
    { icon: <PlayCircle size={20} />, label: 'Player', path: '/player', active: pathname === '/player' },
    { icon: <Radio size={20} />, label: 'Radio', path: '/radio', active: pathname === '/radio' },
    { icon: <Disc3 size={20} />, label: 'Albums', path: '/albums', active: pathname === '/albums' },
    { icon: <Heart size={20} />, label: 'Favorites', path: '/favorites', active: pathname === '/favorites' },
    { icon: <History size={20} />, label: 'History', path: '/history', active: pathname === '/history' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings', active: pathname === '/settings' },
  ];

  const sidebarVariants = {
    expanded: { width: '240px' },
    collapsed: { width: '80px' }
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden backdrop-blur-md bg-black/30 dark:bg-black/30 light:bg-white/30 rounded-full shadow-lg border border-white/10 dark:border-white/10 light:border-black/10 cursor-pointer"
      >
        <Menu size={24} />
      </Button>
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleMobileSidebar}
        />
      )}
      
      {/* Mobile Sidebar */}
      <motion.div
        className="fixed top-4 left-4 bottom-4 w-[240px] bg-black/50 dark:bg-black/50 light:bg-white/50 backdrop-blur-xl z-50 border border-white/10 dark:border-white/10 light:border-black/10 lg:hidden rounded-xl shadow-2xl overflow-hidden"
        variants={mobileSidebarVariants}
        initial="closed"
        animate={isMobileOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 flex justify-between items-center border-b border-white/10 dark:border-white/10 light:border-black/10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">{user ? user.name.charAt(0).toUpperCase() : 'R'}</span>
            </div>
            <span className="ml-3 font-semibold text-zinc-900 dark:text-white/60">{getGreeting()}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer">
            <X size={18} />
          </Button>
        </div>
        
        <div className="py-4">
          {user && (
            <div className="px-4 mb-6">
              <p className="text-sm text-zinc-600 dark:text-white/60">{getGreeting()}</p>
              <p className="font-medium text-zinc-900 dark:text-white truncate">{user.name}</p>
            </div>
          )}
          
          <div className="space-y-1 px-3">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start rounded-lg transition-all cursor-pointer ${item.active ? 'bg-white/15 dark:bg-white/15 light:bg-black/15 backdrop-blur-md' : 'hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10'}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Desktop Sidebar */}
      <motion.div 
        className={`hidden lg:block h-screen ${className}`}
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full backdrop-blur-xl bg-black/40 dark:bg-black/40 light:bg-white/40 border-r border-white/10 dark:border-white/10 light:border-black/10 flex flex-col m-3 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] relative overflow-hidden">
          {/* Inner highlight effect */}
          <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] light:shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] pointer-events-none"></div>
          
          {/* Logo */}
          <div className="p-4 flex items-center border-b border-white/10 dark:border-white/10 light:border-black/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold">{user ? user.name.charAt(0).toUpperCase() : 'R'}</span>
            </div>
            {!isCollapsed && (
              <motion.span 
                className="ml-3 font-semibold text-zinc-900 dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {getGreeting()}
              </motion.span>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className={`ml-auto rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer ${isCollapsed ? 'rotate-180' : ''}`}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-700 dark:text-white/70"
              >
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
          
          {/* User info */}
          {user && !isCollapsed && (
            <div className="px-4 py-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
              <p className="font-medium text-zinc-900 dark:text-white truncate">{user.name}</p>
            </div>
          )}
          
          {/* Navigation */}
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="space-y-1 px-3">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start rounded-lg transition-all cursor-pointer ${isCollapsed ? 'px-2' : ''} ${item.active ? 'bg-white/15 dark:bg-white/15 light:bg-black/15 backdrop-blur-md' : 'hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10'}`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className={isCollapsed ? '' : 'mr-3'}>{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              ))}
            </nav>
          </div>

          {/* Collapse/Expand Button */}
          <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className={`w-full rounded-lg hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 cursor-pointer ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`text-zinc-700 dark:text-white/70 ${isCollapsed ? 'rotate-180' : ''}`}
              >
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {!isCollapsed && <span className="ml-3">Collapse</span>}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
} 