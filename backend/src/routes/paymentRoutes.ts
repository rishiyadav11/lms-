import { Hono } from 'hono';
import { processPayment, getPayments } from '../controllers/paymentControllers';

const paymentRoutes = new Hono();

// Process a payment
paymentRoutes.post('/', processPayment);

// Get all payments
paymentRoutes.get('/', getPayments);

export default paymentRoutes;
