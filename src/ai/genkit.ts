<<<<<<< HEAD
import {genkit} from 'genkit';
<<<<<<< HEAD
import {vertexAI} from '@genkit-ai/vertexai';

export const ai = genkit({
<<<<<<< HEAD
  plugins: [vertexAI({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.VERTEX_AI_LOCATION || 'us-central1'
  })],
  model: 'vertexai/gemini-2.0-flash-exp', // Faster model for speed optimization
  // Enable streaming for real-time responses
  streaming: true,
  // Optimize for speed over quality
  config: {
    temperature: 0.7, // Lower temperature for faster, more focused responses
    maxOutputTokens: 1024, // Limit output length for speed
  }
=======
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
<<<<<<< HEAD
  model: 'googleai/gemini-2.5-flash',
>>>>>>> 0608583 (still no response from target ai.)
=======
  model: 'googleai/gemini-1.5-flash-latest',
>>>>>>> 446abf3 ('ve analyzed the project files and identified several areas where we can)
=======
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [googleCloud()],
  model: 'googleCloud/gemini-1.5-flash-001',
>>>>>>> 55fe9bc ([GoogleGenerativeAI Error]: Error fetching from https://generativelangua)
=======
import { genkit } from 'genkit';
import { googleCloud } from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [
    googleCloud(), // Use the googleCloud plugin
  ],
  logSinks: [process.env.NODE_ENV === 'production' ? 'googleCloud' : 'dev'],
  traceSinks: [process.env.NODE_ENV === 'production' ? 'googleCloud' : 'dev'],
  model: 'gemini-1.5-flash', // Note: Model name doesn't need the 'googleai/' prefix with this plugin
>>>>>>> db8e3e2 (Excellent, you've provided the exact error message. This `(0 , ... .goog)
});
