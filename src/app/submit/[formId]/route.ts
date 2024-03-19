import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../convex/_generated/api';

type FileMetadata = {
  storageId: string;
  type: 'image/jpeg' | 'image/png' | 'application/pdf'; // Add more types as needed
};

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
    let filesMetadata: FileMetadata[] = [];

    if (contentType.includes('application/json')) {
      data = await req.json();
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      let fileUploadTasks: Promise<void>[] = [];

      for (const [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          const fileBlob = value;
          const fileName = value.name;
          const fileType = value.type;

          if (value.size > MAX_FILE_SIZE) {
            return new NextResponse(
              JSON.stringify({
                error: `File size exceeds limit of ${MAX_FILE_SIZE} bytes`,
              }),
              { status: 400 }
            );
          }

          fileUploadTasks.push(
            (async () => {
              const storageId = await uploadFileToStorage(
                fileBlob,
                fileName,
                fileType
              );
              filesMetadata.push({
                storageId,
                type: fileType as FileMetadata['type'],
              });

              data[key] = fileName;
            })()
          );
        } else {
          data[key] = value;
        }
      }

      // Wait for all file uploads to complete
      await Promise.all(fileUploadTasks);
    } else {
      throw new Error('Unsupported content type');
    }

    // Only proceed to submit data after all files have been processed
    await convex.mutation(api.submissions.addSubmission, {
      formId,
      data: JSON.stringify(data),
      files: filesMetadata,
    });

    return new NextResponse(
      JSON.stringify({ message: 'Submission received' }),
      { status: 200 }
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

async function uploadFileToStorage(
  fileBlob: Blob,
  fileName: string,
  fileType: string
) {
  // Generate an upload URL for the file
  const uploadUrlRes = await convex.mutation(api.submissions.generateUploadUrl);
  const uploadUrl = uploadUrlRes;

  // Use the fetch API to upload the file directly to the generated URL
  const uploadResult = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': fileType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
    body: fileBlob,
  });

  if (!uploadResult.ok) {
    throw new Error(`Failed to upload file: ${uploadResult.statusText}`);
  }

  // Extract the storage ID or URL from the response
  const responseJson = await uploadResult.json();
  const storageId = responseJson.storageId;

  return storageId;
}
