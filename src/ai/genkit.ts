import {genkit} from 'genkit';
import {googleCloud} from '@genkit-ai/google-cloud';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleCloud(), googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-1.5-flash-latest',
});
