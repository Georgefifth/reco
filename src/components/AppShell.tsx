"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { getProfile } from "@/lib/db";
import type { UserProfile } from "@/lib/types";

// Hook used across pages to load the profile and decide whether to
// redirect to onboarding.
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);
  useEffect(() => {
    getProfile().then((p) => setProfile(p ?? null));
  }, []);
  return { profile, setProfile };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <footer className="border-t border-[var(--color-line)] px-4 py-6 text-center text-xs text-[var(--color-muted)]">
        <p>
          ReCo is a recovery companion, not a medical device. It does not diagnose or replace
          professional care. In an emergency, call 911.
        </p>
      </footer>
    </>
  );
}
