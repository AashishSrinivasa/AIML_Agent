import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent {
  date: string;
  event: string;
  type: 'academic' | 'holiday' | 'exam' | 'event' | 'deadline';
}

export interface IExam {
  subject: string;
  date: string;
  time: string;
  venue: string;
}

export interface ISemester {
  name: string;
  startDate: string;
  endDate: string;
  events: IEvent[];
}

export interface IExaminationSchedule {
  semester: string;
  exams: IExam[];
}

export interface IAcademicCalendar extends Document {
  academicYear: string;
  semesters: ISemester[];
  importantDates: IEvent[];
  examinationSchedule: IExaminationSchedule[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  date: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['academic', 'holiday', 'exam', 'event', 'deadline'],
    required: true
  }
}, { _id: false });

const ExamSchema = new Schema<IExam>({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const SemesterSchema = new Schema<ISemester>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  events: [EventSchema]
}, { _id: false });

const ExaminationScheduleSchema = new Schema<IExaminationSchedule>({
  semester: {
    type: String,
    required: true,
    trim: true
  },
  exams: [ExamSchema]
}, { _id: false });

const AcademicCalendarSchema = new Schema<IAcademicCalendar>({
  academicYear: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  semesters: [SemesterSchema],
  importantDates: [EventSchema],
  examinationSchedule: [ExaminationScheduleSchema]
}, {
  timestamps: true,
  collection: 'academic_calendar'
});

// Indexes for better query performance
AcademicCalendarSchema.index({ academicYear: 1 });
AcademicCalendarSchema.index({ 'semesters.events.date': 1 });
AcademicCalendarSchema.index({ 'importantDates.date': 1 });

export const AcademicCalendar = mongoose.model<IAcademicCalendar>('AcademicCalendar', AcademicCalendarSchema);
