"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lightning, ArrowRight } from "@phosphor-icons/react";
import { useAuraStore } from "@/stores/aura-store";
import { createClient } from "@/lib/supabase/client";
import type { DemoPersona } from "@/types";
import { DEMO_USERS } from "@/lib/mock-data/users";

const PERSONAS: { id: DemoPersona; label: string; tagline: string }[] = [
  { id: "maya", label: "Maya", tagline: "18,420 Aura · Level 6 · 7d streak" },
  { id: "arjun", label: "Arjun", tagline: "24,360 Aura · Level 7 · 12d streak" },
  { id: "zoe", label: "Zoe", tagline: "11,250 Aura · Level 5 · 4d streak" },
];

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

export default function WelcomePage() {
  const router = useRouter();
  const { setPersona } = useAuraStore();
  const [selected, setSelected] = useState<DemoPersona>("maya");
  const [entering, setEntering] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  // Redirect already-authenticated users straight to the feed
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/feed");
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    // Page navigates away; no need to reset state
  };

  const handleDemo = async () => {
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
          <p className="text-muted-foreground text-sm">Do good. Build Aura.</p>
        </motion.div>

        {/* Aura score halo */}
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
          <h2 className="text-2xl font-black mb-2 leading-tight">Positive actions, visible momentum.</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Share good moments, earn Aura from friends, and climb the leaderboard.
          </p>
        </motion.div>

        {/* Google sign-in — primary CTA */}
        {SUPABASE_CONFIGURED && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mb-4"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 bg-foreground text-background font-semibold py-4 rounded-2xl text-sm tap-target transition-all disabled:opacity-60"
            >
              {signingIn ? (
                <span>Redirecting to Google...</span>
              ) : (
                <>
                  {/* Google "G" logo */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-muted-foreground">
            {SUPABASE_CONFIGURED ? "or explore the demo" : "Choose your demo persona"}
          </span>
          <div className="flex-1 h-px bg-border/60" />
        </motion.div>

        {/* Persona picker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
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

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56 }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleDemo}
            disabled={entering}
            className={`w-full font-semibold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 tap-target transition-all disabled:opacity-70 ${
              SUPABASE_CONFIGURED
                ? "border-2 border-border/60 text-foreground hover:border-primary/40 hover:text-primary"
                : "bg-primary text-primary-foreground aura-glow-sm"
            }`}
          >
            <AnimatePresence mode="wait">
              {entering ? (
                <motion.span key="entering" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Entering AuraIT...
                </motion.span>
              ) : (
                <motion.span key="enter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  {SUPABASE_CONFIGURED ? "Try demo" : "Enter AuraIT"}
                  <ArrowRight size={16} weight="bold" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
