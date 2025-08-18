import { studioRouter } from '@/modules/studio/server/procedures';
import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videosRouter } from '@/modules/videos/sever/procedures';

export const appRouter = createTRPCRouter({
    videos: videosRouter,
    studio: studioRouter,
    categories: categoriesRouter,
})

export type AppRouter = typeof appRouter;

// export const appRouter = createTRPCRouter({
//     hello: protectedProcedure
//         .input(
//             z.object({
//                 text: z.string(),
//             }),
//         )
//         .query((opts) => {
//             console.log({ dbUser: opts.ctx.user })
//             return {
//                 greeting: `hello input:${opts.input.text} retrun value protectedProcedure: ${opts.ctx.user.name}`,
//             };
//         }),
// });
// // export type definition of API
// export type AppRouter = typeof appRouter;