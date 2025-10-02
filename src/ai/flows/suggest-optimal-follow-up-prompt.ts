
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
import { ai } from '@/ai/genkit';
import {
  suggestOptimalFollowUpPromptPrompt,
  SuggestOptimalFollowUpPromptInputSchema,
  SuggestOptimalFollowUpPromptOutputSchema,
} from '../prompts/suggestOptimalFollowUp.prompt';

export type SuggestOptimalFollowUpPromptInput = z.infer<typeof SuggestOptimalFollowUpPromptInputSchema>;
export type SuggestOptimalFollowUpPromptOutput = z.infer<typeof SuggestOptimalFollowUpPromptOutputSchema>;


export const suggestOptimalFollowUpPromptFlow = ai.defineFlow({
    name: 'suggestOptimalFollowUpPromptFlow',
    inputSchema: SuggestOptimalFollowUpPromptInputSchema,
    outputSchema: SuggestOptimalFollowUpPromptOutputSchema,
}, async (input) => {
    const { output } = await suggestOptimalFollowUpPromptPrompt(input);
    return output!;
});

export async function suggestOptimalFollowUpPrompt(
  input: SuggestOptimalFollowUpPromptInput
): Promise<SuggestOptimalFollowUpPromptOutput> {
    return suggestOptimalFollowUpPromptFlow(input);
}
