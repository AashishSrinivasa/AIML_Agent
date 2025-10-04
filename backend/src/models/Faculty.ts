import mongoose, { Document, Schema } from 'mongoose';

export interface IFaculty extends Document {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string[];
  email: string;
  phone: string;
  office: string;
  officeHours: string;
  researchAreas: string[];
  publications: number;
  experience: string;
  courses: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FacultySchema = new Schema<IFaculty>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  specialization: [{
    type: String,
    trim: true
  }],
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  office: {
    type: String,
    required: true,
    trim: true
  },
  officeHours: {
    type: String,
    required: true,
    trim: true
  },
  researchAreas: [{
    type: String,
    trim: true
  }],
  publications: {
    type: Number,
    required: true,
    min: 0
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  courses: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  collection: 'faculty'
});

// Indexes for better query performance
FacultySchema.index({ name: 'text', specialization: 'text', researchAreas: 'text' });
FacultySchema.index({ designation: 1 });
FacultySchema.index({ specialization: 1 });

export const Faculty = mongoose.model<IFaculty>('Faculty', FacultySchema);
