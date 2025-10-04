// Faculty types
export interface Faculty {
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
  createdAt: string;
  updatedAt: string;
}

// Course types
export interface Course {
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
  createdAt: string;
  updatedAt: string;
}

// Calendar types
export interface Event {
  date: string;
  event: string;
  type: 'academic' | 'holiday' | 'exam' | 'event' | 'deadline';
}

export interface Exam {
  subject: string;
  date: string;
  time: string;
  venue: string;
}

export interface Semester {
  name: string;
  startDate: string;
  endDate: string;
  events: Event[];
}

export interface ExaminationSchedule {
  semester: string;
  exams: Exam[];
}

export interface AcademicCalendar {
  academicYear: string;
  semesters: Semester[];
  importantDates: Event[];
  examinationSchedule: ExaminationSchedule[];
  createdAt: string;
  updatedAt: string;
}

// Infrastructure types
export interface Equipment {
  name: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface Lab {
  name: string;
  capacity: number;
  location: string;
  equipment: Equipment[];
  facilities: string[];
  availability: string;
}

export interface ResearchFacility {
  name: string;
  description: string;
  equipment: string[];
  capacity: number;
}

export interface Infrastructure {
  department: string;
  labs: Lab[];
  classrooms: {
    total: number;
    capacity: number;
    facilities: string[];
  };
  library: {
    books: number;
    journals: number;
    digitalResources: number;
    seatingCapacity: number;
    facilities: string[];
  };
  computerLabs: {
    total: number;
    computers: number;
    specifications: string;
    software: string[];
  };
  researchFacilities: ResearchFacility[];
  createdAt: string;
  updatedAt: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface AIResponse {
  response: string;
  sources?: string[];
  suggestions?: string[];
  timestamp: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Search and filter types
export interface FacultyFilters {
  search?: string;
  designation?: string;
  specialization?: string;
}

export interface CourseFilters {
  search?: string;
  semester?: string;
  instructor?: string;
  credits?: number;
}

export interface CalendarFilters {
  year?: string;
  type?: string;
  limit?: number;
}

// Statistics types
export interface FacultyStats {
  totalFaculty: number;
  designations: Array<{ _id: string; count: number }>;
  specializations: Array<{ _id: string; count: number }>;
  totalPublications: number;
}

export interface CourseStats {
  totalCourses: number;
  semesters: Array<{ _id: string; count: number }>;
  instructors: Array<{ _id: string; count: number }>;
  credits: Array<{ _id: number; count: number }>;
}

export interface InfrastructureStats {
  totalLabs: number;
  totalClassrooms: number;
  totalComputerLabs: number;
  totalComputers: number;
  totalBooks: number;
  totalJournals: number;
  totalEquipment: number;
  equipmentByCondition: Record<string, number>;
  researchFacilities: number;
}
