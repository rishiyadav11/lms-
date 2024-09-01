import { Hono } from 'hono';
import { registerUser, loginUser, logoutUser, updateUser } from '../controllers/authControllers';

const authRoutes = new Hono();

// Register Route
authRoutes.post('/register', registerUser);

// Login Route
authRoutes.post('/login', loginUser);

// Logout Route
authRoutes.post('/logout', logoutUser);

// Update User Route
authRoutes.patch('/update', updateUser);

export default authRoutes;
