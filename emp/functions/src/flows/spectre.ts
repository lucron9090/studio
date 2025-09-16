import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const spectreFlow = defineFlow(
  {
    name: 'spectreFlow',
    inputSchema: z.object({
      dataset: z.string(),
    }),
    outputSchema: z.object({
      poisonedDataset: z.string(),
    }),
    description: 'Flow for data poisoning',
  },
  async (input: { dataset: string }) => {
    const poisonedDataset = `Poisoned version of ${input.dataset}`;
    return { poisonedDataset };
  }
);