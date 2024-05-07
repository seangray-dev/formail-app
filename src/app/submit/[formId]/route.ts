import { FileMetadata, handleFileUploads } from "@/lib/convex";
import { ratelimit } from "@/lib/ratelimit";
import {
  Author,
  Blog,
  CheckResult,
  Client,
  Comment,
  CommentType,
} from "@cedx/akismet";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const AKISMET_KEY = process.env.AKISMET_SECRET as string;
const blog = new Blog({ url: "https://formail.dev" });
const akismet = new Client(AKISMET_KEY, blog);
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
  context: { params: { formId: Id<"forms"> } },
) {
  const ip = req.headers.get("x-forwarded-for") || req.ip;
  const userAgent = req.headers.get("user-agent") || "";
  console.log("Rate limiting...");
  const { success } = await ratelimit.limit(ip!);
  if (!success) {
    return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
    });
  }

  const formId = context.params.formId;
  const form = await convex.query(api.forms.getFormByIdServer, { formId });
  if (!form) {
    return new NextResponse(JSON.stringify({ error: "Form not found" }), {
      status: 404,
    });
  }
  console.log("Determining content type...");
  const contentType = req.headers.get("content-type") || "";
  let submissionData: { [key: string]: any } = {};
  let formData: FormData | null = null;

  // Decide handling based on content type
  if (contentType.includes("application/json")) {
    console.log("Handling JSON submission...");
    submissionData = await req.json();
  } else if (contentType.includes("multipart/form-data")) {
    console.log("Handling multipart/form-data submission...");
    formData = await req.formData();
    submissionData = Object.fromEntries(formData.entries());
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    console.log("Handling form-urlencoded submission...");
    const formData = await req.text();
    submissionData = Object.fromEntries(new URLSearchParams(formData));
  } else {
    return new NextResponse(
      JSON.stringify({ error: "Unsupported content type" }),
      { status: 400 },
    );
  }

  console.log("Checking for spam...");
  const customSpamWords = form.settings.customSpamWords
    ? form.settings.customSpamWords
        .split(",")
        .map((word) => word.trim().toLowerCase())
    : [];

  const isSpam = await checkForSpam(
    ip!,
    userAgent,
    submissionData,
    customSpamWords,
  );

  console.log("Handling submission...");
  // Handle file submission separately if multipart/form-data
  if (contentType.includes("multipart/form-data")) {
    const user = await convex.query(api.users.getUserByFormId, { formId });
    const filesMetadata = await handleFileUploads(formData!, convex);
    return await handleFileSubmission(
      formData!,
      user,
      isSpam,
      formId,
      filesMetadata,
    );
  } else {
    return await handleNonFileSubmission(formId, submissionData, isSpam);
  }
}

const handleNonFileSubmission = async (
  formId: Id<"forms">,
  submissionData: any,
  isSpam: boolean,
) => {
  console.log("Submitting non-file data...");
  try {
    const result = await convex.mutation(api.submissions.addSubmission, {
      formId,
      data: JSON.stringify(submissionData),
      isSpam,
    });
    console.log("Submission successful:", result);
    return new NextResponse(
      JSON.stringify({ message: "Submission received and processed." }),
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error during submission:", err);
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
};

const handleFileSubmission = async (
  formData: FormData,
  user: any,
  isSpam: boolean,
  formId: Id<"forms">,
  filesMetaData: FileMetadata[],
) => {
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

  try {
    await convex.mutation(api.submissions.addSubmission, {
      formId,
      data: JSON.stringify(formData),
      isSpam,
      files: filesMetaData,
    });
  } catch (err: any) {
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }

  return new NextResponse(
    JSON.stringify({ message: "Submission received and email sent!" }),
    { status: 200 },
  );
};

const checkForSpam = async (
  ip: string,
  userAgent: string,
  submissionData: { [key: string]: any },
  customSpamWords: string[],
) => {
  const submissionText = Object.values(submissionData)
    .map((value) => value.toString().toLowerCase())
    .join(" ");

  const author = new Author({
    ipAddress: ip,
    userAgent,
  });

  const comment = new Comment({
    author,
    content: submissionText,
    type: CommentType.contactForm,
  });

  // TODO: Capture Posthog event for detecting custom spam word
  const isCustomSpam = customSpamWords.some((spamWord) => {
    const regex = new RegExp(`\\b${spamWord}\\b`, "i");
    return regex.test(submissionText);
  });

  // Check using Akismet
  const akismetResult = await akismet.checkComment(comment);
  const isAkismetSpam = akismetResult !== CheckResult.ham;

  // Combine results from custom spam and Akismet checks
  const isSpam = isCustomSpam || isAkismetSpam;

  return isSpam;
};

// const sendNewSubmissionEmail = async (form) => {
//      const { emailRecipients, emailThreads } = form.settings;
//      const emailRecipientIds: Id<"users">[] = emailRecipients.map(
//        (id) => id as Id<"users">,
//      );

//      // testing purposes: flag for skipping emails
//      const emailActive = process.env.NODE_ENV !== "development";

//      if (emailRecipientIds.length > 0 && emailActive) {
//        const recipientEmails = (
//          await convex.query(api.users.getEmailsForUserIds, {
//            userIds: emailRecipientIds,
//          })
//        ).filter((email): email is string => !!email);

//        await convex.action(api.emails.sendNewSubmissionEmail, {
//          emailThreads,
//          recipientEmails,
//          submissionData,
//          formId,
//        });
//      }
// }
