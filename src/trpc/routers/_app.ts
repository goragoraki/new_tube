import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';

export const appRouter = createTRPCRouter({
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