import { EmailTemplate } from "@/components/resend/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Doc } from "../../convex/_generated/dataModel";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailNotification = async (
  emailThreads: boolean,
  recipientEmails: string[],
  submissionData: { [key: string]: any },
  form: Doc<"forms">,
) => {
  let headers = {} as any;
  const subject = `New Submission - ${form.name}`;
  if (emailThreads) {
    // When threading is enabled, use a consistent Message-ID
    headers["Message-ID"] = `<form-${form._id}@formail.dev>`;
  } else {
    // When threading is disabled, use a unique X-Entity-Ref-ID
    headers["X-Entity-Ref-ID"] =
      `submission-${form._id}-${new Date().getTime()}`;
  }

  try {
    const { error } = await resend.emails.send({
      from: "Formail Notification <noreply@formail.dev>",
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
          error: "Resend: Email failed",
          details: error.message,
        }),
        { status: 500 },
      );
    }
  } catch (err) {
    console.error(err);
  }
};
