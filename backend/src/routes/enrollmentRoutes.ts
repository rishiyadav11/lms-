import { Hono } from 'hono';
import { enrollStudent, getEnrollments } from '../controllers/enrollmentControllers';

const enrollmentRoutes = new Hono();

// Enroll a student
enrollmentRoutes.post('/', enrollStudent);

// Get all enrollments
enrollmentRoutes.get('/', getEnrollments);

export default enrollmentRoutes;
