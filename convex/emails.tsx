import { ConvexError, v } from "convex/values";
import { Resend } from "resend";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import NewSubmissionEmail from "./emails/NewSubmission";
import WelcomeEmail from "./emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const { error } = await resend.emails.send({
    from: "Formail Notification <noreply@formail.dev>",
    to: email,
    subject: "Welcome to Formail!",
    react: WelcomeEmail({ name }),
  });

  if (error) {
    console.error(error);
    throw new ConvexError({ message: error.message });
  }
};

export const sendNewSubmissionEmail = action({
  args: {
    emailThreads: v.boolean(),
    recipientEmails: v.array(v.string()),
    submissionData: v.any(),
    formId: v.id("forms"),
  },
  async handler(ctx, args) {
    let emailHeaders = {} as any;
    const form = await ctx.runQuery(internal.forms.getFormByIdInternal, {
      formId: args.formId,
    });

    if (args.emailThreads) {
      // When threading is enabled, use a consistent Message-ID
      emailHeaders["Message-ID"] = `<form-${form._id}@formail.dev>`;
    } else {
      // When threading is disabled, use a unique X-Entity-Ref-ID
      emailHeaders["X-Entity-Ref-ID"] =
        `submission-${form._id}-${new Date().getTime()}`;
    }

    const { error } = await resend.emails.send({
      from: "Formail Notification <noreply@formail.dev>",
      to: args.recipientEmails,
      subject: `New Submission - ${form.name}`,
      react: (
        <NewSubmissionEmail
          formName={form.name}
          submissionData={args.submissionData}
        />
      ),
      headers: emailHeaders,
    });

    if (error) {
      console.error(error);
      throw new ConvexError({ message: error.message });
    }

    return "email sent" as const;
  },
});
