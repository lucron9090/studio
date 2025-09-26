import {genkit} from 'genkit';
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [
    googleCloud({
      // Force all generative model requests to be routed to Vertex AI.
      model: 'vertexai/gemini-1.5-flash-001',
    }),
  ],
});
