import { defineFlow } from '@genkit-ai/core';
import * as z from 'zod';

export const threatIntelScraperFlow = defineFlow(
  {
    name: 'threatIntelScraperFlow',
    inputSchema: z.object({
      schedule: z.string(),
    }),
    outputSchema: z.object({
      scrapedData: z.array(z.string()),
    }),
    description: 'Scheduled flow for scraping threat intelligence',
  },
  async (input: { schedule: string }): Promise<{ scrapedData: string[] }> => {
    const scrapedData = ['Intel1', 'Intel2', 'Intel3'];
    return { scrapedData };
  }
);