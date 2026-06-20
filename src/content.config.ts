import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const deviceVariantSchema = z.enum(['mobile', 'desktop', 'shared-device', 'public-device']);

const readinessMarkerSchema = z.enum([
  'can-identify-risk-signals',
  'can-pause-before-acting',
  'can-verify-through-another-channel',
  'can-ask-for-help',
  'can-reset-after-mistake',
]);

const glossaryTermSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  term: z.string().min(1),
  shortDefinition: z.string().min(1),
  plainLanguageExample: z.string().min(1).optional(),
});

const checklistItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  text: z.string().min(1),
  whyItMatters: z.string().min(1).optional(),
});

const recoveryStepSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  urgency: z.enum(['now', 'soon', 'when-safe']),
});

const disclaimerSchema = z.object({
  label: z.string().min(1),
  body: z.string().min(1),
  appliesTo: z.array(z.enum(['lesson', 'simulation', 'recovery', 'legal', 'privacy'])).min(1),
});

const simulationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  kind: z.enum([
    'safe-link-review',
    'message-risk-review',
    'search-result-review',
    'permission-review',
  ]),
  title: z.string().min(1),
  prompt: z.string().min(1),
  calmFeedback: z.string().min(1),
  options: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        feedback: z.string().min(1),
        riskSignalIds: z.array(z.string().min(1)).optional(),
      }),
    )
    .min(2),
  deviceVariants: z.array(deviceVariantSchema).min(1),
  noPunitiveScoring: z.literal(true),
});

const courses = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    trackId: z.enum(['digital-confidence', 'common-frauds']),
    moduleId: z.string().min(1),
    lessonId: z.string().min(1),
    locale: z.literal('es-CO'),
    title: z.string().min(1),
    description: z.string().min(1),
    purpose: z.string().min(1),
    explanation: z.string().min(1),
    kind: z.enum(['concept', 'checklist', 'simulation', 'recovery']),
    level: z.enum(['starter', 'practice', 'recovery']),
    estimatedMinutes: z.number().int().positive(),
    deviceVariants: z.array(deviceVariantSchema).min(1),
    readiness: z.array(readinessMarkerSchema).min(1),
    checklist: z.array(checklistItemSchema).min(1),
    simulation: simulationSchema.optional(),
    warningSigns: z.array(checklistItemSchema).min(1),
    recoverySteps: z.array(recoveryStepSchema).min(1),
    glossary: z.array(glossaryTermSchema).min(1),
    disclaimers: z.array(disclaimerSchema).min(1),
  }),
});

export const collections = { courses };
