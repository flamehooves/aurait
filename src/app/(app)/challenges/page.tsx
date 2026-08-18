"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Lightning, Users, Lock } from "@phosphor-icons/react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/states/empty-state";
import type { ChallengeDifficulty } from "@/types";

const DIFF_COLORS: Record<ChallengeDifficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Legendary: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
};

export default function ChallengesPage() {
  const { currentUser, streakCurrent } = useAuraStore();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: mockApi.getChallenges,
  });

  const { data: progressList } = useQuery({
    queryKey: ["challenge-progress", currentUser.id],
    queryFn: () => mockApi.getChallengeProgress(currentUser.id),
  });

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3">
        <h1 className="text-xl font-black aura-gradient-text">Challenges</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Build Aura with optional goals</p>
      </header>

      <div className="px-4 py-4">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl animate-shimmer" />)}
          </div>
        )}

        {!isLoading && challenges?.length === 0 && (
          <EmptyState
            title="You've completed everything here. That's a lot of Aura."
            ctaLabel="See completed challenges"
            ctaHref="/profile"
          />
        )}

        <div className="space-y-3">
          {challenges?.map((challenge, i) => {
            const progress = progressList?.find((p) => p.challengeId === challenge.id);
            const isCompleted = progress?.status === "completed";
            const isInProgress = progress?.status === "in_progress";
            const locked = challenge.streakRequirement && challenge.streakRequirement > streakCurrent;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/challenges/${challenge.id}`}>
                  <div
                    className={cn(
                      "bg-card rounded-2xl p-4 border transition-all",
                      isCompleted
                        ? "border-primary/30 bg-primary/5"
                        : locked
                        ? "border-border/30 opacity-60"
                        : "border-border/50 hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-full border",
                              DIFF_COLORS[challenge.difficulty]
                            )}
                          >
                            {challenge.difficulty}
                          </span>
                          {isCompleted && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              ✓ Completed
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                              In progress
                            </span>
                          )}
                          {locked && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Lock size={10} />
                              {challenge.streakRequirement}d streak required
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{challenge.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{challenge.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-sm font-bold text-primary">
                          <Lightning size={14} weight="fill" />
                          +{challenge.auraReward.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{challenge.participantCount.toLocaleString()}</span>
                      </div>
                      {challenge.friendParticipants.length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            {challenge.friendParticipants.slice(0, 3).map((f) => (
                              <div
                                key={f.id}
                                className="w-4 h-4 rounded-full overflow-hidden bg-muted ring-1 ring-card"
                              >
                                {f.avatarUrl && (
                                  <Image src={f.avatarUrl} alt={f.displayName} width={16} height={16} className="object-cover" />
                                )}
                              </div>
                            ))}
                          </div>
                          <span>
                            {challenge.friendParticipants.length} friend{challenge.friendParticipants.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
