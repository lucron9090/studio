import {genkit} from 'genkit';
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [googleCloud()],
});
