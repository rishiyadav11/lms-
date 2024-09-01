import { Hono } from 'hono';
import formidable from 'formidable';
import courseRoutes from './routes/courseRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import paymentRoutes from './routes/paymentRoutes';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorMiddleware } from './middlewares/errorMiddlware';
import { loggerMiddleware } from './middlewares/loggerMiddlware';
import { IncomingMessage } from 'node:http';

const app = new Hono();

// Middleware to handle form data and file uploads
app.use('*', async (c, next) => {
  const form = new formidable.IncomingForm();

  await new Promise<void>((resolve, reject) => {
    form.parse(c.req.raw as unknown as IncomingMessage, (err: any, fields: any, files: any) => {
      if (err) {
        reject(c.json({ error: 'Error parsing form data' }, 400));
      } else {
        (c.req as any).body = fields;
        (c.req as any).files = files;
        resolve();
      }
    });
  });

  return next();
});

// Global middlewares
app.use('*', loggerMiddleware);
app.use('*', errorMiddleware);

// Apply auth middleware to protected routes
app.use('/api/courses/*', authMiddleware);
app.use('/api/enrollments/*', authMiddleware);
app.use('/api/payments/*', authMiddleware);

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/courses', courseRoutes);
app.route('/api/enrollments', enrollmentRoutes);
app.route('/api/payments', paymentRoutes);

export default app;
