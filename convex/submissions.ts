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

export const deleteSubmissionById = mutation({
  args: { submissionId: v.id('submissions') },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('No user identity provided');
    }

    // Retrieve the submission
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new ConvexError('This submission does not exist');
    }

    // Retrieve the form associated with the submission to get the orgId
    const form = await ctx.db.get(submission.formId);
    if (!form) {
      throw new ConvexError(
        'Form associated with this submission does not exist'
      );
    }

    // Ensure form._id and submissions.formId match up
    if (submission.formId !== form._id) {
      throw new ConvexError('Submission and form IDs do not match');
    }

    // Retrieve the user
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('tokenIdentifier'), identity.tokenIdentifier))
      .first();
    if (!user) {
      throw new ConvexError('User not found');
    }

    // Check if the user is part of the organization and has the 'admin' role
    const userOrg = user.orgIds.find((org) => org.orgId === form.orgId);
    console.log(userOrg);
    console.log(form.orgId);
    const userOrgRole = userOrg ? userOrg.role : null;

    console.log(`User role for org ${form.orgId}:`, userOrgRole);
    console.log(`User organizations:`, user.orgIds);

    if (!userOrgRole || userOrgRole !== 'admin') {
      throw new ConvexError(
        'You do not have permission to delete this submission'
      );
    }

    // Proceed with deletion
    await ctx.db.delete(args.submissionId);
  },
});
