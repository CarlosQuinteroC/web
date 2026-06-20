import { useEffect, useMemo, useState } from 'react';
import {
  createLocalProgressStore,
  type AnonymousProgressState,
} from '../../lib/progress/localProgress';

export interface ProgressSummaryLesson {
  lessonId: string;
  title: string;
}

export interface ProgressSummaryProps {
  lessons: ProgressSummaryLesson[];
}

const progressStore = createLocalProgressStore();

const emptyProgressState: AnonymousProgressState = {
  version: 1,
  lessons: {},
};

export function ProgressSummary({ lessons }: ProgressSummaryProps) {
  const [progress, setProgress] = useState<AnonymousProgressState>(emptyProgressState);

  useEffect(() => {
    setProgress(progressStore.getState());
  }, []);

  const completedLessonIds = useMemo(() => {
    return new Set(
      Object.values(progress.lessons)
        .filter((lesson) => lesson.status === 'completed')
        .map((lesson) => lesson.lessonId),
    );
  }, [progress.lessons]);

  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.lessonId)).length;
  const totalCount = lessons.length;
  const hasProgress = completedCount > 0;

  const handleReset = () => {
    setProgress(progressStore.reset());
  };

  return (
    <aside className="progress-summary" aria-label="Resumen de progreso">
      <div>
        <p className="progress-summary__eyebrow">Progreso en este dispositivo</p>
        <h2>Su práctica queda guardada aquí</h2>
        <p>
          {hasProgress
            ? `Ha completado ${completedCount} de ${totalCount} lecciones en este navegador.`
            : 'Todavía no hay lecciones completadas en este navegador.'}
        </p>
      </div>

      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.lessonId}>
            <span aria-hidden="true">{completedLessonIds.has(lesson.lessonId) ? '✓' : '○'}</span>
            <span>{lesson.title}</span>
          </li>
        ))}
      </ul>

      <button type="button" onClick={handleReset} disabled={!hasProgress}>
        Borrar progreso de este dispositivo
      </button>
    </aside>
  );
}
