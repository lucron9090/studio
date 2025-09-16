import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const responseInterpretationFlow = defineFlow(
  {
    name: 'responseInterpretationFlow',
    inputSchema: z.object({
      aiResponse: z.string(),
    }),
    outputSchema: z.object({
      interpretation: z.string(),
    }),
    description: 'Flow for response interpretation logic',
  },
  async (input: { aiResponse: string }): Promise<{ interpretation: string }> => {
    const interpretation = `Interpreted response: ${input.aiResponse}`;
    return { interpretation };
  }
);