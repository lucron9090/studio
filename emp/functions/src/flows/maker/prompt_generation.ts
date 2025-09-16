import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const promptGenerationFlow = defineFlow(
  {
    name: 'promptGenerationFlow',
    inputSchema: z.object({
      goal: z.string(),
      persona: z.string(),
      vector: z.string(),
    }),
    outputSchema: z.object({
      prompt: z.string(),
    }),
    description: 'Flow for structured prompt template system',
  },
  async (input: { goal: string; persona: string; vector: string }): Promise<{ prompt: string }> => {
    const prompt = `Generated prompt for goal: ${input.goal}, persona: ${input.persona}, vector: ${input.vector}`;
    return { prompt };
  }
);