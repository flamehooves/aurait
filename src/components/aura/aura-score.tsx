"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AuraScoreProps = {
  score: number;
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  showDelta?: boolean;
};

export function AuraScore({ score, animate = true, size = "md", className, showDelta }: AuraScoreProps) {
  const [displayScore, setDisplayScore] = useState(score);
  const prevScore = useRef(score);

  useEffect(() => {
    if (!animate || score === prevScore.current) {
      setDisplayScore(score);
      return;
    }

    const start = prevScore.current;
    const end = score;
    const duration = 800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prevScore.current = end;
    }

    requestAnimationFrame(tick);
  }, [score, animate]);

  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-black",
    hero: "text-6xl font-black tracking-tight",
  };

  return (
    <span className={cn(sizeClasses[size], "tabular-nums", className)}>
      {displayScore.toLocaleString()}
    </span>
  );
}

type AuraScoreHeroProps = {
  score: number;
  levelName: string;
  levelColor: string;
  weeklyGain: number;
  progressToNext: number;
  nextLevelName?: string;
  auraToNext?: number;
};

export function AuraScoreHero({
  score,
  levelName,
  levelColor,
  weeklyGain,
  progressToNext,
  nextLevelName,
  auraToNext,
}: AuraScoreHeroProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      {/* Halo */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${levelColor}40 0%, transparent 70%)`,
            width: 180,
            height: 180,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div className="relative z-10">
          <AuraScore score={score} size="hero" className="aura-gradient-text" />
          <p className="text-sm font-medium text-muted-foreground mt-1">Aura</p>
        </div>
      </div>

      {/* Level */}
      <div
        className="px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ background: `${levelColor}20`, color: levelColor }}
      >
        {levelName}
      </div>

      {/* Progress bar */}
      {nextLevelName && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>{levelName}</span>
            <span>{nextLevelName}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              style={{ background: levelColor }}
            />
          </div>
          {auraToNext && (
            <p className="text-xs text-muted-foreground mt-1.5 text-center">
              {auraToNext.toLocaleString()} Aura to {nextLevelName}
            </p>
          )}
        </div>
      )}

      {/* Weekly */}
      <p className="text-sm font-medium text-primary">+{weeklyGain.toLocaleString()} this week</p>
    </div>
  );
}
