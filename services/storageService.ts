export const STORAGE_KEY = 'al_mumathil_history_v1';
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000; // 3 months retention

interface HistoryEntry {
  word: string;
  timestamp: number;
}

export const storageService = {
  /**
   * Loads words used within the last 90 days.
   * Removes expired entries from storage.
   */
  getRecentWords: (): string[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const history: HistoryEntry[] = JSON.parse(raw);
      const now = Date.now();

      // Filter keep only entries younger than 90 days
      const validEntries = history.filter(entry => (now - entry.timestamp) < NINETY_DAYS_MS);

      // If we cleaned up any old entries, save back to storage
      if (validEntries.length !== history.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries));
      }

      return validEntries.map(e => e.word);
    } catch (e) {
      console.error("Error loading history", e);
      return [];
    }
  },

  /**
   * Adds a new word to history with current timestamp
   */
  addWord: (word: string) => {
    try {
      const history = storageService.getAllEntries();
      const newEntry: HistoryEntry = { word, timestamp: Date.now() };
      
      // Avoid exact duplicates in the array
      if (!history.some(h => h.word.toLowerCase() === word.toLowerCase())) {
        history.push(newEntry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    } catch (e) {
      console.error("Error saving word", e);
    }
  },

  getAllEntries: (): HistoryEntry[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
};