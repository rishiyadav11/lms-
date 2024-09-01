import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    bgcolor: string;
    role: 'student' | 'instructor';
    photo?: string; // Optional photo field
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        bgcolor: { type: String, default: '#ffffff' },  // Default background color for user's dashboard
        password: { type: String, required: true },
        role: { type: String, enum: ['student', 'instructor'], required: true },
        photo: { type: String } // Optional field for photo URL or base64 string
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
