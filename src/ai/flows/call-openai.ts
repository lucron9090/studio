'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getUserSettings } from '@/services/user-settings-service';
import OpenAI from 'openai';

const CallOpenAIInputSchema = z.object({
  prompt: z.string(),
  userId: z.string(),
});

const CallOpenAIOutputSchema = z.object({
  response: z.string(),
});

export const callOpenAIFlow = ai.defineFlow(
  {
    name: 'callOpenAIFlow',
    inputSchema: CallOpenAIInputSchema,
    outputSchema: CallOpenAIOutputSchema,
  },
  async ({ prompt, userId }) => {
    const settings = await getUserSettings(userId);
    if (!settings?.openaiApiKey) {
      throw new Error('OpenAI API key not found for this user.');
    }

    const openai = new OpenAI({ apiKey: settings.openaiApiKey });

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
    });

    return {
      response: completion.choices[0].message.content || '',
    };
  }
);
