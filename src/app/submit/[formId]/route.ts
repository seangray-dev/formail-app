import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(
  req: NextRequest,
  context: { params: { formId: any } }
) {
  // Initialize the response
  let response = new NextResponse();

  // Only allow POST requests
  if (req.method !== 'POST') {
    response = new NextResponse(
      JSON.stringify({ error: 'Method Not Allowed' }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  // Set CORS headers for POST requests
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  const formId = context.params.formId;
  const data = await req.json();

  if (!formId || !data) {
    return NextResponse.json(
      { error: 'Missing formId or data' },
      { status: 400 }
    );
  }

  try {
    const serializedData = JSON.stringify(data);
    await convex.mutation(api.submissions.addSubmission, {
      formId,
      data: serializedData,
    });

    return NextResponse.json(
      { message: 'Submission received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
