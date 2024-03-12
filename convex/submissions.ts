import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { hasAccessToOrg } from './forms';

export const addSubmission = mutation({
  args: {
    formId: v.id('forms'),
    data: v.string(),
  },
  async handler(ctx, { formId, data }) {
    await ctx.db.insert('submissions', {
      formId,
      data,
    });
  },
});

export const getSubmissionsByFormId = query({
  args: { formId: v.id('forms') },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('You must be signed in to access form details.');
    }

    // Check if the form exists and the user has access to it
    const form = await ctx.db.get(args.formId);

    if (!form) {
      throw new ConvexError('Form not found.');
    }

    const hasAccess = await hasAccessToOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError(
        'You do not have permission to view these form submissions.'
      );
    }

    // Fetch and return all submissions for the provided formId
    const submissions = await ctx.db
      .query('submissions')
      .filter((q) => q.eq(q.field('formId'), args.formId))
      .collect();

    return submissions;
  },
});
