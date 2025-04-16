"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/lib/auth-context";
import { Suspense } from "react";

// Dynamically import components that use browser APIs
const AppLayout = dynamic(() => import("@/components/AppLayout"), {
  ssr: false,
  loading: () => <LoadingAnimation />
});

const HomeContent = dynamic(() => import("@/components/HomeContent"), {
  ssr: false,
  loading: () => <LoadingAnimation />
});

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation text="Loading your music..." />
      </div>
    );
  }

  // Protect the page from unauthorized access
  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <Suspense fallback={<LoadingAnimation />}>
        <HomeContent />
      </Suspense>
    </AppLayout>
  );
} 