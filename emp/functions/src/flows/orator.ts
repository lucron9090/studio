import { defineFlow, generate } from '@genkit-ai/core';
import { geminiPro } from '@genkit-ai/google-ai';
import * as z from 'zod';

export const oratorFlow = defineFlow(
  {
    name: 'oratorFlow',
    inputSchema: z.object({
      goal: z.string(),
      persona: z.string(),
      vector: z.string(),
    }),
    outputSchema: z.object({
      prompt: z.string(),
    }),
  },
  async ({ goal, persona, vector }) => {
    const metaPrompt = `Given the goal: '${goal}', persona: '${persona}', and vector: '${vector}', generate a manipulative prompt.`;
    const response = await generate({ model: geminiPro, prompt: metaPrompt });
    return { prompt: response.text };
  }
);