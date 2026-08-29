import mongoose, { Schema, Document } from 'mongoose';

export interface INeedsAttention extends Document {
  studentId: mongoose.Types.ObjectId;
  classGrade: string;
  reason: string;
  addedBy: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}

const NeedsAttentionSchema = new Schema<INeedsAttention>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    classGrade: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const NeedsAttention = mongoose.model<INeedsAttention>('NeedsAttention', NeedsAttentionSchema);
