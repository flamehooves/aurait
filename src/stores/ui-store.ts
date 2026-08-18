"use client";

import { create } from "zustand";

type UIStore = {
  isComposerOpen: boolean;
  openComposer: () => void;
  closeComposer: () => void;
  activeLeaderboardScope: string;
  activeLeaderboardTime: string;
  setLeaderboardScope: (scope: string) => void;
  setLeaderboardTime: (time: string) => void;
  activeHistoryFilter: string;
  setHistoryFilter: (filter: string) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isComposerOpen: false,
  openComposer: () => set({ isComposerOpen: true }),
  closeComposer: () => set({ isComposerOpen: false }),
  activeLeaderboardScope: "friends",
  activeLeaderboardTime: "week",
  setLeaderboardScope: (scope) => set({ activeLeaderboardScope: scope }),
  setLeaderboardTime: (time) => set({ activeLeaderboardTime: time }),
  activeHistoryFilter: "all",
  setHistoryFilter: (filter) => set({ activeHistoryFilter: filter }),
}));
