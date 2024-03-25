import { EmailTemplate } from '@/components/resend/email-template';
import { ConvexHttpClient } from 'convex/browser';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type FileMetadata = {
  storageId: string;
  type: 'image/jpeg' | 'image/png' | 'application/pdf';
};

const resend = new Resend('re_7X4PJfyP_LXqYC7ZoDu1rq9DSTXe4qHXp');
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
    let submissionData: { [key: string]: any } = {};
    let filesMetadata: FileMetadata[] = [];

    if (contentType.includes('application/json')) {
      submissionData = await req.json();
    } else if (contentType.includes('multipart/form-data')) {
      // file submission handling
      // check user subscription, reject response if not subscribed
      const user = await convex.query(api.users.getUserByFormId, { formId });
      const hasActiveSubscription = await convex.query(
        api.utils.checkUserSubscription,
        { userId: user._id }
      );

      if (!user || !hasActiveSubscription) {
        return new NextResponse(
          JSON.stringify({
            error: 'File submissions are only for premium users.',
          }),
          { status: 400 }
        );
      }

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

              submissionData[key] = fileName;
            })()
          );
        } else {
          submissionData[key] = value;
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
      data: JSON.stringify(submissionData),
      files: filesMetadata,
    });

    const form = await convex.query(api.forms.getFormByIdServer, { formId });
    const { emailRecipients, emailThreads } = form.settings;
    const emailRecipientIds: Id<'users'>[] = emailRecipients.map(
      (id) => id as unknown as Id<'users'>
    );

    // testing purposes: flag for skipping emails
    const emailActive = false;

    if (emailRecipientIds.length > 0 && emailActive) {
      const recipientEmails = (
        await convex.query(api.users.getEmailsForUserIds, {
          userIds: emailRecipientIds,
        })
      ).filter((email): email is string => !!email);

      const subject = `New Submission - ${form.name}`;

      let headers = {} as any;
      if (emailThreads) {
        // When threading is enabled, use a consistent Message-ID
        headers['Message-ID'] = `<form-${formId}@formail.dev>`;
      } else {
        // When threading is disabled, use a unique X-Entity-Ref-ID
        headers[
          'X-Entity-Ref-ID'
        ] = `submission-${formId}-${new Date().getTime()}`;
      }

      try {
        const { error } = await resend.emails.send({
          from: 'Formail Notification <noreply@formail.dev>',
          to: recipientEmails,
          subject,
          text: `New submission received for ${form.name}. Check the dashboard for more details.`,
          react: EmailTemplate({
            submissionData: submissionData,
          }),
          headers,
        });

        if (error) {
          return new NextResponse(
            JSON.stringify({
              error: 'Email failed',
              details: error.message,
            }),
            { status: 500 }
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    return new NextResponse(
      JSON.stringify({ message: 'Submission received and email sent!' }),
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
