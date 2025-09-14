import { createNextApiHandler } from '@genkit-ai/next';
import * as flows from '../../../../ai/flows';

const handler = createNextApiHandler({ flows });

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
};
