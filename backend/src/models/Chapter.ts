import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
  name: string;
  chapterNumber: number;
  subjectId: mongoose.Types.ObjectId;
  description?: string;
  topics: string[];
}

const ChapterSchema = new Schema<IChapter>(
  {
    name: { type: String, required: true, trim: true },
    chapterNumber: { type: Number, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    description: { type: String, default: '' },
    topics: [{ type: String }],
  },
  { timestamps: true }
);

export const Chapter = mongoose.model<IChapter>('Chapter', ChapterSchema);
