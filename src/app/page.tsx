"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Background from "@/components/Background";
import Onboarding from "@/components/Onboarding";
import Welcome from "@/components/Welcome";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Avoid hydration mismatch by only showing content after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <Background />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingAnimation key="loading" text="Setting up your experience..." />
        ) : user ? (
          <Welcome key="welcome" />
        ) : (
          <Onboarding key="onboarding" />
        )}
      </AnimatePresence>
    </main>
  );
}
