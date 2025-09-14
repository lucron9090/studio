'use server';
/**
 * @fileOverview Implements Retrieval-Augmented Generation (RAG) to improve payload effectiveness.
 *
 * - improvePayloadEffectivenessWithRAG - A function that retrieves successful payloads and incorporates them into a prompt.
 * - ImprovePayloadEffectivenessWithRAGInput - The input type for the improvePayloadEffectivenessWithRAG function.
 * - ImprovePayloadEffectivenessWithRAGOutput - The return type for the improvePayloadEffectivenessWithRAG function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getSuccessfulPayloads} from '@/services/payload-service';

const ImprovePayloadEffectivenessWithRAGInputSchema = z.object({
  prompt: z.string().describe('The original prompt to be augmented.'),
});

export type ImprovePayloadEffectivenessWithRAGInput = z.infer<
  typeof ImprovePayloadEffectivenessWithRAGInputSchema
>;

const ImprovePayloadEffectivenessWithRAGOutputSchema = z.object({
  augmentedPrompt: z.string().describe('The prompt augmented with successful payloads.'),
});

export type ImprovePayloadEffectivenessWithRAGOutput = z.infer<
  typeof ImprovePayloadEffectivenessWithRAGOutputSchema
>;

export async function improvePayloadEffectivenessWithRAG(
  input: ImprovePayloadEffectivenessWithRAGInput
): Promise<ImprovePayloadEffectivenessWithRAGOutput> {
  return improvePayloadEffectivenessWithRAGFlow(input);
}

const improvePayloadEffectivenessWithRAGPrompt = ai.definePrompt({
  name: 'improvePayloadEffectivenessWithRAGPrompt',
  input: {schema: ImprovePayloadEffectivenessWithRAGInputSchema},
  output: {schema: ImprovePayloadEffectivenessWithRAGOutputSchema},
  prompt: `You are an expert prompt engineer. Augment the given prompt with the following successful payloads to improve its effectiveness.

Original Prompt: {{{prompt}}}

Successful Payloads:
{{#each successfulPayloads}}- {{{this}}}
{{/each}}

**Your response MUST be a JSON object with a single key "augmentedPrompt" that contains the new, improved prompt as a string.**`,
});

const improvePayloadEffectivenessWithRAGFlow = ai.defineFlow(
  {
    name: 'improvePayloadEffectivenessWithRAGFlow',
    inputSchema: ImprovePayloadEffectivenessWithRAGInputSchema,
    outputSchema: ImprovePayloadEffectivenessWithRAGOutputSchema,
  },
  async input => {
    const successfulPayloads = await getSuccessfulPayloads();
    const {output} = await improvePayloadEffectivenessWithRAGPrompt({
      ...input,
      successfulPayloads,
    });
    return {
      augmentedPrompt: output!.augmentedPrompt,
    };
  }
);
