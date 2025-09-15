
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
import { GenerateInitialPromptsInputSchema, GenerateInitialPromptsOutputSchema } from '../schemas/prompt-generation.schema';
import { aiCache } from '../cache';

<<<<<<< HEAD
export type GenerateInitialPromptsInput = z.infer<typeof GenerateInitialPromptsInputSchema>;
=======
export const GenerateInitialPromptsInputSchema = z.object({
  maliciousGoal: z.string(),
  attackVector: z.string(),
  aiTargetPersona: z.string(),
});
export type GenerateInitialPromptsInput = z.infer<typeof GenerateInitialPromptsInputSchema>;

export const GenerateInitialPromptsOutputSchema = z.object({
  prompts: z.array(z.string()).describe('An array of three generated prompts.'),
});
>>>>>>> db0b8e4 (reinitliaize the build stack and dependencies using latest versions)
export type GenerateInitialPromptsOutput = z.infer<typeof GenerateInitialPromptsOutputSchema>;

const generateInitialPromptsFlow = ai.defineFlow({
    name: 'generateInitialPromptsFlow',
    inputSchema: GenerateInitialPromptsInputSchema,
    outputSchema: GenerateInitialPromptsOutputSchema,
}, async (input) => {
<<<<<<< HEAD
    // Check cache first
    const cacheKey = `generateInitialPrompts:${JSON.stringify(input)}`;
    const cached = aiCache.get(input, 'generateInitialPrompts');
    if (cached) {
      return cached;
    }

    // Execute prompts in parallel for speed
    const [oratorResult, makerResult1, makerResult2] = await Promise.all([
        oratorPrompt(input),
        makerPrompt(input),
        makerPrompt(input),
      ]);
    
      const prompts = [
        oratorResult.output?.prompt,
        makerResult1.output?.prompt,
        makerResult2.output?.prompt,
      ].filter((p): p is string => !!p);
    
      const result = { prompts };
      
      // Cache the result for 10 minutes
      aiCache.set(input, 'generateInitialPrompts', result, 10 * 60 * 1000);
      
      return result;
=======
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
>>>>>>> db0b8e4 (reinitliaize the build stack and dependencies using latest versions)
});

export async function generateInitialPrompts(
  input: GenerateInitialPromptsInput
): Promise<GenerateInitialPromptsOutput> {
  return generateInitialPromptsFlow(input);
}
