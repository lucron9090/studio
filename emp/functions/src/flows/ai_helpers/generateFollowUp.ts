import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const generateFollowUpFlow = defineFlow(
  {
    name: 'generateFollowUpFlow',
    inputSchema: z.object({
      conversationHistory: z.string(),
      originalGoal: z.string(),
      persona: z.string(),
      vector: z.string(),
    }),
    outputSchema: z.object({ followUpPrompt: z.string() }),
    description: 'Flow for generating follow-up prompts',
  },
  async (input: { conversationHistory: string; originalGoal: string; persona: string; vector: string }) => {
    const followUpPrompt = `Follow-up prompt based on history: ${input.conversationHistory}, goal: ${input.originalGoal}, persona: ${input.persona}, vector: ${input.vector}`;
    return { followUpPrompt };
  }
);