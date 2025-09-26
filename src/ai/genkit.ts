import {genkit} from 'genkit';
import {googleCloud} from '@genkit-ai/google-cloud';
import {gcp} from '@genkit-ai/gcp';

export const ai = genkit({
  plugins: [googleCloud()],
});
