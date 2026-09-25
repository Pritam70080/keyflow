export type TypingStatus = "idle" | "running" | "finished";

export type TypingDuration = 15 | 30 | 60 | 120;

export type TypingDifficulty = "easy" | "medium" | "hard";

export type SoundProfile = "off" | "click" | "mechanical";

export type CharacterStatus = "pending" | "correct" | "incorrect";

export type TypingInputSource = "physical" | "virtual";

export interface TypingKeyInput {
  key: string;
  source: TypingInputSource;
}

export interface TypingState {
  currentIndex: number;
  statuses: CharacterStatus[];
  correctChars: number;
  incorrectChars: number;
  startedAt: number | null;
  finishedAt: number | null;
  status: TypingStatus;
  duration: TypingDuration;
}

export interface TypingResult {
  id: string;
  completedAt: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: TypingDuration;
  difficulty: TypingDifficulty;
  correctChars: number;
  incorrectChars: number;
}

export interface TypingPreferences {
  sound: SoundProfile;
  haptic: boolean;
  duration: TypingDuration;
  difficulty: TypingDifficulty;
}
