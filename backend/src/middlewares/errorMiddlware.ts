import { Context, Next } from 'hono';

export const errorMiddleware = async (c: Context, next: Next) => {
    try {
        await next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Error:', err);
        return c.json({ error: 'Internal Server Error' }, 500);
    }
};
