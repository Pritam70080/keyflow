import type { TypingDifficulty } from "@/lib/typing/types";

const EASY_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
];

const MEDIUM_WORDS = [
  "around", "between", "through", "during", "before", "after", "without", "within",
  "another", "because", "something", "together", "important", "different", "possible",
  "question", "example", "problem", "number", "system", "though", "enough", "always",
  "never", "almost", "rather", "perhaps", "however", "instead", "already", "still",
  "while", "until", "since", "under", "above", "below", "across", "toward",
  "against", "among", "beyond", "inside", "outside", "behind", "beside", "along",
  "practice", "measure", "change", "reason", "result", "process", "method", "value",
  "simple", "common", "natural", "certain", "current", "recent", "modern", "social",
  "public", "private", "personal", "general", "special", "complete", "clear", "open",
  "close", "start", "finish", "create", "build", "learn", "teach", "write",
  "read", "speak", "listen", "focus", "move", "keep", "find", "show",
];

const HARD_WORDS = [
  "rhythm", "queue", "awkward", "sphinx", "zephyr", "mnemonic", "phlegm",
  "syzygy", "crypt", "glyph", "jazz", "buzz", "fjord", "knapsack",
  "ambiguous", "inevitable", "sophisticated", "extraordinary", "conscientious",
  "unbelievable", "miscellaneous", "phenomenon", "architecture", "responsibility",
  "temperature", "environment", "communication", "development", "relationship",
  "opportunity", "organization", "information", "experience", "understanding",
  "particularly", "unfortunately", "nevertheless", "consequently", "approximately",
  "simultaneously", "independent", "significant", "characteristic", "fundamental",
  "punctuation,", "however,", "therefore,", "meanwhile,", "otherwise,",
  "it's", "you're", "they're", "won't", "can't", "shouldn't", "wouldn't",
  "keyboard;", "practice:", "focus—now", "wait...", "really?", "yes!",
];

function pickWords(source: string[], count: number) {
  const words: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const word = source[Math.floor(Math.random() * source.length)];
    words.push(word);
  }

  return words;
}

export function generatePassage(difficulty: TypingDifficulty, wordCount = 220) {
  if (difficulty === "easy") {
    return pickWords(EASY_WORDS, wordCount).join(" ");
  }

  if (difficulty === "medium") {
    return pickWords(MEDIUM_WORDS, wordCount).join(" ");
  }

  return pickWords(HARD_WORDS, wordCount).join(" ");
}
