
'use server';

/**
 * @fileOverview A flow for performing automated post-operation analysis and suggesting improvements.
 *
 * - analyzeOperation - A function that analyzes an operation and suggests improvements.
 * - AnalyzeOperationInput - The input type for the analyzeOperation function.
 * - AnalyzeOperationOutput - The return type for a an analyzeOperation function.
 */

import {ai} from '@/ai/genkit';
import { analyzeOperationPrompt } from '../prompts/analyzeOperation.prompt';
import { z } from 'zod';

export type AnalyzeOperationInput = z.infer<typeof analyzeOperationPrompt.inputSchema>;
export type AnalyzeOperationOutput = z.infer<typeof analyzeOperationPrompt.outputSchema>;

export async function analyzeOperation(input: AnalyzeOperationInput): Promise<AnalyzeOperationOutput> {
  const llmResponse = await analyzeOperationPrompt.generate({
    input: input,
  });

  return llmResponse.output()!;
}
