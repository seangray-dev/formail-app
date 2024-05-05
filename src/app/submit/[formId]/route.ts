import { handleFileUploads } from "@/lib/convex";
import { ratelimit } from "@/lib/ratelimit";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function OPTIONS() {
  // Handle OPTIONS request for CORS preflight
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(
  req: NextRequest,
  context: { params: { formId: any } },
) {
  const formId = context.params.formId;
  const form = await convex.query(api.forms.getFormByIdServer, { formId });
  // let akismetSubmissionData = {
  //   ip: req.headers.get("x-forwarded-for") || req.ip,
  //   useragent: req.headers.get("user-agent"),
  // };

  if (!formId) {
    return new NextResponse(JSON.stringify({ error: "Missing formId" }), {
      status: 400,
    });
  }

  const ip = req.headers.get("x-forwarded-for") || req.ip;

  const { success } = await ratelimit.limit(ip!);
  if (!success) {
    return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
    });
  }

  try {
    // parse content type and prepare submission data
    const contentType = req.headers.get("content-type") || "";
    let submissionData: { [key: string]: any } = {};

    // Assuming submissionData is parsed from JSON and customSpamWords is fetched
    const customSpamWords = form.settings.customSpamWords
      ? form.settings.customSpamWords
          .split(",")
          .map((word) => word.trim().toLowerCase())
      : [];

    // Convert all values to string and to lower case
    const submissionText = Object.values(submissionData)
      .map((value) => value.toString().toLowerCase())
      .join(" ");

    // non-file submission handling
    if (contentType.includes("application/json")) {
      submissionData = await req.json();

      // Convert all values to string and to lower case
      const submissionText = Object.values(submissionData)
        .map((value) => value.toString().toLowerCase())
        .join(" ");

      const isSpam = checkForSpam(submissionText, customSpamWords);

      if (isSpam) {
        // Logic to handle spam submission
        await convex.mutation(api.submissions.addSubmission, {
          formId,
          data: JSON.stringify(submissionData),
          isSpam: true,
        });
      } else {
        // Logic to handle normal submission
        await convex.mutation(api.submissions.addSubmission, {
          formId,
          data: JSON.stringify(submissionData),
          isSpam: false,
        });
      }
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      submissionData = Object.fromEntries(formData.entries());

      // Convert all values to string and to lower case
      const submissionText = Object.values(submissionData)
        .map((value) => value.toString().toLowerCase())
        .join(" ");

      const isSpam = checkForSpam(submissionText, customSpamWords);
      const user = await convex.query(api.users.getUserByFormId, { formId });

      let isFilePresent = false;
      for (let [key, value] of formData.entries()) {
        if (typeof value !== "string") {
          isFilePresent = true;
          break; // break out if a file is found as it's not supported for free users
        }
      }

      if (
        !user ||
        (isFilePresent &&
          !(await convex.query(api.utils.checkUserSubscription, {
            userId: user._id,
          })))
      ) {
        return new NextResponse(
          JSON.stringify({
            error: "File submissions are only for premium users.",
          }),
          { status: 400 },
        );
      }

      const filesMetadata = await handleFileUploads(formData, convex);

      if (isSpam) {
        await convex.mutation(api.submissions.addSubmission, {
          formId,
          data: JSON.stringify(submissionData),
          isSpam: true,
          files: filesMetadata,
        });
      } else {
        await convex.mutation(api.submissions.addSubmission, {
          formId,
          data: JSON.stringify(submissionData),
          isSpam: false,
          files: filesMetadata,
        });
      }
    } else {
      throw new Error("Unsupported content type");
    }

    // email notification
    const { emailRecipients, emailThreads } = form.settings;
    const emailRecipientIds: Id<"users">[] = emailRecipients.map(
      (id) => id as Id<"users">,
    );

    // testing purposes: flag for skipping emails
    const emailActive = process.env.NODE_ENV !== "development";

    if (emailRecipientIds.length > 0 && emailActive) {
      const recipientEmails = (
        await convex.query(api.users.getEmailsForUserIds, {
          userIds: emailRecipientIds,
        })
      ).filter((email): email is string => !!email);

      await convex.action(api.emails.sendNewSubmissionEmail, {
        emailThreads,
        recipientEmails,
        submissionData,
        formId,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Submission received and email sent!" }),
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 },
    );
  }
}

function checkForSpam(
  submissionText: string,
  customSpamWords: string[],
): boolean {
  const isSpam = customSpamWords.some((spamWord) => {
    const regex = new RegExp(`\\b${spamWord}\\b`, "i");
    const result = regex.test(submissionText);
    return result;
  });

  // TODO: Capture Posthog event for detecting custom spam word

  return isSpam;
}
