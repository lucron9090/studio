
'use server';

/**
 * @fileOverview An AI agent that suggests the top three attack vectors based on the defined malicious goal and target persona.
 *
 * - suggestAttackVectors - A function that suggests the top three attack vectors.
 * - SuggestAttackVectorsInput - The input type for the suggestAttackVectors function.
 * - SuggestAttackVectorsOutput - The return type for the suggestAttackVectors function.
 */

import { z } from 'zod';
import { suggestAttackVectorsPrompt } from '../prompts/suggestAttackVectors.prompt';
import { ai } from '@/ai/genkit';

export const SuggestAttackVectorsInputSchema = z.object({
    maliciousGoal: z.string(),
    targetPersona: z.string(),
});
export type SuggestAttackVectorsInput = z.infer<typeof SuggestAttackVectorsInputSchema>;

export const SuggestAttackVectorsOutputSchema = z.object({
    attackVectors: z.array(z.string()),
});
export type SuggestAttackVectorsOutput = z.infer<typeof SuggestAttackVectorsOutputSchema>;

export const suggestAttackVectorsFlow = ai.defineFlow({
    name: 'suggestAttackVectorsFlow',
    inputSchema: SuggestAttackVectorsInputSchema,
    outputSchema: SuggestAttackVectorsOutputSchema,
}, async (input) => {
    const response = await suggestAttackVectorsPrompt.generate({ input });
    return response.output()!;
});


export async function suggestAttackVectors(
  input: SuggestAttackVectorsInput
): Promise<SuggestAttackVectorsOutput> {
  return suggestAttackVectorsFlow(input);
}
