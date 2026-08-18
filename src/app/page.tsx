"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lightning, ArrowRight } from "@phosphor-icons/react";
import { useAuraStore } from "@/stores/aura-store";
import type { DemoPersona } from "@/types";
import { DEMO_USERS } from "@/lib/mock-data/users";

const PERSONAS: { id: DemoPersona; label: string; tagline: string }[] = [
  { id: "maya", label: "Maya", tagline: "18,420 Aura · Level 6 · 7d streak" },
  { id: "arjun", label: "Arjun", tagline: "24,360 Aura · Level 7 · 12d streak" },
  { id: "zoe", label: "Zoe", tagline: "11,250 Aura · Level 5 · 4d streak" },
];

export default function WelcomePage() {
  const router = useRouter();
  const { setPersona } = useAuraStore();
  const [selected, setSelected] = useState<DemoPersona>("maya");
  const [entering, setEntering] = useState(false);

  const handleEnter = async () => {
    setEntering(true);
    setPersona(selected);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(65% 0.24 290), transparent)" }}
        />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-black aura-gradient-text mb-2 tracking-tight">AuraIT</h1>
          <p className="text-muted-foreground text-sm">Demo experience</p>
        </motion.div>

        {/* Aura score visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                background: "radial-gradient(circle, oklch(65% 0.24 290) 0%, transparent 70%)",
                width: 160,
                height: 160,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <Lightning size={40} weight="fill" className="text-primary" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-4xl font-black aura-gradient-text tabular-nums">
              {DEMO_USERS[selected].auraScore.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Aura</p>
          </div>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-black mb-2 leading-tight">Do good. Build Aura.</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AuraIT turns everyday positive actions into visible social momentum. Share good moments, gain Aura from friends, and climb the leaderboard.
          </p>
        </motion.div>

        {/* Persona picker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-xs text-muted-foreground text-center mb-3">Choose your demo persona</p>
          <div className="flex gap-2">
            {PERSONAS.map((persona) => {
              const user = DEMO_USERS[persona.id];
              return (
                <button
                  key={persona.id}
                  onClick={() => setSelected(persona.id)}
                  className={`flex-1 flex flex-col items-center p-3 rounded-2xl border-2 transition-all tap-target ${
                    selected === persona.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted mb-2">
                    {user.avatarUrl && (
                      <Image src={user.avatarUrl} alt={persona.label} fill className="object-cover" />
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${selected === persona.id ? "text-primary" : ""}`}>
                    {persona.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight">
                    {persona.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleEnter}
            disabled={entering}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-base flex items-center justify-center gap-2 tap-target aura-glow-sm transition-all disabled:opacity-70"
          >
            <AnimatePresence mode="wait">
              {entering ? (
                <motion.span key="entering" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Entering AuraIT...
                </motion.span>
              ) : (
                <motion.span key="enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  Enter AuraIT <ArrowRight size={18} weight="bold" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
