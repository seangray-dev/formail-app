import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const roles = v.union(v.literal('admin'), v.literal('member'));

export default defineSchema({
  forms: defineTable({
    name: v.string(),
    orgId: v.string(),
    description: v.string(),
    settings: v.object({
      emailRecipients: v.array(v.string()),
      emailThreads: v.boolean(),
      honeypotField: v.optional(v.string()),
      customSpamWords: v.optional(v.string()),
      spamProtectionService: v.string(),
      spamProtectionSecret: v.optional(v.string()),
    }),
  }).index('by_orgId', ['orgId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(v.string()),
    remainingSubmissions: v.number(),
    subscriptionId: v.optional(v.string()),
    endsOn: v.optional(v.number()),
  })
    .index('by_tokenIdentifier', ['tokenIdentifier'])
    .index('by_subscriptionId', ['subscriptionId']),
  submissions: defineTable({
    formId: v.id('forms'),
    data: v.string(),
    files: v.optional(
      v.array(
        v.object({
          storageId: v.string(),
          type: v.union(
            v.literal('image/jpeg'),
            v.literal('image/png'),
            v.literal('application/pdf')
          ),
        })
      )
    ),
  }),
  userOrgRoles: defineTable({
    userId: v.id('users'),
    orgId: v.string(),
    role: roles,
  })
    .index('by_orgId_and_role', ['orgId', 'role'])
    .index('by_orgId', ['orgId']),
});
