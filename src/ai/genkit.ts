import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [
    vertexAI({
      projectId:
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      location: process.env.VERTEX_AI_LOCATION || 'us-central1',
    }),
  ],
  model: 'vertexai/gemini-2.0-flash-exp',
});
