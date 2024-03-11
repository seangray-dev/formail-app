import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  forms: defineTable({
    description: v.string(),
    name: v.string(),
    orgId: v.string(),
  }).index('by_orgId', ['orgId']),
  users: defineTable({
    image: v.optional(v.string()),
    name: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: v.union(v.literal('admin'), v.literal('member')),
      })
    ),
    tokenIdentifier: v.string(),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
});
