"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Camera, Image as ImageIcon, TextT, ArrowLeft, ArrowRight,
  Globe, Users, UserCircle, Lock, Lightning, Check
} from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/lib/mock-api";
import { useAuraStore } from "@/stores/aura-store";
import { useComposerStore } from "@/stores/composer-store";
import { AURA_CARDS } from "@/lib/constants/aura";
import { cn } from "@/lib/utils";
import type { MomentVisibility } from "@/types";

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=600&fit=crop",
];

const VISIBILITY_OPTIONS: { id: MomentVisibility; label: string; icon: React.ReactNode }[] = [
  { id: "friends", label: "Friends", icon: <Users size={14} /> },
  { id: "close_friends", label: "Close Friends", icon: <UserCircle size={14} /> },
  { id: "public", label: "Public", icon: <Globe size={14} /> },
  { id: "only_me", label: "Only Me", icon: <Lock size={14} /> },
];

const CARD_STYLES: Record<string, string> = {
  minimal: "bg-black/70 text-white font-light italic",
  bold: "bg-violet-600 text-white font-black uppercase tracking-wider",
  gradient: "bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-semibold",
  contrast: "bg-white text-black font-black",
  soft: "bg-white/90 text-gray-800 font-medium italic",
  playful: "bg-yellow-400 text-yellow-900 font-bold",
  dark: "bg-gray-900 text-white font-semibold border border-white/20",
  clean: "bg-white/90 text-gray-900 font-medium",
  warm: "bg-amber-500 text-white font-semibold",
  premium: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-black",
};

type Step = "compose" | "card" | "confirm";

export default function CreatePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { currentUser, triggerCelebration } = useAuraStore();
  const composer = useComposerStore();
  const [step, setStep] = useState<Step>("compose");
  const [mode, setMode] = useState<"text" | "photo" | "camera">("text");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [published, setPublished] = useState(false);

  const publishMutation = useMutation({
    mutationFn: () =>
      mockApi.postMoment(currentUser.id, {
        caption: composer.caption,
        mediaUrl: composer.selectedMediaUrl ?? undefined,
        auraCardId: composer.selectedAuraCardId ?? undefined,
        auraCardText: composer.selectedAuraCardText ?? undefined,
        visibility: composer.visibility,
        challengeId: composer.challengeId ?? undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["user-moments"] });
      triggerCelebration(20);
      setPublished(true);
      setTimeout(() => {
        composer.reset();
        router.push("/feed");
      }, 2500);
    },
  });

  if (published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-8"
        >
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6 }} className="text-6xl mb-4">
            ✨
          </motion.div>
          <h2 className="text-2xl font-black mb-2 aura-gradient-text">Aura moment posted</h2>
          <p className="text-muted-foreground">+20 Aura gained</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-4 py-3 flex items-center gap-3">
        {step === "compose" ? (
          <button onClick={() => router.back()} className="tap-target text-muted-foreground">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <button onClick={() => setStep(step === "confirm" ? "card" : "compose")} className="tap-target text-muted-foreground">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="font-bold flex-1">
          {step === "compose" ? "What gave you Aura today?" : step === "card" ? "Add an Aura Card" : "Review moment"}
        </h1>
        {step === "compose" && composer.caption.trim() && (
          <button onClick={() => setStep("card")} className="text-primary font-semibold text-sm tap-target flex items-center gap-1">
            Next <ArrowRight size={14} />
          </button>
        )}
        {step === "card" && (
          <button onClick={() => setStep("confirm")} className="text-primary font-semibold text-sm tap-target flex items-center gap-1">
            Next <ArrowRight size={14} />
          </button>
        )}
      </header>

      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {/* Step 1: Compose */}
          {step === "compose" && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Mode picker */}
              <div className="flex gap-2">
                {[
                  { id: "text" as const, icon: <TextT size={16} />, label: "Text" },
                  { id: "photo" as const, icon: <ImageIcon size={16} />, label: "Photo" },
                  { id: "camera" as const, icon: <Camera size={16} />, label: "Camera" },
                ].map(({ id, icon, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setMode(id);
                      if (id === "photo") setShowImagePicker(true);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors tap-target",
                      mode === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Camera viewport (mock) */}
              {mode === "camera" && (
                <div
                  className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    const img = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
                    composer.setMedia(img);
                    setMode("photo");
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-50">Tap to capture</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Image picker */}
              {(mode === "photo" || showImagePicker) && !composer.selectedMediaUrl && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Choose a photo</p>
                  <div className="grid grid-cols-3 gap-2">
                    {MOCK_IMAGES.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          composer.setMedia(url);
                          setShowImagePicker(false);
                          setMode("photo");
                        }}
                        className="aspect-square rounded-xl overflow-hidden relative"
                      >
                        <Image src={url} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected image */}
              {composer.selectedMediaUrl && (
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image src={composer.selectedMediaUrl} alt="" fill className="object-cover" />
                  <button
                    onClick={() => composer.setMedia(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Caption */}
              <div className="relative">
                <textarea
                  value={composer.caption}
                  onChange={(e) => composer.setCaption(e.target.value)}
                  placeholder="Describe your good moment..."
                  rows={4}
                  className="w-full bg-muted rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                  {composer.caption.length}/280
                </span>
              </div>

              {/* Visibility */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Visible to</p>
                <div className="flex flex-wrap gap-2">
                  {VISIBILITY_OPTIONS.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => composer.setVisibility(id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors tap-target",
                        composer.visibility === id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Aura Card */}
          {step === "card" && (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">Choose an Aura Card overlay (optional)</p>

              <div className="space-y-3">
                {/* No card option */}
                <button
                  onClick={() => composer.setAuraCard(null, null)}
                  className={cn(
                    "w-full py-3 rounded-xl border text-sm font-medium transition-colors",
                    !composer.selectedAuraCardId
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  No card
                </button>

                {AURA_CARDS.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => composer.setAuraCard(card.id, card.text)}
                    className={cn(
                      "w-full py-4 px-5 rounded-xl border-2 text-center transition-all",
                      CARD_STYLES[card.variant],
                      composer.selectedAuraCardId === card.id ? "border-primary ring-2 ring-primary" : "border-transparent"
                    )}
                  >
                    {card.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-card rounded-2xl border border-border/50 p-4">
                <p className="text-sm leading-relaxed">{composer.caption}</p>
                {composer.selectedMediaUrl && (
                  <div className="relative mt-3 aspect-square rounded-xl overflow-hidden">
                    <Image src={composer.selectedMediaUrl} alt="" fill className="object-cover" />
                    {composer.selectedAuraCardId && (
                      <div className={cn("absolute bottom-2 left-2 right-2 py-2 px-3 rounded-lg text-sm text-center",
                        CARD_STYLES[AURA_CARDS.find(c => c.id === composer.selectedAuraCardId)?.variant ?? "clean"]
                      )}>
                        {composer.selectedAuraCardText}
                      </div>
                    )}
                  </div>
                )}
                {!composer.selectedMediaUrl && composer.selectedAuraCardId && (
                  <div className={cn("mt-3 py-3 px-4 rounded-xl text-sm text-center",
                    CARD_STYLES[AURA_CARDS.find(c => c.id === composer.selectedAuraCardId)?.variant ?? "clean"]
                  )}>
                    {composer.selectedAuraCardText}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                  <Lightning size={12} weight="fill" className="text-primary" />
                  <span>+20 Aura for posting</span>
                  <span className="ml-auto capitalize">{composer.visibility.replace("_", " ")}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending || !composer.caption.trim()}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-base transition-all tap-target",
                  "bg-primary text-primary-foreground disabled:opacity-50"
                )}
              >
                {publishMutation.isPending ? "Posting..." : "Post Aura moment"}
              </motion.button>

              <p className="text-center text-xs text-muted-foreground">
                Your moment will be visible to {composer.visibility.replace("_", " ")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
