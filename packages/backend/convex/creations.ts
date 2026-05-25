import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const getCurrentUserId = async (
  ctx: Parameters<typeof authComponent.getAuthUser>[0]
) => {
  const user = await authComponent.getAuthUser(ctx);
  return user._id;
};

const normalizeName = (name: string) => name.trim();

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    return await ctx.db
      .query("creations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: {
    id: v.id("creations"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const creation = await ctx.db.get(args.id);

    if (!creation || creation.userId !== userId) {
      return null;
    }

    return creation;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const name = normalizeName(args.name);

    if (!name) {
      throw new ConvexError("Creation name is required");
    }

    const now = Date.now();

    return await ctx.db.insert("creations", {
      name,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("creations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const creation = await ctx.db.get(args.id);

    if (!creation || creation.userId !== userId) {
      throw new ConvexError("Creation not found");
    }

    const name = normalizeName(args.name);

    if (!name) {
      throw new ConvexError("Creation name is required");
    }

    await ctx.db.patch(args.id, {
      name,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("creations"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    const creation = await ctx.db.get(args.id);

    if (!creation || creation.userId !== userId) {
      throw new ConvexError("Creation not found");
    }

    await ctx.db.delete(args.id);
  },
});
