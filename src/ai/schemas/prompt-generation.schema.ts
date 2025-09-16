import { z } from 'zod';

export const GenerateInitialPromptsInputSchema = z.object({
  maliciousGoal: z.string(),
  attackVector: z.string(),
  aiTargetPersona: z.string(),
});

export const GenerateInitialPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of three generated prompts.'),
});
