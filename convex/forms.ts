import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createForm = mutation({
  args: { name: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('you must be signed in to create a file');
    }

    await ctx.db.insert('forms', {
      name: args.name,
    });
  },
});

export const getForms = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    return ctx.db.query('forms').collect();
  },
});
