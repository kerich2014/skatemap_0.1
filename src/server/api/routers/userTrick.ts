import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "skatemap_new/server/api/trpc";

export const userTrickRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getWhere: publicProcedure
  .input(z.object({userId: z.string(), trickId: z.number()}))
  .query(async ({ ctx, input }) => {
    let {userId, trickId} = input
    const result = await ctx.prisma.usersTricks.findMany({
        where: {
            userId,
            trickId,
        }
    })
    return result
  }),

  sendNode: publicProcedure.input(z.object({
    userId: z.string(),
    trickId: z.number(),
    })).mutation(async ({ ctx, input }) => {
     const {userId, trickId} = input 
      
      const result = await ctx.prisma.usersTricks.create({data: {userId, trickId}})
      
      return result
  }),

  deletePoint: publicProcedure
  .input(z.number())
  .mutation(async ({ctx, input}) => {
    return ctx.prisma.placemarks.delete({
      where: {
        id: input
      }
    })
  }),

});
