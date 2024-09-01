import { Hono } from 'hono';
import { 
    createCourse, 
    addVideoToCourse, 
    updateVideoInCourse, 
    deleteVideoFromCourse, 
    getCourseById, 
    addCommentToVideo,
    getAllCourses,
    deleteCourse 
} from '../controllers/courseControllers';

const router = new Hono();

// Create a new course
router.post('/courses', createCourse);

// Add a video to a course
router.post('/courses/:id/videos', addVideoToCourse);

// Update a video in a course
router.put('/courses/:courseId/videos/:videoId', updateVideoInCourse);

// Delete a video from a course
router.delete('/courses/:courseId/videos/:videoId', deleteVideoFromCourse);

// Get all courses
router.get('/courses', getAllCourses);

// Get a course by ID
router.get('/courses/:id', getCourseById);

// Delete a course
router.delete('/courses/:id', deleteCourse);

// Add a comment to a video
router.post('/courses/:courseId/videos/:videoId/comments', addCommentToVideo);

export default router;
