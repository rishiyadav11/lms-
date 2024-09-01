import { Context } from 'hono';
import Enrollment from '../models/Enrollment'; // Assuming you have an Enrollment model

// Enroll a student in a course
export const enrollStudent = async (c: Context) => {
    const { studentId, courseId } = await c.req.json();

    // Check if the student is already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });

    if (existingEnrollment) {
        return c.json({ error: 'Student is already enrolled in this course' }, 400);
    }

    const newEnrollment = new Enrollment({
        student: studentId,
        course: courseId,
        enrolledAt: new Date(),
    });

    await newEnrollment.save();
    return c.json({ message: 'Student enrolled successfully', enrollment: newEnrollment }, 201);
};

// Get all enrollments
export const getEnrollments = async (c: Context) => {
    const enrollments = await Enrollment.find().populate('student course'); // Populating student and course info if needed
    return c.json(enrollments);
};
