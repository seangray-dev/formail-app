import { ConvexError, v } from 'convex/values';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';

export const createForm = mutation({
  args: { name: v.string(), description: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('you must be signed in to create a file');
    }

    await ctx.db.insert('forms', {
      name: args.name,
      description: args.description,
      orgId: args.orgId,
    });
  },
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

export const getForms = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    return ctx.db
      .query('forms')
      .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
      .collect();
  },
});

export const deleteForm = mutation({
  args: { formId: v.id('forms') },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('No user identity provided');
    }

    const form = await ctx.db.get(args.formId);

    if (!form) {
      throw new ConvexError('This form does not exist');
    }

    const hasAccess = await hasAccessToOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError('you do not have access to delete this form');
    }

    // Retrieve all submissions associated with the form
    const submissions = await ctx.db
      .query('submissions')
      .filter((q) => q.eq(q.field('formId'), args.formId))
      .collect();

    // Delete all associated submissions
    for (const submission of submissions) {
      await ctx.db.delete(submission._id);
    }

    await ctx.db.delete(args.formId);
  },
});

export const getFormById = query({
  args: { formId: v.id('forms') },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('You must be signed in to access form details.');
    }

    const form = await ctx.db.get(args.formId);

    if (!form) {
      throw new ConvexError('Form not found.');
    }

    const hasAccess = await hasAccessToOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError('You do not have permission to view this form.');
    }

    return form;
  },
});
