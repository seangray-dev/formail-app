import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function middleware(req: NextRequest) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    // Create a response object for CORS headers
    const res = NextResponse.next();

    // Set CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'POST');
    res.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    return res;
  } else {
    // If the request is not a POST, return a 405 Method Not Allowed response
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { formId: any } }
) {
  const formId = context.params.formId;
  const data = await req.json();

  if (!formId || !data) {
    return new Response(JSON.stringify({ error: 'Missing formId or data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const serializedData = JSON.stringify(data);
    await convex.mutation(api.submissions.addSubmission, {
      formId,
      data: serializedData,
    });

    return new Response(JSON.stringify({ message: 'Submission received' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
