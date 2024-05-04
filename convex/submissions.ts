import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getUserByFormId } from "./users";
import { checkSubStatus, hasAccessToOrg, isAdminOfOrg } from "./utils";

export const addSubmission = mutation({
  args: {
    formId: v.id("forms"),
    data: v.string(),
    files: v.optional(
      v.array(
        v.object({
          storageId: v.string(),
          type: v.union(
            v.literal("image/jpeg"),
            v.literal("image/png"),
            v.literal("application/pdf"),
          ),
        }),
      ),
    ),
  },

  async handler(ctx, { formId, data, files = [] }) {
    const user = await getUserByFormId(ctx, { formId });
    const { hasActiveSubscription } = await checkSubStatus(ctx, user._id);

    if (!hasActiveSubscription && user.remainingSubmissions <= 0) {
      throw new Error(
        "Submission limit reached. Please upgrade your plan for more submissions.",
      );
    }

    await ctx.db.insert("submissions", {
      formId,
      data,
      files,
    });

    if (!hasActiveSubscription) {
      await ctx.db.patch(user._id, {
        remainingSubmissions: user.remainingSubmissions - 1,
      });
    }
  },
});

export const getSubmissionsByFormId = query({
  args: { formId: v.id("forms") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      console.error("you must be signed in to access form details");
      // throw new ConvexError('You must be signed in to access form details.');
    }

    // Check if the form exists and the user has access to it
    const form = await ctx.db.get(args.formId);

    if (!form) {
      throw new ConvexError("Form not found.");
    }

    const hasAccess = await hasAccessToOrg(ctx, form.orgId);

    if (!hasAccess) {
      console.error(
        "you do not have permissions to view these form submissions",
      );
      // throw new ConvexError(
      //   "You do not have permission to view these form submissions.",
      // );
    }

    // Fetch and return all submissions for the provided formId
    const _submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("formId"), args.formId))
      .collect();

    // Map over submissions and generate URLs for any file storage IDs
    const submissions = await Promise.all(
      _submissions.map(async (submission) => {
        const _files = await Promise.all(
          (submission.files || []).map(async (fileMetadata) => {
            const storageId = fileMetadata.storageId as Id<"_storage">;
            const fileUrl = await ctx.storage.getUrl(storageId);
            if (!fileUrl) {
              return "";
            }
            // Combine the original file metadata with the generated URL
            return {
              ...fileMetadata,
              url: fileUrl,
            };
          }),
        );

        // Return the submission with the new files array
        return {
          ...submission,
          files: _files,
        };
      }),
    );

    return submissions;
  },
});

export const deleteSubmissionById = mutation({
  args: { submissionId: v.id("submissions") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("No user identity provided");
    }

    // Retrieve the submission
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new ConvexError("This submission does not exist");
    }

    // Retrieve the form associated with the submission to get the orgId
    const form = await ctx.db.get(submission.formId);
    if (!form) {
      throw new ConvexError(
        "Form associated with this submission does not exist",
      );
    }

    // Check if the user has access to the org and is an admin
    const hasAccess = await isAdminOfOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError(
        "You do not have permission to delete this submission",
      );
    }

    // Proceed with deletion
    await ctx.db.delete(args.submissionId);
  },
});

export const toggleSubmissionAsSpam = mutation({
  args: { submissionId: v.id("submissions") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("No user identity provided");
    }

    // Retrieve the submission
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new ConvexError("This submission does not exist");
    }

    // Retrieve the form associated with the submission to get the orgId
    const form = await ctx.db.get(submission.formId);
    if (!form) {
      throw new ConvexError(
        "Form associated with this submission does not exist",
      );
    }

    // Check if the user has access to the org and is an admin
    const hasAccess = await isAdminOfOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError(
        "You do not have permission to mark this submission as spam",
      );
    }

    // Toggle the spam status of the submission
    const updatedIsSpam = !submission.isSpam;
    await ctx.db.patch(args.submissionId, { isSpam: updatedIsSpam });

    // Optionally return the updated submission status or some confirmation message
    return { submissionId: args.submissionId, isSpam: updatedIsSpam };
  },
});

export const getSubmissionsByDateRange = query({
  args: {
    formId: v.id("forms"),
    fromDate: v.number(),
    toDate: v.number(),
  },
  async handler(ctx, { formId, fromDate, toDate }) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be signed in to access form details.");
    }

    const form = await ctx.db.get(formId);

    if (!form) {
      throw new ConvexError("Form not found.");
    }

    const hasAccess = await hasAccessToOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError(
        "You do not have permission to view these form submissions.",
      );
    }

    // Fetch and return all submissions for the provided formId within the date range
    const _submissions = await ctx.db
      .query("submissions")
      .filter((q) =>
        q.and(
          q.eq(q.field("formId"), formId),
          q.gte(q.field("_creationTime"), fromDate),
          q.lte(q.field("_creationTime"), toDate),
        ),
      )
      .collect();

    const submissions = _submissions.map((submission) =>
      JSON.parse(submission.data),
    );

    return submissions;
  },
});

export const generateUploadUrl = mutation(async ({ storage }) => {
  return await storage.generateUploadUrl();
});

export const generateFileUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
