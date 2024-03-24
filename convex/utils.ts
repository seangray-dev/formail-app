import { ConvexError, v } from 'convex/values';
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
