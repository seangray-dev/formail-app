import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query,
} from './_generated/server';
import { roles } from './schema';

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError('expected user to be defined');
  }

  return user;
}

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  async handler(ctx, args) {
    const clerkUserId = args.tokenIdentifier.split('|')[1];

    const userId = await ctx.db.insert('users', {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [clerkUserId],
      name: args.name,
      email: args.email,
      image: args.image,
    });

    await ctx.db.insert('userOrgRoles', {
      userId: userId,
      orgId: clerkUserId,
      role: 'admin',
    });
  },
});

export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('users')
      .withIndex('by_tokenIdentifier', (q) =>
        q.eq('tokenIdentifier', args.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError('no user with this token found');
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, args.orgId],
    });

    await ctx.db.insert('userOrgRoles', {
      userId: user._id,
      orgId: args.orgId,
      role: args.role,
    });
  },
});

export const updateRoleInOrgForUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    const userOrgRole = await ctx.db
      .query('userOrgRoles')
      .filter((q) =>
        q.and(
          q.eq(q.field('userId'), user._id),
          q.eq(q.field('orgId'), args.orgId)
        )
      )
      .first();

    if (!userOrgRole) {
      throw new ConvexError('Organization role not found');
    }

    await ctx.db.patch(userOrgRole._id, { role: args.role });
  },
});

export const getUserProfile = query({
  args: { userId: v.id('users') },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      image: user?.image,
    };
  },
});

export const getMe = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) {
      return null;
    }

    return user;
  },
});

export const getAdminsByOrgId = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const userOrgRoles = await ctx.db
      .query('userOrgRoles')
      .filter((q) =>
        q.and(
          q.eq(q.field('orgId'), args.orgId),
          q.eq(q.field('role'), 'admin')
        )
      )
      .collect();

    const adminUserIds = userOrgRoles.map((role) => role.userId);

    const admins = await Promise.all(
      adminUserIds.map((userId) => ctx.db.get(userId))
    );

    return admins.filter(Boolean).map((admin) => ({
      id: admin?._id,
      name: admin?.name,
      email: admin?.email,
    }));
  },
});
