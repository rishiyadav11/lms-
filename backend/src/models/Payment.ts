import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    amount: number;
    paymentDate: Date;
}

const PaymentSchema: Schema = new Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        amount: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
    }
);

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
