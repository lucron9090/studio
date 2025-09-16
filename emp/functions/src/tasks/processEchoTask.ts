import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const processEchoTask = defineFlow(
  {
    name: 'processEchoTask',
    inputSchema: z.object({
      taskId: z.string(),
    }),
    outputSchema: z.object({
      result: z.string(),
    }),
    description: 'Task for processing Echo operations',
  },
  async (input: { taskId: string }): Promise<{ result: string }> => {
    const result = `Processed Echo task: ${input.taskId}`;
    return { result };
  }
);