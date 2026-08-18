"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Lightning, Fire, Star, Trophy, PencilSimple, Share } from "@phosphor-icons/react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { AuraMomentCard } from "@/components/feed/aura-moment-card";
import { AuraScore } from "@/components/aura/aura-score";
import { formatAura, formatStreak } from "@/lib/utils/format";

const TABS = ["Moments", "Milestones", "Challenges"] as const;
type Tab = typeof TABS[number];

export default function ProfilePage() {
  const { currentUser, auraScore, streakCurrent } = useAuraStore();
  const [activeTab, setActiveTab] = useState<Tab>("Moments");

  const { data: moments } = useQuery({
    queryKey: ["user-moments", currentUser.id],
    queryFn: () => mockApi.getUserMoments(currentUser.id),
  });

  const { data: summary } = useQuery({
    queryKey: ["aura-summary", currentUser.id],
    queryFn: () => mockApi.getAuraSummary(currentUser.id),
  });

  const level = summary?.level ?? currentUser.auraLevel;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold">Profile</h1>
        <div className="flex items-center gap-2">
          <button className="tap-target text-muted-foreground hover:text-foreground">
            <Share size={20} />
          </button>
          <Link href="/settings" className="tap-target text-muted-foreground hover:text-foreground">
            <PencilSimple size={20} />
          </Link>
        </div>
      </header>

      {/* Profile info */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/30">
            {currentUser.avatarUrl ? (
              <Image src={currentUser.avatarUrl} alt={currentUser.displayName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                {currentUser.displayName[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black">{currentUser.displayName}</h2>
            <p className="text-sm text-muted-foreground">{currentUser.username}</p>
            <p className="text-sm mt-1">{currentUser.bio}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentUser.city}, {currentUser.country}</p>
          </div>
        </div>

        {/* Aura Hero */}
        <div className="mt-6 bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-5 text-center">
          <AuraScore score={auraScore} size="hero" className="aura-gradient-text" />
          <p className="text-sm text-muted-foreground mt-1">Aura</p>
          <div
            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${level.color}20`, color: level.color }}
          >
            Level {level.level} — {level.name}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-black">
              <Fire size={16} className="text-orange-400" />
              {streakCurrent}
            </div>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
            <div className="text-lg font-black">{currentUser.streakLongest}</div>
            <p className="text-xs text-muted-foreground">Best streak</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
            <div className="flex items-center justify-center gap-1 text-lg font-black text-primary">
              +{formatAura(summary?.weeklyGain ?? currentUser.weeklyAuraGain)}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>
        </div>

        {/* Rankings */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <p className="font-semibold text-foreground text-sm">#3 among friends</p>
            <p>Friend leaderboard</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/50">
            <p className="font-semibold text-foreground text-sm">Top 8% in Bengaluru</p>
            <p>City leaderboard</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <div className="flex px-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {activeTab === "Moments" && (
          <div className="space-y-4">
            {moments?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No moments yet. Share your first good deed.
              </div>
            )}
            {moments?.map((moment) => (
              <AuraMomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        )}

        {activeTab === "Milestones" && (
          <div className="space-y-3">
            {[
              { icon: "⚡", label: "First Aura moment", date: "Sep 2024" },
              { icon: "🔥", label: "3-day streak", date: "Sep 2024" },
              { icon: "✨", label: "Reached Level 3 — Glow", date: "Oct 2024" },
              { icon: "🌟", label: "7-day streak", date: "Nov 2024" },
              { icon: "💫", label: "Reached Level 6 — Luminous", date: "Jan 2025" },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border/50"
              >
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "Challenges" && (
          <div className="space-y-3">
            <Link href="/challenges">
              <div className="text-center py-4">
                <Trophy size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">View all challenges</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
