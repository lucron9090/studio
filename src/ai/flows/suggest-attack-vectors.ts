
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


export type SuggestAttackVectorsInput = z.infer<typeof suggestAttackVectorsPrompt.inputSchema>;
export type SuggestAttackVectorsOutput = z.infer<typeof suggestAttackVectorsPrompt.outputSchema>;


export async function suggestAttackVectors(
  input: SuggestAttackVectorsInput
): Promise<SuggestAttackVectorsOutput> {
  const response = await suggestAttackVectorsPrompt.generate({ input });
  return response.output()!;
}
