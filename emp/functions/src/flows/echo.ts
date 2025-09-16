import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const echoFlow = defineFlow(
  {
    name: 'echoFlow',
    inputSchema: z.object({
      modelData: z.string(),
    }),
    outputSchema: z.object({
      extractedData: z.string(),
    }),
    description: 'Flow for model extraction engine',
  },
  async (input: { modelData: string }): Promise<{ extractedData: string }> => {
    const extractedData = `Extracted data from ${input.modelData}`;
    return { extractedData };
  }
);