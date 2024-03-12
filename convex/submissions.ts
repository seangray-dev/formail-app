import { v } from 'convex/values';
import { mutation } from './_generated/server';

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
