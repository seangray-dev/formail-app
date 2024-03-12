import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function OPTIONS() {
  console.log('Handling OPTIONS request');
  // Handle OPTIONS request for CORS preflight
  let response = new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
  console.log('Response headers set for OPTIONS request:', response.headers);
  return response;
}

export async function POST(
  req: NextRequest,
  context: { params: { formId: any } }
) {
  console.log('Handling POST request');
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
