import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'CREATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type ManualPaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';

export interface IPayment extends Document {
  invoiceNumber: string;
  studentId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  amount: number;
  totalCourseFee?: number;
  discount?: number;
  scholarship?: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: ManualPaymentMethod | string;
  transactionId?: string;
  notes?: string;
  receiptUrl?: string;
  paymentDate: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    amount: { type: Number, required: true },
    totalCourseFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    scholarship: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['CREATED', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'SUCCESS',
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER'],
      default: 'CASH',
    },
    transactionId: { type: String, default: '' },
    notes: { type: String, default: '' },
    receiptUrl: { type: String, default: '' },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
