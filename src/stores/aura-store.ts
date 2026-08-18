"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemoPersona, UserProfile, AuraOpportunity } from "@/types";
import { DEMO_USERS } from "@/lib/mock-data/users";

type AuraStore = {
  activePersona: DemoPersona | "real";
  currentUser: UserProfile;
  auraScore: number;
  streakCurrent: number;
  celebratingAura: boolean;
  celebrationAmount: number;
  setPersona: (persona: DemoPersona) => void;
  setRealUser: (user: UserProfile) => void;
  incrementAura: (amount: number) => void;
  triggerCelebration: (amount: number) => void;
  dismissCelebration: () => void;
  updateStreak: (days: number) => void;
};

export const useAuraStore = create<AuraStore>()(
  persist(
    (set, get) => ({
      activePersona: "maya",
      currentUser: DEMO_USERS.maya,
      auraScore: DEMO_USERS.maya.auraScore,
      streakCurrent: DEMO_USERS.maya.streakCurrent,
      celebratingAura: false,
      celebrationAmount: 0,

      setPersona: (persona) => {
        const user = DEMO_USERS[persona];
        set({
          activePersona: persona,
          currentUser: user,
          auraScore: user.auraScore,
          streakCurrent: user.streakCurrent,
        });
      },

      setRealUser: (user) => {
        set({
          activePersona: "real",
          currentUser: user,
          auraScore: user.auraScore,
          streakCurrent: user.streakCurrent,
        });
      },

      incrementAura: (amount) => {
        set((s) => ({ auraScore: s.auraScore + amount }));
      },

      triggerCelebration: (amount) => {
        set({ celebratingAura: true, celebrationAmount: amount });
        setTimeout(() => set({ celebratingAura: false }), 3000);
      },

      dismissCelebration: () => set({ celebratingAura: false }),

      updateStreak: (days) => set({ streakCurrent: days }),
    }),
    { name: "aurait-aura" }
  )
);
