import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "skatemap_new/server/api/trpc";

export const tricksRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.tricks.findMany()
    return result
  }),

  getFlat: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.tricks.findMany({
        where: {
            typeTrickId: 1
        },
    })
    return result
  }),


  changeAccept: publicProcedure
  .input(z.object({
    id: z.number(),
    accept: z.boolean(),
  }))
  .mutation(async ({ctx, input}) => {
    let {id, accept} = input
    return ctx.prisma.videos.update({
      where: {
        id,
      },
      data: {
        accept,
      }
    })
  }),
});
