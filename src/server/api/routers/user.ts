import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "skatemap_new/server/api/trpc";

export const userRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.user.findMany()
    return result
  }),

  getById: publicProcedure.input(z.object({email: z.string()})).query(async({
    input, ctx}) => {
        const {email} = input
        if(email == "") return null
        const user = await ctx.prisma.user.findUnique({where: {email}, select: 
            {id: true, name: true, email: true, image: true, roleId: true, lvl: true}})
            if(user == null) return
            return{
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.roleId,
                lvl: user.lvl,
            }
    }),

    getLvl: publicProcedure.input(z.object({id: z.string()})).query(async({
      input, ctx}) => {
          const {id} = input
          if(id == "") return null
          const user = await ctx.prisma.user.findUnique({where: {id}, select: 
              {id: true, lvl: true}})
              if(user == null) return
              return{
                  id: user.id,
                  lvl: user.lvl,
              }
      }),

    uploadData: publicProcedure.input(z.object({
        id: z.string(),
        image: z.string(),
        name: z.string(),
        })).mutation(async ({ ctx, input}) => {
          let {id, image, name} = input

          if( name ==""){
            name = ctx.session?.user.name as string
          }

          if( image ==""){
            image = ctx.session?.user.image as string
          }

         return ctx.prisma.user.update({
            where: {
                id,
            },
            data: {
                image,
                name,
            },
         })
      }),

      getTricks: publicProcedure.input(z.object({id: z.string()})).query(async({
        input, ctx}) => {
            const {id} = input
            const userId = z.string()
            const user = await ctx.prisma.user.findUnique({
              where: {
                id
              },
              include: {
                tricks: {
                  where: {
                    userId: id
                  }
                }
              },
              })
              return user?.tricks
        }),

        updateLvl: publicProcedure.input(z.object({
          id: z.string(),
          lvl: z.number(),
          })).mutation(async ({ ctx, input}) => {
            let {id, lvl} = input
  
           return ctx.prisma.user.update({
              where: {
                  id,
              },
              data: {
                  lvl,
              },
           })
        }),

      uploadImage: publicProcedure.input(z.object({
        id: z.string(),
        image: z.string(),
        })).mutation(async ({ ctx, input}) => {
          let {id, image} = input

         return ctx.prisma.user.update({
            where: {
                id,
            },
            data: {
                image,
            },
         })
      }),
});

