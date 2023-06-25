import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "skatemap_new/server/api/trpc";

export const videoRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.videos.findMany({
      where: {
        accept: null
      }
    })
    return result
  }),

  sendVideo: publicProcedure.input(z.object({
    userId: z.string(),
    video: z.string(),
    trickId: z.number(),
    })).mutation(async ({ ctx, input }) => {
     const {userId, video, trickId} = input 
      
      const result = await ctx.prisma.videos.create({data: {userId, video, trickId}})
      
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

  deleteVideo: publicProcedure
  .input(z.number())
  .mutation(async ({ctx, input}) => {
    return ctx.prisma.videos.delete({
      where: {
        id: input
      }
    })
  }),
});
