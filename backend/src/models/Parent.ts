import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  userId: mongoose.Types.ObjectId;
  children: mongoose.Types.ObjectId[];
  occupation?: string;
  alternatePhone?: string;
}

const ParentSchema = new Schema<IParent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    occupation: { type: String, default: '' },
    alternatePhone: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Parent = mongoose.model<IParent>('Parent', ParentSchema);
