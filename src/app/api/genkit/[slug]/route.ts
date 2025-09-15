import { NextRequest, NextResponse } from 'next/server';
import * as flows from '../../../../ai/flows';
import {getFlow} from 'genkit';

async function handler(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const flow = getFlow(slug);
  if (!flow) {
    return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
  }

  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method Not Allowed' },
      { status: 405 }
    );
  }

  try {
    const { data: input } = await req.json();
    const result = await flow.invoke(input);
    return NextResponse.json(result);
  } catch (err: any) {
    const errorData = {
      message: err.message,
      stack: err.stack,
      details: err.details || null,
    };
    console.error(`Error running flow ${slug}:`, errorData);
    return NextResponse.json({ error: errorData }, { status: 500 });
  }
}


export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
};
