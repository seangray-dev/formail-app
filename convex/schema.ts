import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const roles = v.union(v.literal('admin'), v.literal('member'));

export default defineSchema({
  forms: defineTable({
    name: v.string(),
    orgId: v.string(),
    description: v.string(),
  }).index('by_orgId', ['orgId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
  submissions: defineTable({
    formId: v.id('forms'),
    data: v.string(),
  }),
});
