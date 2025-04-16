"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import LoadingAnimation from "./LoadingAnimation";

interface AuthenticatedContentProps {
  children: ReactNode;
}

export default function AuthenticatedContent({ children }: AuthenticatedContentProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation text="Loading your music..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 