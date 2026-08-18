"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lightning, Fire, UserPlus, Check } from "@phosphor-icons/react";
import { useState } from "react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { AuraMomentCard } from "@/components/feed/aura-moment-card";
import { formatAura, formatStreak } from "@/lib/utils/format";

export default function FriendProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentUser } = useAuraStore();
  const [following, setFollowing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => mockApi.getUserProfile(id),
  });

  const { data: moments } = useQuery({
    queryKey: ["user-moments", id],
    queryFn: () => mockApi.getUserMoments(id),
    enabled: !!profile,
  });

  if (isLoading || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="h-24 rounded-2xl animate-shimmer" />
        <div className="h-32 rounded-2xl animate-shimmer" />
      </div>
    );
  }

  const level = profile.auraLevel;

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link href="/friends" className="tap-target">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold truncate">{profile.displayName}</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setFollowing(!following)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tap-target transition-colors ${
            following ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"
          }`}
        >
          {following ? <><Check size={12} />Friends</> : <><UserPlus size={12} />Add friend</>}
        </motion.button>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Profile header */}
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted ring-2 ring-primary/20">
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={profile.displayName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                {profile.displayName[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black">{profile.displayName}</h2>
            <p className="text-sm text-muted-foreground">{profile.username}</p>
            {profile.bio && <p className="text-sm mt-1">{profile.bio}</p>}
            <p className="text-xs text-muted-foreground mt-1">{profile.city}, {profile.country}</p>
          </div>
        </div>

        {/* Aura stats */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-5">
          <div className="text-center mb-4">
            <p className="text-4xl font-black aura-gradient-text">{formatAura(profile.auraScore)}</p>
            <p className="text-sm text-muted-foreground">Aura</p>
            <div
              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: `${level.color}20`, color: level.color }}
            >
              Level {level.level} — {level.name}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-black flex items-center justify-center gap-1">
                <Fire size={16} className="text-orange-400" />
                {profile.streakCurrent}
              </p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black">#{profile.rankAmongFriends}</p>
              <p className="text-xs text-muted-foreground">Friends rank</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black">Top {profile.cityPercentile}%</p>
              <p className="text-xs text-muted-foreground">{profile.city}</p>
            </div>
          </div>
        </div>

        {/* Recent moments */}
        <div>
          <h2 className="font-semibold mb-3">Recent Aura moments</h2>
          <div className="space-y-4">
            {moments?.slice(0, 4).map((moment) => (
              <AuraMomentCard key={moment.id} moment={moment} />
            ))}
            {(!moments || moments.length === 0) && (
              <p className="text-sm text-muted-foreground">No moments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
