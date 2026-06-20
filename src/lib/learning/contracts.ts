export type Locale = 'es-CO';

export type TrackId = 'digital-confidence' | 'common-frauds';

export type DeviceVariant = 'mobile' | 'desktop' | 'shared-device' | 'public-device';

export type LearningLevel = 'starter' | 'practice' | 'recovery';

export type LessonKind = 'concept' | 'checklist' | 'simulation' | 'recovery';

export type SimulationKind =
  | 'safe-link-review'
  | 'message-risk-review'
  | 'search-result-review'
  | 'permission-review';

export type ReadinessMarker =
  | 'can-identify-risk-signals'
  | 'can-pause-before-acting'
  | 'can-verify-through-another-channel'
  | 'can-ask-for-help'
  | 'can-reset-after-mistake';

export interface StableContentIdentity {
  id: string;
  slug: string;
}

export interface GlossaryTerm extends StableContentIdentity {
  term: string;
  shortDefinition: string;
  plainLanguageExample?: string;
}

export interface LearningDisclaimer {
  label: string;
  body: string;
  appliesTo: Array<'lesson' | 'simulation' | 'recovery' | 'legal' | 'privacy'>;
}

export interface ChecklistItem extends StableContentIdentity {
  text: string;
  whyItMatters?: string;
}

export interface RecoveryStep extends StableContentIdentity {
  title: string;
  body: string;
  urgency: 'now' | 'soon' | 'when-safe';
}

export interface SimulationOption {
  id: string;
  label: string;
  feedback: string;
  riskSignalIds?: string[];
}

export interface SimulationDefinition extends StableContentIdentity {
  kind: SimulationKind;
  title: string;
  prompt: string;
  calmFeedback: string;
  options: SimulationOption[];
  deviceVariants: DeviceVariant[];
  noPunitiveScoring: true;
}

export interface LessonSummary extends StableContentIdentity {
  title: string;
  purpose: string;
  kind: LessonKind;
  level: LearningLevel;
  estimatedMinutes: number;
  deviceVariants: DeviceVariant[];
  readiness: ReadinessMarker[];
  glossary: GlossaryTerm[];
  warningSigns: ChecklistItem[];
  recoverySteps: RecoveryStep[];
  disclaimers: LearningDisclaimer[];
  simulation?: SimulationDefinition;
}

export interface MicrocourseSummary extends StableContentIdentity {
  title: string;
  description: string;
  lessons: LessonSummary[];
  readiness: ReadinessMarker[];
}

export interface LearningTrack extends StableContentIdentity {
  id: TrackId;
  locale: Locale;
  title: string;
  description: string;
  modules: MicrocourseSummary[];
}

export interface LearningCatalog {
  locale: Locale;
  tracks: LearningTrack[];
}
