import { Context } from 'hono';
import Course from '../models/Course';
import cloudinary from '../config/cloudnaryConfig';
import formidable, { IncomingForm } from 'formidable';
import { IncomingMessage } from 'http';

// Extend the HonoRequest to include `files`
declare module 'hono' {
  interface HonoRequest {
    files?: formidable.Files;
  }
}


// Create a new course
export const createCourse = async (c: Context) => {
    const { title, description, price, content, image } = await c.req.json();
    const user = c.get('user');

    if (user.role !== 'instructor') {
        return c.json({ error: 'Forbidden: Only instructors can create courses' }, 403);
    }

    const course = new Course({
        title,
        description,
        price,
        content, // Array of videos
        image,
        instructor: user.id,
    });

    await course.save();
    return c.json({ message: 'Course created successfully', course }, 201);
};



// Add a video to a course
export const addVideoToCourse = async (c: Context) => {
    const courseId = c.req.param('id');
    const user = c.get('user');

    // Handle file upload using formidable
    const form = new IncomingForm();

    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse(c.req.raw as unknown as IncomingMessage, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

    // Access video file
    const videoFile = files.video;

    if (!videoFile) {
        return c.json({ error: 'No video file uploaded' }, 400);
    }

    const fileToUpload = Array.isArray(videoFile) ? videoFile[0] : videoFile;

    try {
        // Upload video to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(fileToUpload.filepath, { resource_type: 'video' });

        // Create a new video object with the uploaded video details
        const newVideo = {
            url: uploadResponse.secure_url, // Cloudinary URL
            title: fields.title?.toString(),
            description: fields.description?.toString(),
            comments: [],
        };

        const course = await Course.findById(courseId);

        if (!course) {
            return c.json({ error: 'Course not found' }, 404);
        }

        if (course.instructor.toString() !== user.id) {
            return c.json({ error: 'Forbidden: You can only add videos to your own courses' }, 403);
        }

        // Push the new video to the course content
        course.content.push(newVideo as any); // Use `as any` if needed to bypass TS checking here

        // Save the course
        await course.save();

        return c.json({ message: 'Video added successfully', course }, 200);
    } catch (error) {
        console.error('Error uploading video:', error);
        return c.json({ error: 'Error uploading video' }, 500);
    }
};






export const updateVideoInCourse = async (c: Context) => {
    const courseId = c.req.param('courseId');
    const videoId = c.req.param('videoId');
    const { title, description, url } = await c.req.json();
    const user = c.get('user');

    const course = await Course.findById(courseId);

    if (!course) {
        return c.json({ error: 'Course not found' }, 404);
    }

    if (course.instructor.toString() !== user.id) {
        return c.json({ error: 'Forbidden: You can only update videos in your own courses' }, 403);
    }

    const video = course.content.find(video => video._id.toString() === videoId);
    if (!video) {
        return c.json({ error: 'Video not found' }, 404);
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.url = url || video.url;

    await course.save();
    return c.json({ message: 'Video updated successfully', course }, 200);
};



export const deleteVideoFromCourse = async (c: Context) => {
    const courseId = c.req.param('courseId');
    const videoId = c.req.param('videoId');
    const user = c.get('user');

    const course = await Course.findById(courseId);

    if (!course) {
        return c.json({ error: 'Course not found' }, 404);
    }

    if (course.instructor.toString() !== user.id) {
        return c.json({ error: 'Forbidden: You can only delete videos from your own courses' }, 403);
    }

    const videoIndex = course.content.findIndex(video => video._id.toString() === videoId);
    if (videoIndex === -1) {
        return c.json({ error: 'Video not found' }, 404);
    }

    course.content.splice(videoIndex, 1); // Remove the video from the array

    await course.save();
    return c.json({ message: 'Video deleted successfully', course }, 200);
};




export const getCourseById = async (c: Context) => {
    const courseId = c.req.param('id');
    const course = await Course.findById(courseId).populate('content.comments.user');

    if (!course) {
        return c.json({ error: 'Course not found' }, 404);
    }

    return c.json(course);
};

export const addCommentToVideo = async (c: Context) => {
    const courseId = c.req.param('courseId');
    const videoId = c.req.param('videoId');
    const { text } = await c.req.json();
    const user = c.get('user');

    const course = await Course.findById(courseId);

    if (!course) {
        return c.json({ error: 'Course not found' }, 404);
    }

    const video = course.content.find(video => video._id.toString() === videoId);
    if (!video) {
        return c.json({ error: 'Video not found' }, 404);
    }

    video.comments.push({ user: user.id, text });

    await course.save();
    return c.json({ message: 'Comment added successfully', video }, 200);
};



// Get all courses
export const getAllCourses = async (c: Context) => {
    const courses = await Course.find();
    return c.json(courses);
};



// Delete a course
export const deleteCourse = async (c: Context) => {
    const courseId = c.req.param('id');
    const user = c.get('user');

    const course = await Course.findById(courseId);

    if (!course) {
        return c.json({ error: 'Course not found' }, 404);
    }

    if (course.instructor.toString() !== user.id) {
        return c.json({ error: 'Forbidden: You can only delete your own courses' }, 403);
    }

    await Course.deleteOne({ _id: courseId });

    return c.json({ message: 'Course deleted successfully' }, 200);
};