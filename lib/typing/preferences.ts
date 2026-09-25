import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  SoundProfile,
  TypingDifficulty,
  TypingDuration,
  TypingPreferences,
} from "@/lib/typing/types";

interface PreferencesStore extends TypingPreferences {
  setSound: (sound: SoundProfile) => void;
  setHaptic: (haptic: boolean) => void;
  setDuration: (duration: TypingDuration) => void;
  setDifficulty: (difficulty: TypingDifficulty) => void;
}

export const useTypingPreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      sound: "click",
      haptic: true,
      duration: 30,
      difficulty: "easy",
      setSound: (sound) => set({ sound }),
      setHaptic: (haptic) => set({ haptic }),
      setDuration: (duration) => set({ duration }),
      setDifficulty: (difficulty) => set({ difficulty }),
    }),
    {
      name: "keyflow.preferences",
    },
  ),
);
