import { Context, Next } from 'hono';

export const loggerMiddleware = async (c: Context, next: Next) => {
    const start = Date.now();
    await next(); // Proceed to the next middleware or route handler
    const ms = Date.now() - start;
    console.log(`${c.req.method} ${c.req.url} - ${ms}ms`);
};
