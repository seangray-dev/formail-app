import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx, query } from './_generated/server';

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError('No user identity provided');
  }
  const tokenId = identity.tokenIdentifier.split('|').pop() as string;

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', tokenId))
    .first();

  if (!user) {
    throw new ConvexError('No user found');
  }

  const roleRecord = await ctx.db
    .query('userOrgRoles')
    .filter((q) =>
      q.and(q.eq(q.field('orgId'), orgId), q.eq(q.field('userId'), user._id))
    )
    .first();

  return !!roleRecord;
}

export async function isAdminOfOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
): Promise<boolean> {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) throw new ConvexError('No user found');

  const tokenId = identity.tokenIdentifier.split('|').pop() as string;

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', tokenId))
    .first();
  if (!user) throw new ConvexError('No user found');

  const roleRecord = await ctx.db
    .query('userOrgRoles')
    .filter((q) =>
      q.and(q.eq(q.field('orgId'), orgId), q.eq(q.field('userId'), user._id))
    )
    .first();
  return roleRecord?.role === 'admin';
}

export const isAdminUserOfOrg = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    return isAdminOfOrg(ctx, args.orgId);
  },
});

export async function checkSubscriptionStatusAndFormCount(
  ctx: QueryCtx | MutationCtx
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error('User must be authenticated to check subscription status');
  }

  const tokenId = identity.tokenIdentifier.split('|').pop() as string;

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', tokenId))
    .first();

  if (!user) {
    throw new Error('User not found');
  }

  const currentTime = Date.now();
  const hasActiveSubscription =
    user.subscriptionId && user.endsOn && user.endsOn > currentTime;

  if (hasActiveSubscription) {
    return {
      hasActiveSubscription,
    };
  }

  const forms = await ctx.db
    .query('forms')
    .withIndex('by_orgId', (q) => q.eq('orgId', user.orgIds[0]))
    .collect();

  const formCount = forms.length;

  return {
    hasActiveSubscription,
    formCount,
  };
}

export const checkSubStatus = async (
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>
) => {
  const user = await ctx.db.get(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const currentTime = Date.now();
  const hasActiveSubscription =
    user.subscriptionId && user.endsOn && user.endsOn > currentTime;

  return {
    hasActiveSubscription,
    remainingSubmissions: user.remainingSubmissions,
  };
};

export const checkUserSubscription = query({
  args: { userId: v.id('users') },

  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const currentTime = Date.now();

    const hasActiveSubscription =
      user.subscriptionId && user.endsOn && user.endsOn > currentTime;

    return hasActiveSubscription;
  },
});
