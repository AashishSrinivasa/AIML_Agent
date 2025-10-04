import OpenAI from 'openai';
import { Faculty } from '../models/Faculty';
import { Course } from '../models/Course';
import { AcademicCalendar } from '../models/AcademicCalendar';
import { Infrastructure } from '../models/Infrastructure';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  response: string;
  sources?: string[];
  suggestions?: string[];
}

class AIService {
  private systemPrompt = `You are an AI assistant for the AIML (Artificial Intelligence and Machine Learning) department at BMSCE University. 
You have access to comprehensive information about:

1. Faculty members - their qualifications, specializations, research areas, office hours, and contact information
2. Course catalog - detailed information about all courses, prerequisites, schedules, and instructors
3. Academic calendar - semester schedules, important dates, examination schedules, and events
4. Infrastructure - labs, equipment, research facilities, library resources, and computer labs

Your role is to help students, faculty, and visitors by:
- Answering questions about faculty, courses, and academic schedules
- Providing information about department infrastructure and facilities
- Helping with academic planning and course selection
- Offering guidance on research areas and specializations
- Assisting with general department information

Always be helpful, accurate, and professional. If you don't have specific information, say so clearly and suggest how the user might find the information they need.

When providing information, be specific and include relevant details like names, dates, locations, and contact information when available.`;

  async generateResponse(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      // Get relevant context based on the user's query
      const context = await this.getRelevantContext(messages[messages.length - 1].content);
      
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `${this.systemPrompt}\n\nRelevant Context:\n${context}`
      };

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const aiResponse = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      return {
        response: aiResponse,
        sources: this.extractSources(context),
        suggestions: this.generateSuggestions(messages[messages.length - 1].content)
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private async getRelevantContext(query: string): Promise<string> {
    const context: string[] = [];
    const lowerQuery = query.toLowerCase();

    try {
      // Faculty context
      if (this.isFacultyQuery(lowerQuery)) {
        const faculty = await Faculty.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { specialization: { $regex: query, $options: 'i' } },
            { researchAreas: { $regex: query, $options: 'i' } },
            { designation: { $regex: query, $options: 'i' } }
          ]
        }).limit(5);

        if (faculty.length > 0) {
          context.push('Faculty Information:');
          faculty.forEach(f => {
            context.push(`- ${f.name} (${f.designation}): ${f.specialization.join(', ')}. Research: ${f.researchAreas.join(', ')}. Office: ${f.office}, Hours: ${f.officeHours}. Email: ${f.email}`);
          });
        }
      }

      // Course context
      if (this.isCourseQuery(lowerQuery)) {
        const courses = await Course.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { topics: { $regex: query, $options: 'i' } }
          ]
        }).limit(5);

        if (courses.length > 0) {
          context.push('Course Information:');
          courses.forEach(c => {
            context.push(`- ${c.code} - ${c.name} (${c.credits} credits, ${c.semester} semester): ${c.description}. Instructor: ${c.instructor}. Schedule: ${c.schedule}, Room: ${c.room}`);
          });
        }
      }

      // Calendar context
      if (this.isCalendarQuery(lowerQuery)) {
        const calendar = await AcademicCalendar.findOne().sort({ academicYear: -1 });
        if (calendar) {
          context.push('Academic Calendar Information:');
          context.push(`Academic Year: ${calendar.academicYear}`);
          
          const upcomingEvents = calendar.semesters.flatMap(s => s.events)
            .concat(calendar.importantDates)
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5);

          if (upcomingEvents.length > 0) {
            context.push('Upcoming Events:');
            upcomingEvents.forEach(e => {
              context.push(`- ${e.date}: ${e.event} (${e.type})`);
            });
          }
        }
      }

      // Infrastructure context
      if (this.isInfrastructureQuery(lowerQuery)) {
        const infrastructure = await Infrastructure.findOne();
        if (infrastructure) {
          context.push('Infrastructure Information:');
          context.push(`Labs: ${infrastructure.labs.length} labs available`);
          context.push(`Classrooms: ${infrastructure.classrooms.total} classrooms with capacity ${infrastructure.classrooms.capacity}`);
          context.push(`Computer Labs: ${infrastructure.computerLabs.total} labs with ${infrastructure.computerLabs.computers} computers`);
          context.push(`Library: ${infrastructure.library.books} books, ${infrastructure.library.journals} journals, ${infrastructure.library.digitalResources} digital resources`);
        }
      }

    } catch (error) {
      console.error('Error getting context:', error);
    }

    return context.join('\n');
  }

  private isFacultyQuery(query: string): boolean {
    const facultyKeywords = ['faculty', 'professor', 'teacher', 'instructor', 'staff', 'research', 'specialization', 'office hours', 'contact'];
    return facultyKeywords.some(keyword => query.includes(keyword));
  }

  private isCourseQuery(query: string): boolean {
    const courseKeywords = ['course', 'subject', 'class', 'syllabus', 'prerequisite', 'credit', 'semester', 'schedule', 'instructor'];
    return courseKeywords.some(keyword => query.includes(keyword));
  }

  private isCalendarQuery(query: string): boolean {
    const calendarKeywords = ['calendar', 'schedule', 'exam', 'holiday', 'event', 'date', 'semester', 'academic year', 'deadline'];
    return calendarKeywords.some(keyword => query.includes(keyword));
  }

  private isInfrastructureQuery(query: string): boolean {
    const infrastructureKeywords = ['lab', 'laboratory', 'infrastructure', 'facility', 'equipment', 'library', 'computer', 'room', 'building'];
    return infrastructureKeywords.some(keyword => query.includes(keyword));
  }

  private extractSources(context: string): string[] {
    const sources: string[] = [];
    if (context.includes('Faculty Information:')) sources.push('Faculty Database');
    if (context.includes('Course Information:')) sources.push('Course Catalog');
    if (context.includes('Academic Calendar Information:')) sources.push('Academic Calendar');
    if (context.includes('Infrastructure Information:')) sources.push('Infrastructure Database');
    return sources;
  }

  private generateSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('faculty') || lowerQuery.includes('professor')) {
      suggestions.push('View all faculty members', 'Find faculty by specialization', 'Get faculty contact information');
    } else if (lowerQuery.includes('course') || lowerQuery.includes('subject')) {
      suggestions.push('Browse course catalog', 'Find courses by semester', 'Check course prerequisites');
    } else if (lowerQuery.includes('calendar') || lowerQuery.includes('schedule')) {
      suggestions.push('View academic calendar', 'Check upcoming events', 'See examination schedule');
    } else if (lowerQuery.includes('lab') || lowerQuery.includes('infrastructure')) {
      suggestions.push('Explore department labs', 'Check equipment availability', 'View research facilities');
    } else {
      suggestions.push('Ask about faculty', 'Browse courses', 'Check academic calendar', 'Explore infrastructure');
    }

    return suggestions;
  }
}

export const aiService = new AIService();
