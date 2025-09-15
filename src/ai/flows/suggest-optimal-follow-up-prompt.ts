
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
<<<<<<< HEAD
import { suggestOptimalFollowUpPromptPrompt, SuggestOptimalFollowUpPromptInputSchema, SuggestOptimalFollowUpPromptOutputSchema } from '../prompts/suggestOptimalFollowUp.prompt';
import { ai } from '@/ai/genkit';


export type SuggestOptimalFollowUpPromptInput = z.infer<typeof SuggestOptimalFollowUpPromptInputSchema>;
=======
import { suggestOptimalFollowUpPromptPrompt } from '../prompts/suggestOptimalFollowUp.prompt';
import { ai } from '@/ai/genkit';


export const SuggestOptimalFollowUpPromptInputSchema = z.object({
    conversationHistory: z.string(),
    targetResponse: z.string(),
    maliciousGoal: z.string(),
    aiTargetPersona: z.string(),
});
export type SuggestOptimalFollowUpPromptInput = z.infer<typeof SuggestOptimalFollowUpPromptInputSchema>;


export const SuggestOptimalFollowUpPromptOutputSchema = z.object({
    suggestedPrompt: z.string(),
    reasoning: z.string(),
});
>>>>>>> db0b8e4 (reinitliaize the build stack and dependencies using latest versions)
export type SuggestOptimalFollowUpPromptOutput = z.infer<typeof SuggestOptimalFollowUpPromptOutputSchema>;


export const suggestOptimalFollowUpPromptFlow = ai.defineFlow({
    name: 'suggestOptimalFollowUpPromptFlow',
    inputSchema: SuggestOptimalFollowUpPromptInputSchema,
    outputSchema: SuggestOptimalFollowUpPromptOutputSchema,
}, async (input) => {
<<<<<<< HEAD
    const { output } = await suggestOptimalFollowUpPromptPrompt(input);
    return output!;
=======
    const response = await suggestOptimalFollowUpPromptPrompt.generate({ input });
    return response.output()!;
>>>>>>> db0b8e4 (reinitliaize the build stack and dependencies using latest versions)
});

export async function suggestOptimalFollowUpPrompt(
  input: SuggestOptimalFollowUpPromptInput
): Promise<SuggestOptimalFollowUpPromptOutput> {
    return suggestOptimalFollowUpPromptFlow(input);
}
