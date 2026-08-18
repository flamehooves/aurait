"use client";

import { create } from "zustand";
import type { MomentVisibility } from "@/types";

type ComposerStore = {
  caption: string;
  selectedMediaUrl: string | null;
  selectedAuraCardId: string | null;
  selectedAuraCardText: string | null;
  visibility: MomentVisibility;
  challengeId: string | null;
  isPublishing: boolean;
  setCaption: (text: string) => void;
  setMedia: (url: string | null) => void;
  setAuraCard: (id: string | null, text: string | null) => void;
  setVisibility: (v: MomentVisibility) => void;
  setChallenge: (id: string | null) => void;
  setPublishing: (v: boolean) => void;
  reset: () => void;
};

const defaults = {
  caption: "",
  selectedMediaUrl: null,
  selectedAuraCardId: null,
  selectedAuraCardText: null,
  visibility: "friends" as MomentVisibility,
  challengeId: null,
  isPublishing: false,
};

export const useComposerStore = create<ComposerStore>((set) => ({
  ...defaults,
  setCaption: (text) => set({ caption: text }),
  setMedia: (url) => set({ selectedMediaUrl: url }),
  setAuraCard: (id, text) => set({ selectedAuraCardId: id, selectedAuraCardText: text }),
  setVisibility: (v) => set({ visibility: v }),
  setChallenge: (id) => set({ challengeId: id }),
  setPublishing: (v) => set({ isPublishing: v }),
  reset: () => set(defaults),
}));
