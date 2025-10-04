import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

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

// Faculty API
export const facultyApi = {
  getAll: async (filters: FacultyFilters = {}): Promise<ApiResponse<Faculty[]>> => {
    const response = await api.get('/faculty', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Faculty>> => {
    const response = await api.get(`/faculty/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/faculty/stats/overview');
    return response.data;
  },
};

// Courses API
export const coursesApi = {
  getAll: async (filters: any = {}): Promise<ApiResponse<Course[]>> => {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Course>> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getBySemester: async (semester: number): Promise<ApiResponse<Course[]>> => {
    const response = await api.get(`/courses/semester/${semester}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/courses/stats/overview');
    return response.data;
  },
};

// Calendar API
export const calendarApi = {
  getEvents: async (year?: string): Promise<ApiResponse<AcademicCalendar[]>> => {
    const response = await api.get('/calendar', { params: { year } });
    return response.data;
  },

  getUpcoming: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get('/calendar/upcoming');
    return response.data;
  },
};

// Infrastructure API
export const infrastructureApi = {
  getInfrastructure: async (): Promise<ApiResponse<Infrastructure[]>> => {
    const response = await api.get('/infrastructure');
    return response.data;
  },

  getLabs: async (): Promise<ApiResponse<Lab[]>> => {
    const response = await api.get('/infrastructure/labs');
    return response.data;
  },

  getResearchFacilities: async (): Promise<ApiResponse<ResearchFacility[]>> => {
    const response = await api.get('/infrastructure/research');
    return response.data;
  },
};

// AI API
export const aiApi = {
  chat: async (message: string, history: ChatMessage[] = []): Promise<ApiResponse<AIResponse>> => {
    const response = await api.post('/ai/chat', {
      message,
      history: history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });
    return response.data;
  },

  getSuggestions: async (query: string): Promise<ApiResponse<string[]>> => {
    const response = await api.post('/ai/suggestions', { query });
    return response.data;
  },

  getHelp: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/ai/help');
    return response.data;
  },
};

export default api;