"use client";

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Background from './Background';
import PageTransition from './PageTransition';
import { useAuth } from '@/lib/auth-context';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen relative">
      <Background />
      
      {/* Sidebar */}
      <Sidebar className="fixed" />
      
      {/* Main Content with sidebar margin */}
      <PageTransition className="flex-1 lg:ml-[240px] pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user?.name || 'Friend'}
            </h1>
            <p className="text-white/70 mt-1">Explore your music universe</p>
          </header>
          
          {children}
        </div>
      </PageTransition>
    </div>
  );
} 