import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { hasAccessToOrg, isAdminOfOrg } from './orgAccess';

export const createForm = mutation({
  args: { name: v.string(), description: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('you must be signed in to create a form');
    }

    await ctx.db.insert('forms', {
      name: args.name,
      description: args.description,
      orgId: args.orgId,
    });
  },
});

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

export const deleteSubmissionsForForm = mutation({
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

    const hasAccess = await isAdminOfOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError('you do not have access to delete this form');
    }

    const submissions = await ctx.db
      .query('submissions')
      .filter((q) => q.eq(q.field('formId'), args.formId))
      .collect();

    for (const submission of submissions) {
      await ctx.db.delete(submission._id);
    }
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

    const hasAccess = await isAdminOfOrg(ctx, form.orgId);

    if (!hasAccess) {
      throw new ConvexError('you do not have access to delete this form');
    }

    await deleteSubmissionsForForm(ctx, { formId: args.formId });

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
