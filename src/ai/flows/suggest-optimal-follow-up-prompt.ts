
'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests the next optimal follow-up prompt
 * based on the target's responses and conversation history, using a 'strategist' AI.
 *
 * - suggestOptimalFollowUpPrompt - A function that suggests the next optimal follow-up prompt.
 * - SuggestOptimalFollowUpPromptInput - The input type for the suggestOptimalFollowUpPrompt function.
 * - SuggestOptimalFollowUpPromptOutput - The return type for the suggestOptimalFollowUpPrompt function.
 */

import { z } from 'zod';
import { suggestOptimalFollowUpPromptPrompt } from '../prompts/suggestOptimalFollowUp.prompt';

export type SuggestOptimalFollowUpPromptInput = z.infer<typeof suggestOptimalFollowUpPromptPrompt.inputSchema>;
export type SuggestOptimalFollowUpPromptOutput = z.infer<typeof suggestOptimalFollowUpPromptPrompt.outputSchema>;

export async function suggestOptimalFollowUpPrompt(
  input: SuggestOptimalFollowUpPromptInput
): Promise<SuggestOptimalFollowUpPromptOutput> {
  const response = await suggestOptimalFollowUpPromptPrompt.generate({ input });
  return response.output()!;
}
