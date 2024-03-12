import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
