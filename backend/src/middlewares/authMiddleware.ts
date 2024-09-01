import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

// Ensure the environment variable is set
const SECRET_KEY = process.env.JWT_SECRET as string;

export const authMiddleware = async (c: Context, next: Next) => {
    // Access the 'Authorization' header
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        // Define the expected payload type
        interface JwtPayload {
            id: string;
            role: string;
        }

        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        c.set('user', decoded); // Set the user data to context
        await next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return c.json({ error: 'Invalid token' }, 403);
    }
};


// Middleware to check if the user is an instructor
export const instructorMiddleware = async (c: Context, next: Next) => {
    const user = c.get('user');
    
    if (user && user.role === 'instructor') {
        await next();
    } else {
        return c.json({ error: 'Forbidden: Only instructors can perform this action' }, 403);
    }
};
