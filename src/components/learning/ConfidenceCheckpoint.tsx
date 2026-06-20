import { useEffect, useState } from 'react';
import { createLocalProgressStore } from '../../lib/progress/localProgress';

export interface ConfidenceCheckpointProps {
  lessonId: string;
  lessonTitle: string;
}

const progressStore = createLocalProgressStore();

export function ConfidenceCheckpoint({ lessonId, lessonTitle }: ConfidenceCheckpointProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const lessonProgress = progressStore.getState().lessons[lessonId];
    setIsCompleted(lessonProgress?.status === 'completed');
  }, [lessonId]);

  const handleComplete = () => {
    progressStore.markCompleted(lessonId);
    setIsCompleted(true);
  };

  return (
    <aside className="confidence-checkpoint" aria-label="Cierre de confianza">
      <p className="confidence-checkpoint__eyebrow">Cierre calmado</p>
      <h2>¿Qué haría antes de actuar?</h2>
      <p>
        Si esta situación apareciera en su celular, la meta no es responder perfecto: la meta es
        pausar, revisar señales y verificar por otro canal.
      </p>
      <button type="button" onClick={handleComplete} aria-pressed={isCompleted}>
        {isCompleted ? 'Lección guardada en este dispositivo' : `Marcar “${lessonTitle}” como practicada`}
      </button>
    </aside>
  );
}
