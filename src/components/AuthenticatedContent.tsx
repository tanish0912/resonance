"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import LoadingAnimation from "./LoadingAnimation";

export default function AuthenticatedContent({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation text="Loading your music..." />
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return <>{children}</>;
} 