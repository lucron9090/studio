'use client';
import { type Flow, runFlow } from 'genkit';
import { z } from 'zod';

export async function runGenkitFlow<I extends z.ZodType, O extends z.ZodType>(
  flow: Flow<I, O>,
  input: z.infer<I>
) {
  if (typeof window === 'undefined') {
    throw new Error('This function must be run on the client.');
  }
  return await runFlow(flow, input);
}
