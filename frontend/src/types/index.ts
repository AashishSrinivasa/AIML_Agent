// Faculty Types
export interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string[];
  researchAreas: string[];
  publications: number;
  experience: string;
  email: string;
  phone: string;
  office: string;
  officeHours: string;
}

export interface FacultyFilters {
  search?: string;
  designation?: string;
  specialization?: string;
  researchArea?: string;
}

export interface FacultyStats {
  totalFaculty: number;
  totalPublications: number;
  specializations: Array<{ _id: string; count: number }>;
  designations: Array<{ _id: string; count: number }>;
}

// Course Types
export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: string;
  prerequisites: string[];
  description: string;
  instructor?: string;
  schedule?: string;
  room?: string;
  objectives: string[];
  topics: string[];
  courseType: string;
  contactHours: string;
  totalLectureHours: number;
  examination: {
    cieMarks: number;
    seeMarks: number;
  };
  units: Array<{
    number: number;
    title: string;
    hours: number;
    topics: string[];
  }>;
  textBooks: string[];
  referenceBooks: string[];
  courseOutcomes: string[];
}

export interface CourseFilters {
  search?: string;
  semester?: string;
  courseType?: string;
  instructor?: string;
  credits?: number;
}

export interface CourseStats {
  totalCourses: number;
  semesters: Array<{ _id: string; count: number }>;
  instructors: Array<{ _id: string; count: number }>;
  credits: Array<{ _id: string; count: number }>;
}

// Academic Calendar Types
export interface AcademicCalendar {
  id: string;
  year: string;
  semester: string;
  events: Event[];
}

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  location?: string;
  time?: string;
}

export interface CalendarFilters {
  year?: string;
  type?: string;
}

// Infrastructure Types
export interface Infrastructure {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  equipment: string[];
  location: string;
  availability: string;
  contact: string;
}

export interface Lab {
  id: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  equipment: string[];
  location: string;
  availability: string;
  contact: string;
}

export interface ResearchFacility {
  id: string;
  name: string;
  type: string;
  description: string;
  equipment: string[];
  location: string;
  availability: string;
  contact: string;
}

export interface InfrastructureStats {
  totalLabs: number;
  totalComputers: number;
  totalBooks: number;
  researchFacilities: number;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
  suggestions?: string[];
}

export interface AIResponse {
  response: string;
  sources: string[];
  suggestions?: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Statistics Types
export interface DepartmentStats {
  totalFaculty: number;
  totalCourses: number;
  totalLabs: number;
  totalEvents: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}