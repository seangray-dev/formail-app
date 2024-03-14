import { ConvexError, v } from 'convex/values';
import { MutationCtx, QueryCtx } from './_generated/server';

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError('No user identity provided');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
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

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
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
