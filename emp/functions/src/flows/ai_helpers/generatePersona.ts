import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const generatePersonaFlow = defineFlow(
  {
    name: 'generatePersonaFlow',
    inputSchema: z.object({
      keywords: z.string(),
    }),
    outputSchema: z.object({
      persona: z.string(),
    }),
    description: 'Flow for generating AI personas',
  },
  async (input: { keywords: string }) => {
    const persona = `Generated persona based on keywords: ${input.keywords}`;
    return { persona };
  }
);