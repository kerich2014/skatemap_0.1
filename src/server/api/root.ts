import { createTRPCRouter } from "skatemap_new/server/api/trpc";
import { exampleRouter } from "skatemap_new/server/api/routers/example";
import { mapRouter } from "skatemap_new/server/api/routers/map";
import { userRouter } from "./routers/user";
import { blogRouter } from "./routers/blog";
import { videoRouter } from "./routers/video";
import { authRouter } from "./routers/auth";
import { userTrickRouter } from "./routers/userTrick";
import { tricksRouter } from "./routers/tricks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  map: mapRouter,
  user: userRouter,
  blog: blogRouter,
  video: videoRouter,
  auth: authRouter,
  trick: tricksRouter,
  userTrick: userTrickRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
