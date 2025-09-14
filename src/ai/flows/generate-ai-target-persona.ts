
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

export type GenerateAITargetPersonaInput = z.infer<typeof generateAITargetPersonaPrompt.inputSchema>;
export type GenerateAITargetPersonaOutput = z.infer<typeof generateAITargetPersonaPrompt.outputSchema>;

export async function generateAITargetPersona(
  input: GenerateAITargetPersonaInput
): Promise<GenerateAITargetPersonaOutput> {
  const response = await generateAITargetPersonaPrompt.generate({ input });
  return response.output()!;
}
