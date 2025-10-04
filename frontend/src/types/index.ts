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
  title: string;
  code: string;
  credits: number;
  semester: number;
  type: string;
  description: string;
  prerequisites: string[];
  objectives: string[];
  outcomes: string[];
  syllabus: string[];
  textbooks: string[];
  references: string[];
  instructor?: string;
}

export interface CourseFilters {
  search?: string;
  semester?: number;
  type?: string;
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

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
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