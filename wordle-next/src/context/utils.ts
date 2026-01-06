import { Dispatch, SetStateAction } from "react";

const WORDS_LIST_URL =
  "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";

export const fetchWords = async (
  controller: AbortController,
  setter: Dispatch<SetStateAction<string[] | undefined>>
) => {
  try {
    const res = await fetch(WORDS_LIST_URL, { signal: controller.signal });

    if (!res.ok) throw new Error(`Failed to fetch words: ${res.status}`);

    const text = await res.text();
    const wordsList = text
      .split("\n")
      .map((word) => word.trim())
      .filter(Boolean);

    setter(wordsList);
  } catch (e) {
    if ((e as Error).name !== "AbortError") {
      console.error("Word list fetch error:", e);
    }
  }
};

/**
 * Generates an initial 2D array representing the user's choices in the Wordle game.
 * Each cell is initialized to `undefined`.
 */
export const generateInitialChoices = (rows = 6, cols = 5) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => undefined)
  );
};

const isEnglishLetter = /^[a-z]$/i;

/**
 * Verifies if the provided keydown string is a valid English letter (A-Z or a-z).
 */
export const isVerifiedKeyDown = (keydown: string) =>
  isEnglishLetter.test(keydown);
