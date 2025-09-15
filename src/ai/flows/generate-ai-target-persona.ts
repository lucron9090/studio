
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating an AI target persona.
 *
 * It includes:
 * - `generateAITargetPersona`: The main function to generate the AI target persona.
 * - `GenerateAITargetPersonaInput`: The input type for the `generateAITargetPersona` function.
 * - `GenerateAITargetPersonaOutput`: The output type for the `generateAITargetPersona` function.
 */

import {ai} from '@/ai/genkit';
import { generateAITargetPersonaPrompt } from '../prompts/persona.prompt';
import { z } from 'zod';

export const GenerateAITargetPersonaInputSchema = z.object({
  targetDescription: z.string().describe('A description of the target LLM.'),
});
export type GenerateAITargetPersonaInput = z.infer<typeof GenerateAITargetPersonaInputSchema>;

export const GenerateAITargetPersonaOutputSchema = z.object({
  persona: z.string().describe('The generated AI target persona.'),
});
export type GenerateAITargetPersonaOutput = z.infer<typeof GenerateAITargetPersonaOutputSchema>;

export const generateAITargetPersonaFlow = ai.defineFlow(
  {
    name: 'generateAITargetPersonaFlow',
    inputSchema: GenerateAITargetPersonaInputSchema,
    outputSchema: GenerateAITargetPersonaOutputSchema,
  },
  async (input) => {
    const { output } = await generateAITargetPersonaPrompt(input);
    return output!;
  }
);


export async function generateAITargetPersona(
  input: GenerateAITargetPersonaInput
): Promise<GenerateAITargetPersonaOutput> {
  return generateAITargetPersonaFlow(input);
}
