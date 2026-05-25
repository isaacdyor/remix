import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  creations: defineTable({
    name: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
