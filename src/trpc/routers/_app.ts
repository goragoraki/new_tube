import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';
export const appRouter = createTRPCRouter({
    hello: protectedProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            console.log({ dbUser: opts.ctx.user })
            return {
                greeting: `hello ${opts.ctx.user.name}`,
            };
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;