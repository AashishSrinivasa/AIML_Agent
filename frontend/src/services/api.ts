import axios from 'axios';
import { 
  Faculty, 
  Course, 
  AcademicCalendar, 
  Infrastructure, 
  AIResponse,
  FacultyFilters,
  CourseFilters,
  CalendarFilters,
  FacultyStats,
  CourseStats,
  InfrastructureStats,
  ApiResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Faculty API
export const facultyApi = {
  getAll: (filters?: FacultyFilters): Promise<ApiResponse<Faculty[]>> =>
    api.get('/faculty', { params: filters }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Faculty>> =>
    api.get(`/faculty/${id}`).then(res => res.data),
  
  getByDesignation: (designation: string): Promise<ApiResponse<Faculty[]>> =>
    api.get(`/faculty/designation/${designation}`).then(res => res.data),
  
  getBySpecialization: (specialization: string): Promise<ApiResponse<Faculty[]>> =>
    api.get(`/faculty/specialization/${specialization}`).then(res => res.data),
  
  getStats: (): Promise<ApiResponse<FacultyStats>> =>
    api.get('/faculty/stats/overview').then(res => res.data),
};

// Course API
export const courseApi = {
  getAll: (filters?: CourseFilters): Promise<ApiResponse<Course[]>> =>
    api.get('/courses', { params: filters }).then(res => res.data),
  
  getById: (id: string): Promise<ApiResponse<Course>> =>
    api.get(`/courses/${id}`).then(res => res.data),
  
  getBySemester: (semester: string): Promise<ApiResponse<Course[]>> =>
    api.get(`/courses/semester/${semester}`).then(res => res.data),
  
  getByInstructor: (instructor: string): Promise<ApiResponse<Course[]>> =>
    api.get(`/courses/instructor/${instructor}`).then(res => res.data),
  
  getStats: (): Promise<ApiResponse<CourseStats>> =>
    api.get('/courses/stats/overview').then(res => res.data),
  
  getPrerequisites: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/courses/${id}/prerequisites`).then(res => res.data),
};

// Calendar API
export const calendarApi = {
  getCalendar: (year?: string): Promise<ApiResponse<AcademicCalendar>> =>
    api.get('/calendar', { params: { year } }).then(res => res.data),
  
  getEventsByType: (type: string, year?: string): Promise<ApiResponse<Event[]>> =>
    api.get(`/calendar/events/${type}`, { params: { year } }).then(res => res.data),
  
  getUpcomingEvents: (limit?: number, year?: string): Promise<ApiResponse<Event[]>> =>
    api.get('/calendar/upcoming', { params: { limit, year } }).then(res => res.data),
  
  getExams: (semester?: string, year?: string): Promise<ApiResponse<any[]>> =>
    api.get('/calendar/exams', { params: { semester, year } }).then(res => res.data),
  
  getSemesters: (year?: string): Promise<ApiResponse<Semester[]>> =>
    api.get('/calendar/semesters', { params: { year } }).then(res => res.data),
  
  getCurrentSemester: (): Promise<ApiResponse<Semester | null>> =>
    api.get('/calendar/current-semester').then(res => res.data),
};

// Infrastructure API
export const infrastructureApi = {
  getInfrastructure: (department?: string): Promise<ApiResponse<Infrastructure>> =>
    api.get('/infrastructure', { params: { department } }).then(res => res.data),
  
  getLabs: (search?: string, capacity?: number): Promise<ApiResponse<Lab[]>> =>
    api.get('/infrastructure/labs', { params: { search, capacity } }).then(res => res.data),
  
  getLabByName: (labName: string): Promise<ApiResponse<Lab>> =>
    api.get(`/infrastructure/labs/${labName}`).then(res => res.data),
  
  getResearchFacilities: (search?: string): Promise<ApiResponse<ResearchFacility[]>> =>
    api.get('/infrastructure/research', { params: { search } }).then(res => res.data),
  
  getLibrary: (): Promise<ApiResponse<any>> =>
    api.get('/infrastructure/library').then(res => res.data),
  
  getComputerLabs: (): Promise<ApiResponse<any>> =>
    api.get('/infrastructure/computer-labs').then(res => res.data),
  
  getStats: (): Promise<ApiResponse<InfrastructureStats>> =>
    api.get('/infrastructure/stats').then(res => res.data),
};

// AI API
export const aiApi = {
  chat: (message: string, history: ChatMessage[] = []): Promise<ApiResponse<AIResponse>> =>
    api.post('/ai/chat', { message, history }).then(res => res.data),
  
  getSuggestions: (query: string): Promise<ApiResponse<{ suggestions: string[] }>> =>
    api.post('/ai/suggestions', { query }).then(res => res.data),
  
  getHelp: (): Promise<ApiResponse<any>> =>
    api.get('/ai/help').then(res => res.data),
};

// Health check
export const healthApi = {
  check: (): Promise<ApiResponse<any>> =>
    api.get('/health').then(res => res.data),
};

export default api;
