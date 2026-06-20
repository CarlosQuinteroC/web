import { describe, expect, it } from 'vitest';
import { passesContentSafety } from '../lib/learning/contentSafety';

describe('content safety rules', () => {
  it('accepts educational content with privacy/legal disclaimers and non-punitive simulation', () => {
    expect(
      passesContentSafety({
        body: 'Practique con ejemplos ficticios. No pegue claves ni códigos personales.',
        disclaimers: [
          { appliesTo: ['lesson', 'legal'] },
          { appliesTo: ['lesson', 'privacy'] },
        ],
        simulation: { noPunitiveScoring: true },
      }),
    ).toBe(true);
  });

  it('rejects content that asks for real sensitive data', () => {
    expect(
      passesContentSafety({
        body: 'Ingrese su contraseña real para practicar.',
        disclaimers: [
          { appliesTo: ['lesson', 'legal'] },
          { appliesTo: ['lesson', 'privacy'] },
        ],
      }),
    ).toBe(false);
  });

  it('rejects punitive simulations', () => {
    expect(
      passesContentSafety({
        body: 'Revise el mensaje y elija con calma.',
        disclaimers: [
          { appliesTo: ['lesson', 'legal'] },
          { appliesTo: ['lesson', 'privacy'] },
        ],
        simulation: { noPunitiveScoring: false },
      }),
    ).toBe(false);
  });
});
