"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lightning, Users, Star, CheckCircle } from "@phosphor-icons/react";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { ChallengeDifficulty } from "@/types";

const DIFF_COLORS: Record<ChallengeDifficulty, string> = {
  Easy: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Hard: "text-red-600 dark:text-red-400",
  Legendary: "text-violet-600 dark:text-violet-400",
};

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentUser, triggerCelebration } = useAuraStore();
  const [showCompletion, setShowCompletion] = useState(false);
  const qc = useQueryClient();

  const { data: challenge, isLoading } = useQuery({
    queryKey: ["challenge", id],
    queryFn: () => mockApi.getChallenge(id),
  });

  const { data: progressList } = useQuery({
    queryKey: ["challenge-progress", currentUser.id],
    queryFn: () => mockApi.getChallengeProgress(currentUser.id),
  });

  const progress = progressList?.find((p) => p.challengeId === id);

  const startMutation = useMutation({
    mutationFn: () => mockApi.startChallenge(id, currentUser.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["challenge-progress"] }),
  });

  const completeMutation = useMutation({
    mutationFn: () => mockApi.completeChallenge(id, currentUser.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["challenge-progress"] });
      if (challenge) {
        triggerCelebration(challenge.auraReward);
        setShowCompletion(true);
      }
    },
  });

  if (isLoading || !challenge) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="h-64 rounded-2xl animate-shimmer mb-4" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 rounded animate-shimmer" />
          <div className="h-4 w-full rounded animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link href="/challenges" className="tap-target">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold truncate">{challenge.title}</h1>
      </header>

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary/10 to-accent/30 h-48 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-2"
          >
            ⚡
          </motion.div>
          <div className="flex items-center gap-1 text-2xl font-black text-primary">
            <Lightning size={20} weight="fill" />
            +{challenge.auraReward.toLocaleString()} Aura
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <span className={cn("text-sm font-semibold", DIFF_COLORS[challenge.difficulty])}>
            {challenge.difficulty}
          </span>
          {challenge.streakRequirement && (
            <span className="text-sm text-muted-foreground">
              · {challenge.streakRequirement}-day streak required
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="font-semibold mb-2">The challenge</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{challenge.description}</p>
        </div>

        <div className="bg-muted rounded-xl p-4">
          <p className="text-sm font-medium">{challenge.task}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{challenge.participantCount.toLocaleString()} attempting</span>
          </div>
        </div>

        {/* Friend participants */}
        {challenge.friendParticipants.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 text-sm">Friends in this challenge</h2>
            <div className="flex flex-wrap gap-3">
              {challenge.friendParticipants.map((friend) => (
                <div key={friend.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                    {friend.avatarUrl && (
                      <Image src={friend.avatarUrl} alt={friend.displayName} width={32} height={32} className="object-cover" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{friend.displayName.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent completions */}
        {challenge.recentCompletions.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3 text-sm">Recently completed</h2>
            <div className="space-y-2">
              {challenge.recentCompletions.map(({ user, completedAt }) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                    {user.avatarUrl && (
                      <Image src={user.avatarUrl} alt={user.displayName} width={32} height={32} className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground ml-2">{formatRelativeTime(completedAt)}</span>
                  </div>
                  <CheckCircle size={16} weight="fill" className="text-primary" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="space-y-2">
          {!progress && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => startMutation.mutate()}
              disabled={startMutation.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl tap-target"
            >
              {startMutation.isPending ? "Starting..." : "Start challenge"}
            </motion.button>
          )}
          {progress?.status === "in_progress" && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl tap-target"
            >
              {completeMutation.isPending ? "Completing..." : "Mark as completed"}
            </motion.button>
          )}
          {progress?.status === "completed" && (
            <div className="w-full bg-primary/10 text-primary font-semibold py-3.5 rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle size={20} weight="fill" />
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
            onClick={() => setShowCompletion(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="text-center px-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8, repeat: 2 }}
                className="text-7xl mb-4"
              >
                ✨
              </motion.div>
              <h2 className="text-3xl font-black mb-2 aura-gradient-text">{challenge.title}</h2>
              <p className="text-muted-foreground mb-4">Challenge completed!</p>
              <div className="text-4xl font-black text-primary mb-6">
                +{challenge.auraReward.toLocaleString()} Aura
              </div>
              <button
                className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl"
                onClick={() => setShowCompletion(false)}
              >
                Keep going
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
