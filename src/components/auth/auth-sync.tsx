"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuraStore } from "@/stores/aura-store";
import { getAuraLevel } from "@/lib/constants/aura";
import type { UserProfile } from "@/types";

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

export function AuthSync() {
  const { activePersona, setRealUser } = useAuraStore();

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;

    const supabase = createClient();

    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const authUser = session.user;

      // Fetch profile from user_profiles table
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (!profile) return;

      const auraScore = profile.aura_score ?? 0;
      const auraLevel = getAuraLevel(auraScore);

      const userProfile: UserProfile = {
        id: profile.id,
        userId: authUser.id,
        username: profile.username,
        displayName: profile.display_name,
        bio: profile.bio ?? undefined,
        avatarUrl:
          profile.avatar_url ??
          authUser.user_metadata?.avatar_url ??
          undefined,
        city: profile.city ?? undefined,
        country: profile.country ?? undefined,
        auraScore,
        auraLevel,
        streakCurrent: profile.streak_current ?? 0,
        streakBest: profile.streak_best ?? 0,
        rankAmongFriends: profile.rank_friends ?? 0,
        rankInCity: profile.rank_city ?? 0,
        cityPercentile: profile.city_percentile ?? 100,
        joinedAt: profile.created_at,
      };

      setRealUser(userProfile);
    };

    syncUser();

    // Keep in sync on auth state changes (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      syncUser();
    });

    return () => subscription.unsubscribe();
  }, [setRealUser]);

  return null;
}
