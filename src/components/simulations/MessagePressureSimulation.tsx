import { useState } from 'react';

type SimulationChoice = 'pause' | 'tap-link' | 'share-code';

const feedbackByChoice: Record<SimulationChoice, string> = {
  pause:
    'Bien. Pausar y verificar por otro canal reduce el riesgo sin necesidad de adivinar si el mensaje es real.',
  'tap-link':
    'Cuidado. Un enlace en un mensaje urgente puede llevar a una página falsa aunque parezca conocido.',
  'share-code':
    'Alto riesgo. Un código de verificación puede permitir el ingreso a una cuenta o confirmar una transacción.',
};

export function MessagePressureSimulation() {
  const [choice, setChoice] = useState<SimulationChoice | null>(null);

  return (
    <section className="message-simulation" aria-labelledby="message-simulation-title">
      <div>
        <p className="message-simulation__eyebrow">Práctica sin datos reales</p>
        <h2 id="message-simulation-title">Mensaje con presión urgente</h2>
        <p>
          Imagine que recibe este mensaje: “Su cuenta será bloqueada hoy. Verifique sus datos
          en este enlace y comparta el código que acaba de recibir”.
        </p>
      </div>

      <fieldset>
        <legend>¿Cuál sería la acción más segura?</legend>
        <label>
          <input
            type="radio"
            name="message-pressure-choice"
            value="pause"
            checked={choice === 'pause'}
            onChange={() => setChoice('pause')}
          />
          Pausar, cerrar el mensaje y verificar por un canal oficial.
        </label>
        <label>
          <input
            type="radio"
            name="message-pressure-choice"
            value="tap-link"
            checked={choice === 'tap-link'}
            onChange={() => setChoice('tap-link')}
          />
          Tocar el enlace para revisar rápido qué pasa.
        </label>
        <label>
          <input
            type="radio"
            name="message-pressure-choice"
            value="share-code"
            checked={choice === 'share-code'}
            onChange={() => setChoice('share-code')}
          />
          Compartir el código para evitar el bloqueo.
        </label>
      </fieldset>

      {choice && (
        <p className="message-simulation__feedback" role="status">
          {feedbackByChoice[choice]}
        </p>
      )}
    </section>
  );
}
