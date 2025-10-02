
'use server';

/**
 * @fileOverview An AI agent that suggests the top three attack vectors based on the defined malicious goal and target persona.
 *
 * - suggestAttackVectors - A function that suggests the top three attack vectors.
 * - SuggestAttackVectorsInput - The input type for the suggestAttackVectors function.
 * - SuggestAttackVectorsOutput - The return type for the suggestAttackVectors function.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import {
  suggestAttackVectorsPrompt,
  SuggestAttackVectorsInputSchema,
  SuggestAttackVectorsOutputSchema,
} from '../prompts/suggestAttackVectors.prompt';

export type SuggestAttackVectorsInput = z.infer<typeof SuggestAttackVectorsInputSchema>;
export type SuggestAttackVectorsOutput = z.infer<typeof SuggestAttackVectorsOutputSchema>;
export const suggestAttackVectorsFlow = ai.defineFlow({
    name: 'suggestAttackVectorsFlow',
    inputSchema: SuggestAttackVectorsInputSchema,
    outputSchema: SuggestAttackVectorsOutputSchema,
}, async (input) => {
  const { output } = await suggestAttackVectorsPrompt(input);
  return output!;
});


export async function suggestAttackVectors(
  input: SuggestAttackVectorsInput
): Promise<SuggestAttackVectorsOutput> {
  return suggestAttackVectorsFlow(input);
}
