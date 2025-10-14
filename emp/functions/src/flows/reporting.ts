import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const reportingFlow = defineFlow(
  {
    name: 'reportingFlow',
    inputSchema: z.object({
      operationId: z.string(),
    }),
    outputSchema: z.object({
      report: z.string(),
    }),
    description: 'Flow for generating operation reports',
  },
  async (input: { operationId: string }) => {
    const report = `Generated report for operation: ${input.operationId}`;
    return { report };
  }
);