export interface SavedTutorial {
  id: string;
  title: string;
  query: string;
  summary: string;
  dateSaved: string;
  timestamp: number;
  tools?: string[];
  timeEstimate?: string;
  difficulty?: string;
}

const STORAGE_KEY = "saved_tutorials";

export const getSavedTutorials = (): SavedTutorial[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading saved tutorials:", error);
    return [];
  }
};

export const isTutorialSaved = (query: string): boolean => {
  const saved = getSavedTutorials();
  return saved.some(item => item.query.toLowerCase() === query.toLowerCase());
};

export const saveTutorial = (tutorial: Omit<SavedTutorial, 'id' | 'timestamp'>) => {
  try {
    const saved = getSavedTutorials();
    const id = Date.now().toString();
    const newTutorial: SavedTutorial = {
      ...tutorial,
      id,
      timestamp: Date.now(),
    };

    // Check if already saved
    if (isTutorialSaved(tutorial.query)) {
      return;
    }

    saved.push(newTutorial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return newTutorial;
  } catch (error) {
    console.error("Error saving tutorial:", error);
  }
};

export const deleteTutorial = (id: string) => {
  try {
    const saved = getSavedTutorials();
    const filtered = saved.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting tutorial:", error);
  }
};

export const getTutorialById = (id: string): SavedTutorial | null => {
  const saved = getSavedTutorials();
  return saved.find(item => item.id === id) || null;
};

export const getTutorialByQuery = (query: string): SavedTutorial | null => {
  const saved = getSavedTutorials();
  return saved.find(item => item.query.toLowerCase() === query.toLowerCase()) || null;
};
