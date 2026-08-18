"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuraStore } from "@/stores/aura-store";
import { getAuraLevel } from "@/lib/constants/aura";
import type { Database } from "@/lib/supabase/types";
import type { UserProfile } from "@/types";

type DbProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

function buildUserProfile(profile: DbProfile, avatarFallback?: string): UserProfile {
  const auraScore = profile.aura_score ?? 0;
  const auraLevel = getAuraLevel(auraScore);

  return {
    id: profile.id,
    displayName: profile.display_name,
    username: profile.username,
    bio: profile.bio ?? "",
    avatarUrl: profile.avatar_url ?? avatarFallback ?? "",
    city: profile.city ?? "",
    country: profile.country ?? "",
    auraScore,
    auraLevel,
    streakCurrent: profile.streak_current ?? 0,
    streakLongest: profile.streak_best ?? 0,
    weeklyAuraGain: 0,
    privacySettings: {
      defaultVisibility: "friends",
      publicProfile: true,
      leaderboardParticipation: true,
      locationLeaderboard: true,
      friendRequests: "everyone",
    },
    createdAt: profile.created_at,
    friendCount: 0,
    momentCount: 0,
    completedChallenges: 0,
    rankAmongFriends: profile.rank_friends ?? 0,
    cityPercentile: profile.city_percentile ?? 100,
  };
}

export function AuthSync() {
  const { setRealUser } = useAuraStore();

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;

    const supabase = createClient();

    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      const profile = data as DbProfile | null;
      if (!profile) return;

      const avatarFallback = session.user.user_metadata?.avatar_url as string | undefined;
      setRealUser(buildUserProfile(profile, avatarFallback));
    };

    syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      syncUser();
    });

    return () => subscription.unsubscribe();
  }, [setRealUser]);

  return null;
}
