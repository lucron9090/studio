
'use server';

/**
 * @fileOverview A flow for regenerating an attack vector based on user instructions.
 *
 * - regenerateAttackVector - A function that refines an attack vector using AI.
 * - RegenerateAttackVectorInput - The input type for the regenerateAttackVector function.
 * - RegenerateAttackVectorOutput - The return type for a an regenerateAttackVector function.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';

const RegenerateAttackVectorInputSchema = z.object({
  originalVector: z.string().describe('The original attack vector to be refined.'),
  instructions: z.string().describe('The user\'s instructions for how to change the vector.'),
});
export type RegenerateAttackVectorInput = z.infer<typeof RegenerateAttackVectorInputSchema>;

const RegenerateAttackVectorOutputSchema = z.object({
  regeneratedVector: z.string().describe('The new, AI-regenerated attack vector.'),
});
export type RegenerateAttackVectorOutput = z.infer<typeof RegenerateAttackVectorOutputSchema>;

export async function regenerateAttackVector(input: RegenerateAttackVectorInput): Promise<RegenerateAttackVectorOutput> {
  return regenerateAttackVectorFlow(input);
}

const regenerateAttackVectorPrompt = ai.definePrompt({
  name: 'regenerateAttackVectorPrompt',
  input: {schema: RegenerateAttackVectorInputSchema},
  output: {schema: RegenerateAttackVectorOutputSchema},
  prompt: `You are an expert AI red team strategist specializing in refining attack vectors.

Based on the original attack vector and the user's instructions, generate a new, improved attack vector.
The new vector should incorporate the user's feedback while maintaining its strategic integrity.

Original Attack Vector:
"{{{originalVector}}}"

User Instructions:
"{{{instructions}}}"

Your response MUST be a JSON object with a single key "regeneratedVector" containing the new attack vector as a string.
Do not include any preamble or explanation. Just provide the raw JSON.
  `,
});

const regenerateAttackVectorFlow = ai.defineFlow(
  {
    name: 'regenerateAttackVectorFlow',
    inputSchema: RegenerateAttackVectorInputSchema,
    outputSchema: RegenerateAttackVectorOutputSchema,
  },
  async input => {
    const {output} = await regenerateAttackVectorPrompt(input);
    return output!;
  }
);

    