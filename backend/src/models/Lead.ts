import mongoose, { Schema, Document } from 'mongoose';

export type LeadStatus =
  | 'NEW'
  | 'PENDING'
  | 'CONTACTED'
  | 'FOLLOW_UP'
  | 'DEMO_SCHEDULED'
  | 'APPLICATION'
  | 'APPROVED'
  | 'ADMITTED'
  | 'CONVERTED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'LOST';

export type InquiryType = 'ADMISSION' | 'DEMO' | 'SCHOLARSHIP' | 'GENERAL';

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  grade: string;
  targetExam?: string;
  city?: string;
  source: 'FREE_TEST' | 'SCHOLARSHIP_TEST' | 'WEBSITE_FORM' | 'DEMO_BOOKING' | 'CONTACT_PAGE';
  inquiryType: InquiryType;
  status: LeadStatus;
  notes?: string;
  assignedCounsellor?: string;
  followUpDate?: Date;
  isConvertedToStudent?: boolean;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    grade: {
      type: String,
      required: true,
      default: 'Class 10th',
    },
    targetExam: { type: String, default: 'CBSE / Foundation' },
    city: { type: String, default: '' },
    source: {
      type: String,
      enum: ['FREE_TEST', 'SCHOLARSHIP_TEST', 'WEBSITE_FORM', 'DEMO_BOOKING', 'CONTACT_PAGE'],
      default: 'WEBSITE_FORM',
    },
    inquiryType: {
      type: String,
      enum: ['ADMISSION', 'DEMO', 'SCHOLARSHIP', 'GENERAL'],
      default: 'ADMISSION',
    },
    status: {
      type: String,
      enum: [
        'NEW',
        'PENDING',
        'CONTACTED',
        'FOLLOW_UP',
        'DEMO_SCHEDULED',
        'APPLICATION',
        'APPROVED',
        'ADMITTED',
        'CONVERTED',
        'CONFIRMED',
        'COMPLETED',
        'CANCELLED',
        'REJECTED',
        'LOST',
      ],
      default: 'NEW',
    },
    notes: { type: String, default: '' },
    assignedCounsellor: { type: String, default: 'Senior Academic Counselor' },
    followUpDate: { type: Date },
    isConvertedToStudent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
