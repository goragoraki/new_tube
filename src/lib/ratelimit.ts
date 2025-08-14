import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "./redis";

export const ratelimt = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10s"), // (request, limit time)
});