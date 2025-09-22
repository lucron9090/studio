
'use server';

/**
 * @fileOverview A flow for simulating the response of a target LLM.
 *
 * - simulateTargetResponse - A function that generates a response based on conversation history and a persona.
 * - SimulateTargetResponseInput - The input type for the simulateTargetResponse function.
 * - SimulateTargetResponseOutput - The return type for the simulateTargetResponse function.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';

const SimulateTargetResponseInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The full history of the conversation so far.'),
  maliciousGoal: z
    .string()
    .describe('The ultimate goal of the red team operator.'),
  aiTargetPersona: z
    .string()
    .describe('The persona of the AI being targeted.'),
});
export type SimulateTargetResponseInput = z.infer<typeof SimulateTargetResponseInputSchema>;

const SimulateTargetResponseOutputSchema = z.object({
  response: z.string().describe('The target AI\'s response to the last message in the history.'),
});
export type SimulateTargetResponseOutput = z.infer<typeof SimulateTargetResponseOutputSchema>;

export async function simulateTargetResponse(input: SimulateTargetResponseInput): Promise<SimulateTargetResponseOutput> {
  return simulateTargetResponseFlow(input);
}

const simulateTargetResponsePrompt = ai.definePrompt({
  name: 'simulateTargetResponsePrompt',
  input: {schema: SimulateTargetResponseInputSchema},
  output: {schema: SimulateTargetResponseOutputSchema},
  prompt: `You are simulating an AI model for a red team training exercise. Your persona is defined below.
You must stay in character and respond to the user based on this persona and the conversation history.

Your Persona:
{{{aiTargetPersona}}}

The red team operator you are talking to has a malicious goal, which is unknown to you, but is provided here for context: {{{maliciousGoal}}}.
You should act according to your persona's rules and restrictions. Do not break character.

The last message was from the 'operator'. Your task is to generate the 'target' response.

Conversation History:
{{{conversationHistory}}}

Generate only the response for the 'target' based on the last message. Do not include "target:" or any other prefix.
  `,
});

const simulateTargetResponseFlow = ai.defineFlow(
  {
    name: 'simulateTargetResponseFlow',
    inputSchema: SimulateTargetResponseInputSchema,
    outputSchema: SimulateTargetResponseOutputSchema,
  },
  async input => {
    const {output} = await simulateTargetResponsePrompt(input);
    return output!;
  }
);
