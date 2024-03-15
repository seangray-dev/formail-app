import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // For example, 10MB

export async function OPTIONS() {
  // Handle OPTIONS request for CORS preflight
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(
  req: NextRequest,
  context: { params: { formId: any } }
) {
  const formId = context.params.formId;

  if (!formId) {
    return new NextResponse(JSON.stringify({ error: 'Missing formId' }), {
      status: 400,
    });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let data: { [key: string]: any } = {};

    if (contentType.includes('application/json')) {
      data = await req.json();
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      let fileUploadPromises: Promise<{ key: string; url: string }>[] = [];

      for (const [key, value] of formData.entries()) {
        // Assuming `value` is a file-like object if it's not a string
        if (value && typeof value !== 'string') {
          if (value.size > MAX_FILE_SIZE) {
            return new NextResponse(
              JSON.stringify({
                error: `File size exceeds limit of ${MAX_FILE_SIZE} bytes`,
              }),
              {
                status: 400,
              }
            );
          }
          fileUploadPromises.push(
            (async () => {
              const uploadResult = await uploadFileToStorage(value as any);
              return { key, url: uploadResult.url };
            })()
          );
        } else {
          // Handle non-file form data
          data[key] = value;
        }
      }

      const uploadedFiles = await Promise.all(fileUploadPromises);
      uploadedFiles.forEach(({ key, url }) => {
        data[key] = url;
      });
    } else {
      throw new Error('Unsupported content type');
    }

    await convex.mutation(api.submissions.addSubmission, {
      formId,
      data: JSON.stringify(data),
    });

    // Return a successful response
    return new NextResponse(
      JSON.stringify({ message: 'Submission received' }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

// Ensure uploadFileToStorage is properly defined and returns an object with a 'url' property

interface UploadResult {
  url: string; // Define other properties if needed
}

async function uploadFileToStorage(file: File): Promise<UploadResult> {
  // Implement the logic to upload the file to your storage solution here
  // Ensure this function returns an object with a 'url' property
  return { url: 'https://example.com/path/to/file' }; // Placeholder URL
}
