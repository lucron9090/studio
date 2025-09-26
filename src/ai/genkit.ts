import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash-exp', // Faster model for speed optimization
  // Enable streaming for real-time responses
  streaming: true,
  // Optimize for speed over quality
  config: {
    temperature: 0.7, // Lower temperature for faster, more focused responses
    maxOutputTokens: 1024, // Limit output length for speed
  }
});
