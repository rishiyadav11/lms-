import mongoose, { Schema, Document, Types } from 'mongoose';


interface IComment {
    user: mongoose.Types.ObjectId;
    text: string;
}

export interface IVideo {
    _id: mongoose.Types.ObjectId;
    url: string;
    title: string;
    description: string;
    comments: IComment[];
}


export interface ICourse extends Document {
    title: string;
    description: string;
    instructor: mongoose.Types.ObjectId;
    price: number;
    content: IVideo[];
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}


const CommentSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

const VideoSchema: Schema = new Schema(
    {
        url: { type: String, required: true }, // Cloudinary URL
        title: { type: String, required: true },
        description: { type: String, required: true },
        comments: [CommentSchema], // Array of comments
    },
    { timestamps: true }
);

const CourseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        price: { type: Number, required: true },
        content: [VideoSchema], // Array of videos
        image: { type: String, required: true }, // Cloudinary image URL
    },
    { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
