"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type AuraButtonProps = {
  auraCount: number;
  hasGiven: boolean;
  onGive: () => Promise<void>;
  onUndo?: () => Promise<void>;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

export function AuraButton({ auraCount, hasGiven, onGive, onUndo, disabled, size = "md" }: AuraButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const [count, setCount] = useState(auraCount);
  const [given, setGiven] = useState(hasGiven);
  const [delta, setDelta] = useState<number | null>(null);

  const handleGive = useCallback(async () => {
    if (given || disabled || isAnimating) return;
    setIsAnimating(true);
    setGiven(true);
    const gain = Math.floor(10 + Math.random() * 20);
    setCount((c) => c + gain);
    setDelta(gain);
    setParticles([...Array(6)].map((_, i) => i));
    setShowUndo(true);

    try {
      await onGive();
    } catch {
      setGiven(false);
      setCount((c) => c - gain);
    } finally {
      setIsAnimating(false);
      setTimeout(() => setDelta(null), 1200);
      setTimeout(() => setParticles([]), 800);
      setTimeout(() => setShowUndo(false), 4000);
    }
  }, [given, disabled, isAnimating, onGive]);

  const handleUndo = useCallback(async () => {
    if (!given || !onUndo) return;
    setShowUndo(false);
    setGiven(false);
    const gain = Math.floor(10 + Math.random() * 20);
    setCount((c) => Math.max(0, c - gain));
    await onUndo?.();
  }, [given, onUndo]);

  const sizeClasses = {
    sm: "gap-1.5 px-3 py-1.5 text-sm",
    md: "gap-2 px-4 py-2 text-sm",
    lg: "gap-2.5 px-5 py-2.5 text-base",
  };

  const iconSize = { sm: 16, md: 18, lg: 20 };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Particles */}
        <AnimatePresence>
          {particles.map((i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * (30 + Math.random() * 20),
                y: Math.sin((i / 6) * Math.PI * 2) * (30 + Math.random() * 20) - 10,
                opacity: 0,
                scale: 0.5,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: `oklch(${65 + i * 5}% 0.24 ${270 + i * 20})`,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Halo ring */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ background: "oklch(65% 0.24 290 / 0.3)" }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleGive}
          disabled={given || disabled}
          whileTap={!given ? { scale: 0.92 } : {}}
          whileHover={!given ? { scale: 1.04 } : {}}
          className={cn(
            "relative flex items-center rounded-full font-semibold transition-all tap-target",
            sizeClasses[size],
            given
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent"
          )}
          aria-label={given ? "Aura given" : "Give Aura"}
        >
          <motion.div
            animate={
              isAnimating
                ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1.1, 1] }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            <Lightning
              size={iconSize[size]}
              weight={given ? "fill" : "regular"}
              className={given ? "text-primary" : ""}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {count.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Delta badge */}
      <AnimatePresence>
        {delta !== null && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-bold text-primary"
          >
            +{delta} Aura
          </motion.span>
        )}
      </AnimatePresence>

      {/* Undo toast */}
      <AnimatePresence>
        {showUndo && onUndo && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleUndo}
            className="text-xs text-muted-foreground underline underline-offset-2 tap-target"
          >
            Undo
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
