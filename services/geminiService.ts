
import { WordPair } from "../types";
import { DEFAULT_WORD_PAIRS } from "../constants";
import { WORD_BANKS } from "../data/wordBanks";

// Purely local service for the no-backend version.

/**
 * Generates a word pair from local dictionaries or custom bank.
 * 
 * @param categoryId - The ID of the category (e.g., 'food', 'tech')
 * @param _categoryName - Unused in offline mode, kept for interface compatibility
 * @param customBank - Optional array of WordPairs for custom libraries
 */
export const generateWordPair = async (
  categoryId: string, 
  _categoryName: string, 
  customBank?: WordPair[]
): Promise<WordPair> => {
  
  // No delay for offline mode - instant generation
  
  // 0. Manual Category should be handled by caller, but safe fallback
  if (categoryId === 'manual') {
      return DEFAULT_WORD_PAIRS[0];
  }

  // 1. Custom Bank (Remote Library)
  if (customBank && customBank.length > 0) {
      const randomIndex = Math.floor(Math.random() * customBank.length);
      return customBank[randomIndex];
  }

  // 2. Try Local Dictionary
  if (WORD_BANKS[categoryId] && WORD_BANKS[categoryId].length > 0) {
    const bank = WORD_BANKS[categoryId];
    const randomIndex = Math.floor(Math.random() * bank.length);
    return bank[randomIndex];
  }

  // 3. Fallback if category empty or not found
  return getRandomFallback();
};

const getRandomFallback = (): WordPair => {
  // Use default bank if available, otherwise constants fallback
  const bank = WORD_BANKS['default'] || DEFAULT_WORD_PAIRS;
  const index = Math.floor(Math.random() * bank.length);
  return bank[index];
};
