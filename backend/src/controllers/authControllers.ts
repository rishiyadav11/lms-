import { Context } from 'hono';
import cloudinary from '../config/cloudnaryConfig'; // Import the Cloudinary config
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Ensure the environment variable is set
const SECRET_KEY = process.env.JWT_SECRET as string;
const SALT_ROUNDS = 10;

// Register User
export const registerUser = async (c: Context) => {
    const { email, password, photo } = await c.req.json();
    
    if (await User.findOne({ email })) {
        return c.json({ error: 'User already exists' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Upload photo to Cloudinary
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      const bgcolor = getRandomColor()
    let photoUrl = '';
    if (photo) {
        try {
            const result = await cloudinary.v2.uploader.upload(photo);
            photoUrl = result.secure_url;
        } catch (err) {
            console.error('Photo upload failed:', err);
            return c.json({ error: 'Photo upload failed' }, 500);
        }
    }

    const user = new User({
        email,
        password: hashedPassword,
        photo: photoUrl,
        bgcolor: bgcolor,
        role: 'user', // or 'student'/'instructor' based on your logic
    });

    await user.save();

    return c.json({ message: 'User registered successfully' }, 201);
};

// Login User
export const loginUser = async (c: Context) => {
    const { email, password } = await c.req.json();
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    return c.json({ token }, 200);
};

// Logout User
export const logoutUser = (c: Context) => {
    return c.json({ message: 'Logged out successfully' }, 200);
};

// Update User
export const updateUser = async (c: Context) => {
    const { email, newPassword, photo } = await c.req.json();
    const tokenUser = c.get('user'); // Get user from the context

    // Ensure the user exists and the token user matches the request
    if (!tokenUser || tokenUser.id !== email) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return c.json({ error: 'User not found' }, 404);
    }

    if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.password = hashedPassword;
    }

    if (photo) {
        try {
            const result = await cloudinary.v2.uploader.upload(photo);
            user.photo = result.secure_url;
        } catch (err) {
            console.error('Photo upload failed:', err);
            return c.json({ error: 'Photo upload failed' }, 500);
        }
    }

    await user.save();

    return c.json({ message: 'User updated successfully' }, 200);
};
