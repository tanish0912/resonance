"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import LoadingAnimation from "@/components/LoadingAnimation";
import type { ComponentType, ReactNode } from 'react';

// Dynamically import components that use browser APIs
const AppLayout = dynamic(() => import("@/components/AppLayout"), {
  ssr: false,
  loading: () => <LoadingAnimation />
});

const HomeContent = dynamic(() => import("@/components/HomeContent"), {
  ssr: false,
  loading: () => <LoadingAnimation />
});

const AuthenticatedContent: ComponentType<{ children: ReactNode }> = dynamic(() => import("@/components/AuthenticatedContent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingAnimation text="Loading your music..." />
    </div>
  )
});

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <AuthenticatedContent>
        <AppLayout>
          <HomeContent />
        </AppLayout>
      </AuthenticatedContent>
    </Suspense>
  );
} 