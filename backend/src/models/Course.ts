import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: string;
  prerequisites: string[];
  description: string;
  instructor: string;
  schedule: string;
  room: string;
  objectives: string[];
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  semester: {
    type: String,
    required: true,
    trim: true
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: true,
    trim: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  schedule: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    required: true,
    trim: true
  },
  objectives: [{
    type: String,
    trim: true
  }],
  topics: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  collection: 'courses'
});

// Indexes for better query performance
CourseSchema.index({ name: 'text', description: 'text', topics: 'text' });
CourseSchema.index({ code: 1 });
CourseSchema.index({ semester: 1 });
CourseSchema.index({ instructor: 1 });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
