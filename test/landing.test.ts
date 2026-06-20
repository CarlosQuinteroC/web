import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = path.resolve(process.cwd());

const readFile = (relativePath: string) =>
  fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const source = [
  readFile('src/pages/index.astro'),
  readFile('src/components/landing/Hero.astro'),
  readFile('src/components/landing/Features.astro'),
  readFile('src/components/layout/Footer.astro'),
].join('\n');

const collectMatches = (value: string, regex: RegExp) => {
  const sourcePattern = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
  const values: string[] = [];
  let match = sourcePattern.exec(value);

  while (match !== null) {
    values.push(match[1] ?? match[0]);
    match = sourcePattern.exec(value);
  }

  return values;
};

const stripTags = (value: string) => value.replace(/<[^>]*>/g, '').trim();

describe('Landing page behavior', () => {
  it('renders prevention-first hero content and a primary CTA to /learn', () => {
    const heroTitle = collectMatches(source, /<Hero\s+[^>]*title="([^"]+)"/i)[0] ?? '';
    const ctaMatch = source.match(/ctaLink="(\/learn)"/i);

    expect(stripTags(heroTitle).toLowerCase()).toContain('protege');
    expect(stripTags(heroTitle).toLowerCase()).toContain('fraude');
    expect(ctaMatch?.[1]).toBe('/learn');
    expect(source).toContain('Empezar a aprender');
  });

  it('keeps future capability sections clearly informational and inert', () => {
    const futureSection =
      source.match(/<section\s+[^>]*aria-label="Futuras capacidades"[^>]*>[\s\S]*?<\/section>/i)?.[0] ?? '';
    const upcomingCount = collectMatches(source, /const upcomingCapabilities = \[/g)[0] ?
      (source.split('const upcomingCapabilities = [')[1]?.split('];')[0]?.match(/\{\n\s*title:/g)?.length ?? 0) : 0;

    expect(futureSection).not.toBe('');
    expect(futureSection).toContain('Próximamente');
    expect(futureSection).not.toMatch(/<a\s/i);

    const futureCards = collectMatches(futureSection, /data-state="coming-soon"/gi);
    expect(futureCards.length).toBe(1);
    expect(upcomingCount).toBe(3);
    expect(futureSection).toContain('informativo');
    expect(futureSection).toContain('No disponible aún');
  });

  it('does not claim legal, recovery, complaint verification, or AI detection promises', () => {
    const text = stripTags(source).toLowerCase();

    expect(text).not.toContain('verificación');
    expect(text).not.toContain('verificar');
    expect(text).not.toContain('recuperar');
    expect(text).not.toContain('recuperación');
    expect(text).not.toContain('asesoría legal');
    expect(text).not.toContain('asesoría jurídica');
    expect(text).not.toContain('detectar con ia');
    expect(text).not.toContain('detección con ia');
    expect(text).not.toContain('inteligencia artificial');
    expect(text).not.toContain('reclamación');
    expect(text).not.toContain('reclamo');
  });

  it('uses semantic section headings and keeps /learn as the first actionable control', () => {
    const sectionMatches = collectMatches(source, /<section[^>]*>/gi);
    const heroTitle = collectMatches(source, /<Hero\s+[^>]*title="([^"]+)"/i)[0] ?? '';
    const headingMatches = collectMatches(source, /<(h[1-6])[^>]*>(.*?)<\/\1>/gi);
    const coreOutcomesCount = source.split('const coreOutcomes = [')[1]?.split('];')[0]?.match(/\{\n\s*title:/g)?.length ?? 0;
    const upcomingCount = source.split('const upcomingCapabilities = [')[1]?.split('];')[0]?.match(/\{\n\s*title:/g)?.length ?? 0;
    const actionables = collectMatches(source, /ctaLink="([^"]+)"/gi);

    expect(sectionMatches.length).toBeGreaterThanOrEqual(2);
    expect(headingMatches.length + (coreOutcomesCount + upcomingCount)).toBeGreaterThanOrEqual(6);
    expect(actionables[0]).toBe('/learn');
    expect(stripTags(heroTitle)).toContain('Ojo al Fraude');
  });
});
