import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query,
} from './_generated/server';
import { roles } from './schema';

export const getMe = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await getUser(ctx, identity.tokenIdentifier);

    if (!user) {
      console.error('No user found');
      return;
    }

    return user;
  },
});

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  // Extract the ID part from the tokenIdentifier
  const tokenId = tokenIdentifier.split('|').pop() as string;

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', tokenId))
    .first();

  if (!user) {
    console.error('No user found with tokenIdentifier', tokenId);
    return;
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
    const userId = await ctx.db.insert('users', {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [args.tokenIdentifier],
      name: args.name,
      email: args.email,
      image: args.image,
      remainingSubmissions: 500,
    });

    await ctx.db.insert('userOrgRoles', {
      userId: userId,
      orgId: args.tokenIdentifier,
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

    if (!user) {
      return;
    }

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

    if (!user) {
      return;
    }

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

export const getAllUsersByOrgId = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const userOrgRoles = await ctx.db
      .query('userOrgRoles')
      .filter((q) => q.eq(q.field('orgId'), args.orgId))
      .collect();

    const userIds = userOrgRoles
      .map((mapping) => mapping.userId)
      .filter(Boolean);

    const users = await Promise.all(
      userIds.map((userId) => ctx.db.get(userId))
    );
    const validUsers = users.filter((user) => user && user._id);

    return validUsers.map((user) => ({
      id: user?._id.toString(),
      name: user?.name || 'Unknown Name',
      email: user?.email || 'No Email',
    }));
  },
});

export const getUsersByOrgIdWithRoles = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    // Fetch all user-role mappings for the specified orgId
    const userOrgRoles = await ctx.db
      .query('userOrgRoles')
      .filter((q) => q.eq(q.field('orgId'), args.orgId))
      .collect();

    // Map userIds to their roles for easy access
    const userIdToRole = new Map(
      userOrgRoles.map((mapping) => [mapping.userId.toString(), mapping.role])
    );

    // Fetch user details for each user in the userOrgRoles
    const usersPromises = userOrgRoles.map(async (mapping) => {
      const user = await ctx.db.get(mapping.userId); // Use the ID directly
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

    // Filter out any null values and return the users with their roles
    return usersWithRoles.filter(
      (user): user is NonNullable<typeof user> => user !== null
    );
  },
});

export const getEmailsForUserIds = query({
  args: { userIds: v.array(v.id('users')) },
  async handler(ctx, { userIds }) {
    // Fetch details for each user ID
    const usersPromises = userIds.map(async (userId) => {
      const user = await ctx.db.get(userId);
      return user ? { id: user._id, email: user.email } : null;
    });

    const users = await Promise.all(usersPromises);

    // Filter out any null values and return the emails
    const emails = users
      .filter(Boolean)
      .map((user) => user?.email)
      .filter(Boolean);
    return emails;
  },
});

export const updateSubscription = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    subscriptionId: v.string(),
    endsOn: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.tokenIdentifier);

    if (!user) {
      throw new Error('no user found with that user id');
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
      endsOn: args.endsOn,
    });
  },
});

export const updateSubscriptionBySubId = internalMutation({
  args: { subscriptionId: v.string(), endsOn: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_subscriptionId', (q) =>
        q.eq('subscriptionId', args.subscriptionId)
      )
      .first();

    if (!user) {
      throw new Error('no user found with that subscription id');
    }

    await ctx.db.patch(user._id, {
      endsOn: args.endsOn,
    });
  },
});

export const getUserByFormId = query({
  args: {
    formId: v.id('forms'),
  },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error('Form not found');
    }

    // Use the orgId from the form to find associated userOrgRoles
    const userOrgRoles = await ctx.db
      .query('userOrgRoles')
      .withIndex('by_orgId', (q) => q.eq('orgId', form.orgId))
      .collect();

    if (userOrgRoles.length === 0) {
      throw new Error("No users found for the given form's organization");
    }

    // Assuming you want the first userOrgRole for simplicity
    const firstUserOrgRole = userOrgRoles[0];

    // Fetch the user details using the userId from the firstUserOrgRole
    const user = await ctx.db.get(firstUserOrgRole.userId);
    if (!user) {
      throw new Error('User not found for the given form');
    }

    return user;
  },
});
