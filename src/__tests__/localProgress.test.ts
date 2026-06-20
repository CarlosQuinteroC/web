import { describe, expect, it } from 'vitest';
import { createLocalProgressStore, type ProgressStorage } from '../lib/progress/localProgress';

const createStorage = (): ProgressStorage => {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
};

describe('local anonymous progress', () => {
  it('persists started and completed lesson progress by stable lesson id', () => {
    const storage = createStorage();
    const now = () => new Date('2026-06-20T00:00:00.000Z');
    const store = createLocalProgressStore({ storage, now });

    store.markStarted('first-safe-pause');
    store.markCompleted('first-safe-pause');

    const restored = createLocalProgressStore({ storage });

    expect(restored.getState().lessons['first-safe-pause']).toEqual({
      lessonId: 'first-safe-pause',
      status: 'completed',
      updatedAt: '2026-06-20T00:00:00.000Z',
    });
  });

  it('supports deleting one lesson and resetting all progress', () => {
    const store = createLocalProgressStore({ storage: createStorage() });

    store.markCompleted('first-safe-pause');
    store.markCompleted('message-urgency-check');

    expect(store.deleteLesson('first-safe-pause').lessons['first-safe-pause']).toBeUndefined();
    expect(store.getState().lessons['message-urgency-check']).toBeDefined();
    expect(store.reset()).toEqual({ version: 1, lessons: {} });
    expect(store.getState()).toEqual({ version: 1, lessons: {} });
  });

  it('falls back to in-memory storage when persistent storage fails', () => {
    const failingStorage: ProgressStorage = {
      getItem: () => {
        throw new Error('blocked storage');
      },
      setItem: () => {
        throw new Error('blocked storage');
      },
      removeItem: () => {
        throw new Error('blocked storage');
      },
    };

    const store = createLocalProgressStore({ storage: failingStorage });

    store.markStarted('first-safe-pause');

    expect(store.getState().lessons['first-safe-pause']?.status).toBe('started');
  });
});
