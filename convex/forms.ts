import { useQuery } from 'convex/react';
import { ConvexError, v } from 'convex/values';
import { api } from './_generated/api';
import { mutation, query } from './_generated/server';
import { hasAccessToOrg, isAdminOfOrg } from './orgAccess';

export const createForm = mutation({
  args: { name: v.string(), description: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('you must be signed in to create a form');
    }

    // store admin id's in the form settings email recipients
    const userOrgRoles = await ctx.db
      .query('userOrgRoles')
      .filter((q) => q.eq(q.field('orgId'), args.orgId))
      .collect();

    const userIdToRole = new Map(
      userOrgRoles.map((mapping) => [mapping.userId.toString(), mapping.role])
    );

    const usersPromises = userOrgRoles.map(async (mapping) => {
      const user = await ctx.db.get(mapping.userId);
      return user
        ? {
            id: user._id.toString(),
            name: user.name || 'Unknown Name',
            email: user.email || 'No Email',
            role: userIdToRole.get(user._id.toString()) as
              | 'admin'
              | 'member'
              | undefined,
          }
        : null;
    });

    const usersWithRoles = await Promise.all(usersPromises);

    const orgUsers = usersWithRoles.filter(
      (user): user is NonNullable<typeof user> => user !== null
    );

    const defaultAdmins =
      orgUsers
        ?.filter((user) => user.role === 'admin')
        .map((admin) => admin.id) || [];

    await ctx.db.insert('forms', {
      name: args.name,
      description: args.description,
      orgId: args.orgId,
      settings: {
        emailRecipients: defaultAdmins,
        emailThreads: true,
        honeypotField: '',
        customSpamWords: '',
        spamProtectionService: 'None',
        spamProtectionSecret: '',
      },
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
