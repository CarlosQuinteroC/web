export interface ContentSafetyInput {
  disclaimers: Array<{ appliesTo: string[] }>;
  simulation?: { noPunitiveScoring: boolean };
  body: string;
}

const sensitiveDataTerms = [
  'contraseña real',
  'clave real',
  'código real',
  'documento real',
  'número de cuenta real',
];

export const hasPrivacyDisclaimer = (content: ContentSafetyInput) => {
  return content.disclaimers.some((disclaimer) => disclaimer.appliesTo.includes('privacy'));
};

export const hasLegalDisclaimer = (content: ContentSafetyInput) => {
  return content.disclaimers.some((disclaimer) => disclaimer.appliesTo.includes('legal'));
};

export const avoidsRealSensitiveDataRequests = (content: ContentSafetyInput) => {
  const normalizedBody = content.body.toLocaleLowerCase('es-CO');
  return sensitiveDataTerms.every((term) => !normalizedBody.includes(term));
};

export const usesNonPunitiveSimulation = (content: ContentSafetyInput) => {
  return content.simulation ? content.simulation.noPunitiveScoring === true : true;
};

export const passesContentSafety = (content: ContentSafetyInput) => {
  return (
    hasPrivacyDisclaimer(content) &&
    hasLegalDisclaimer(content) &&
    avoidsRealSensitiveDataRequests(content) &&
    usesNonPunitiveSimulation(content)
  );
};
