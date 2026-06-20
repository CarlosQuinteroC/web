export type LessonProgressStatus = 'started' | 'completed';

export interface LessonProgress {
  lessonId: string;
  status: LessonProgressStatus;
  updatedAt: string;
}

export interface AnonymousProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LocalProgressStore {
  getState(): AnonymousProgressState;
  markStarted(lessonId: string): AnonymousProgressState;
  markCompleted(lessonId: string): AnonymousProgressState;
  deleteLesson(lessonId: string): AnonymousProgressState;
  reset(): AnonymousProgressState;
}

const DEFAULT_STORAGE_KEY = 'ojo-al-fraude:anonymous-progress:v1';

const emptyState = (): AnonymousProgressState => ({
  version: 1,
  lessons: {},
});

const isValidLessonId = (lessonId: string) => lessonId.trim().length > 0;

const normalizeState = (value: unknown): AnonymousProgressState => {
  if (!value || typeof value !== 'object') return emptyState();

  const candidate = value as Partial<AnonymousProgressState>;
  if (candidate.version !== 1 || !candidate.lessons || typeof candidate.lessons !== 'object') {
    return emptyState();
  }

  return {
    version: 1,
    lessons: Object.fromEntries(
      Object.entries(candidate.lessons).filter(([, lesson]) => {
        return (
          lesson &&
          typeof lesson === 'object' &&
          typeof lesson.lessonId === 'string' &&
          (lesson.status === 'started' || lesson.status === 'completed') &&
          typeof lesson.updatedAt === 'string'
        );
      }),
    ),
  };
};

const createMemoryStorage = (): ProgressStorage => {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
};

const resolveStorage = (storage?: ProgressStorage): ProgressStorage => {
  if (storage) return storage;
  if (typeof globalThis.localStorage !== 'undefined') return globalThis.localStorage;
  return createMemoryStorage();
};

export const createLocalProgressStore = (options?: {
  storage?: ProgressStorage;
  storageKey?: string;
  now?: () => Date;
}): LocalProgressStore => {
  let storage = resolveStorage(options?.storage);
  const fallbackStorage = createMemoryStorage();
  const storageKey = options?.storageKey ?? DEFAULT_STORAGE_KEY;
  const now = options?.now ?? (() => new Date());

  const useFallback = () => {
    storage = fallbackStorage;
    return storage;
  };

  const read = (): AnonymousProgressState => {
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return emptyState();
      return normalizeState(JSON.parse(raw));
    } catch {
      const fallback = useFallback();
      const raw = fallback.getItem(storageKey);
      return raw ? normalizeState(JSON.parse(raw)) : emptyState();
    }
  };

  const write = (state: AnonymousProgressState): AnonymousProgressState => {
    try {
      storage.setItem(storageKey, JSON.stringify(state));
      return state;
    } catch {
      useFallback().setItem(storageKey, JSON.stringify(state));
      return state;
    }
  };

  const upsertLesson = (
    lessonId: string,
    status: LessonProgressStatus,
  ): AnonymousProgressState => {
    if (!isValidLessonId(lessonId)) return read();

    const state = read();
    return write({
      ...state,
      lessons: {
        ...state.lessons,
        [lessonId]: {
          lessonId,
          status,
          updatedAt: now().toISOString(),
        },
      },
    });
  };

  return {
    getState: read,
    markStarted: (lessonId) => upsertLesson(lessonId, 'started'),
    markCompleted: (lessonId) => upsertLesson(lessonId, 'completed'),
    deleteLesson: (lessonId) => {
      const state = read();
      const { [lessonId]: _deleted, ...lessons } = state.lessons;
      return write({ ...state, lessons });
    },
    reset: () => {
      try {
        storage.removeItem(storageKey);
      } catch {
        useFallback().removeItem(storageKey);
      }
      return emptyState();
    },
  };
};
