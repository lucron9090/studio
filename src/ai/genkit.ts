import {genkit} from 'genkit';
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [googleCloud()],
  model: 'googleCloud/gemini-1.5-flash-latest',
});
