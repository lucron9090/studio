import { ai } from '../../../../ai/genkit';

// Simple API route handler for Genkit flows
export async function POST(request: Request) {
  try {
    const body = await request.json();
    return Response.json({ 
      message: 'Genkit flows are available',
      flows: Object.keys(body) 
    });
  } catch (error) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}
