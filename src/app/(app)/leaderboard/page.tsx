"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { TrendUp, TrendDown, Minus, Lightning, Fire } from "@phosphor-icons/react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { formatAura } from "@/lib/utils/format";
import type { LeaderboardScope, LeaderboardTimeRange } from "@/types";

const SCOPE_TABS: { id: LeaderboardScope; label: string }[] = [
  { id: "friends", label: "Friends" },
  { id: "nearby", label: "Nearby" },
  { id: "locality", label: "Koramangala" },
  { id: "city", label: "Bengaluru" },
  { id: "country", label: "India" },
  { id: "global", label: "Global" },
];

const TIME_TABS: { id: LeaderboardTimeRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "all_time", label: "All time" },
];

export default function LeaderboardPage() {
  const { currentUser } = useAuraStore();
  const { activeLeaderboardScope, activeLeaderboardTime, setLeaderboardScope, setLeaderboardTime } = useUIStore();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["leaderboard", activeLeaderboardScope, activeLeaderboardTime],
    queryFn: () =>
      mockApi.getLeaderboard(
        activeLeaderboardScope as LeaderboardScope,
        activeLeaderboardTime as LeaderboardTimeRange
      ),
  });

  const currentUserEntry = entries?.find((e) => e.isCurrentUser);

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3">
        <h1 className="text-xl font-black aura-gradient-text">Leaderboards</h1>
      </header>

      {/* Scope tabs */}
      <div className="px-4 py-3 overflow-x-auto border-b border-border/40">
        <div className="flex gap-2 min-w-max">
          {SCOPE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLeaderboardScope(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap tap-target",
                activeLeaderboardScope === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time tabs */}
      <div className="px-4 py-3 overflow-x-auto border-b border-border/40">
        <div className="flex gap-2">
          {TIME_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLeaderboardTime(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors tap-target",
                activeLeaderboardTime === tab.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current user sticky banner */}
      {currentUserEntry && currentUserEntry.rank > 3 && (
        <div className="px-4 py-2 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-primary">#{currentUserEntry.rank}</span>
            <span className="text-sm font-medium">{currentUser.displayName}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {formatAura(currentUserEntry.auraGained)} this {activeLeaderboardTime === "week" ? "week" : "period"}
            </span>
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-2">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-xl animate-shimmer" />
            ))}
          </div>
        )}

        {!isLoading && !entries?.length && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No rankings yet for this view.
          </div>
        )}

        {entries?.map((entry, i) => (
          <motion.div
            key={entry.user.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl",
              entry.isCurrentUser
                ? "bg-primary/10 border border-primary/20"
                : "bg-card border border-border/50",
              entry.rank <= 3 ? "shadow-sm" : ""
            )}
          >
            {/* Rank */}
            <div className="w-7 text-center">
              {entry.rank === 1 ? (
                <span className="text-lg">🥇</span>
              ) : entry.rank === 2 ? (
                <span className="text-lg">🥈</span>
              ) : entry.rank === 3 ? (
                <span className="text-lg">🥉</span>
              ) : (
                <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
              )}
            </div>

            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {entry.user.avatarUrl ? (
                <Image src={entry.user.avatarUrl} alt={entry.user.displayName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                  {entry.user.displayName[0]}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={cn("text-sm font-semibold truncate", entry.isCurrentUser && "text-primary")}>
                  {entry.user.displayName}
                  {entry.isCurrentUser && " (you)"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Fire size={10} />
                  {entry.streak}d
                </span>
                {entry.percentile && activeLeaderboardScope !== "friends" && (
                  <span>Top {entry.percentile}%</span>
                )}
              </div>
            </div>

            {/* Aura + Movement */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 text-sm font-bold justify-end">
                <Lightning size={12} weight="fill" className="text-primary" />
                {formatAura(entry.auraGained)}
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-xs justify-end",
                entry.movement > 0 ? "text-emerald-500" : entry.movement < 0 ? "text-red-500" : "text-muted-foreground"
              )}>
                {entry.movement > 0 ? (
                  <><TrendUp size={10} />↑{entry.movement}</>
                ) : entry.movement < 0 ? (
                  <><TrendDown size={10} />↓{Math.abs(entry.movement)}</>
                ) : (
                  <><Minus size={10} />—</>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
