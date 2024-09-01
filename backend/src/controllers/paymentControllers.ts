import { Context } from 'hono';
import Payment from '../models/Payment';
import Course from '../models/Course';
import User from '../models/User';

// Process a payment
export const processPayment = async (c: Context) => {
    const { userId, courseId, amount, paymentMethod } = await c.req.json();

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
        return c.json({ error: 'Invalid user or course' }, 400);
    }

    try {
        // Simulate payment processing (replace with actual payment gateway logic)
        const paymentStatus = 'success'; // This should come from the payment gateway response

        const payment = new Payment({
            user: userId,
            course: courseId,
            amount,
            status: paymentStatus,
            paymentMethod,
        });

        await payment.save();

        return c.json({ message: 'Payment processed successfully', payment }, 201);
    } catch (error) {
        return c.json({ error: 'Payment processing failed' }, 500);
    }
};

// Get all payments
export const getPayments = async (c: Context) => {
    try {
        const payments = await Payment.find().populate('user course');
        return c.json(payments);
    } catch (error) {
        return c.json({ error: 'Failed to retrieve payments' }, 500);
    }
};
