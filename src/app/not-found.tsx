"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues with framer-motion
const NotFoundContent = dynamic(() => Promise.resolve(() => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Static background */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-purple-900/20 to-zinc-900 -z-10" />
      
      {/* 404 content */}
      <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 max-w-lg w-full text-center relative z-10">
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>
        
        <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
          404
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
          We can't find that track
        </h2>
        
        <p className="text-white/70 mb-8">
          The page you're looking for is still being mastered. Check back soon or return to your playlist.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-white/10 hover:bg-white/10 px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}), { ssr: false });

// Simple loading fallback for server-side
export default function NotFound() {
  return <NotFoundContent />;
} 