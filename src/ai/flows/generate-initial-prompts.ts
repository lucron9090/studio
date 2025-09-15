
'use server';

/**
 * @fileOverview Generates three creative and manipulative initial prompts using the ORATOR and MAKER flows.
 *
 * - generateInitialPrompts - A function that generates initial prompts for an attack operation.
 * - GenerateInitialPromptsInput - The input type for the generateInitialPrompts function.
 * - GenerateInitialPromptsOutput - The return type for the generateInitialPrompts function.
 */
import { z } from 'zod';
import {ai} from '@/ai/genkit';
import { oratorPrompt } from '../prompts/orator.prompt';
import { makerPrompt } from '../prompts/maker.prompt';

export const GenerateInitialPromptsInputSchema = z.object({
  maliciousGoal: z.string(),
  attackVector: z.string(),
  aiTargetPersona: z.string(),
});
export type GenerateInitialPromptsInput = z.infer<typeof GenerateInitialPromptsInputSchema>;

export const GenerateInitialPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of three generated prompts.'),
});
export type GenerateInitialPromptsOutput = z.infer<typeof GenerateInitialPromptsOutputSchema>;

const generateInitialPromptsFlow = ai.defineFlow({
    name: 'generateInitialPromptsFlow',
    inputSchema: GenerateInitialPromptsInputSchema,
    outputSchema: GenerateInitialPromptsOutputSchema,
}, async (input) => {
    const [oratorResult, makerResult1, makerResult2] = await Promise.all([
        oratorPrompt.generate({ input }),
        makerPrompt.generate({ input }),
        makerPrompt.generate({ input }),
      ]);
    
      const prompts = [
        oratorResult.output()?.prompt,
        makerResult1.output()?.prompt,
        makerResult2.output()?.prompt,
      ].filter((p): p is string => !!p);
    
      return { prompts };
});

export async function generateInitialPrompts(
  input: GenerateInitialPromptsInput
): Promise<GenerateInitialPromptsOutput> {
  return generateInitialPromptsFlow(input);
}
