import {genkit} from 'genkit';
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
});
