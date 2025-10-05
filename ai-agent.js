const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ComprehensiveAIAgent {
  constructor() {
    this.app = express();
    this.port = 5001;
    this.knowledgeBase = {};
    this.llamaModel = 'llama3:latest';
    this.llamaUrl = 'http://localhost:11434/api/generate';
    
    this.setupMiddleware();
    this.loadComprehensiveData();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  // Load ALL comprehensive data
  loadComprehensiveData() {
    try {
      console.log('🧠 Loading Comprehensive Knowledge Base...');
      
      // Load faculty data
      const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_faculty.json'), 'utf8'));
      this.knowledgeBase.faculty = facultyData;
      
      // Load courses data
      const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_courses.json'), 'utf8'));
      this.knowledgeBase.courses = coursesData;
      
      // Load infrastructure data
      const infrastructureData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_infrastructure.json'), 'utf8'));
      this.knowledgeBase.infrastructure = infrastructureData;
      
      // Load calendar data
      const calendarData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_academic_calendar.json'), 'utf8'));
      // Extract all events from all semesters
      const allEvents = [];
      if (calendarData.semesters) {
        calendarData.semesters.forEach(semester => {
          if (semester.events) {
            allEvents.push(...semester.events);
          }
        });
      }
      this.knowledgeBase.calendar = allEvents;
      
      console.log('🧠 Comprehensive Knowledge Base Built:');
      console.log(`   📊 Faculty: ${facultyData.length} members`);
      console.log(`   📚 Courses: ${coursesData.length} courses`);
      console.log(`   🏢 Infrastructure: ${infrastructureData.labs ? infrastructureData.labs.length : 0} labs`);
      console.log(`   📅 Calendar: ${allEvents.length} events`);
      
    } catch (error) {
      console.error('❌ Error loading knowledge base:', error);
    }
  }

  // Create comprehensive context for Llama
  createComprehensiveContext() {
    const context = {
      department: "B.M.S. College of Engineering - Machine Learning (AI and ML) Department",
      faculty: this.knowledgeBase.faculty.map(f => ({
        name: f.name,
        designation: f.designation,
        email: f.email,
        phone: f.phone,
        specialization: f.specialization,
        researchAreas: f.researchAreas,
        teaches: f.teaches || [],
        office: f.office,
        qualifications: f.qualifications
      })),
      courses: this.knowledgeBase.courses.map(c => ({
        code: c.code,
        name: c.name,
        semester: c.semester,
        credits: c.credits,
        instructor: c.instructor,
        prerequisites: c.prerequisites,
        courseOutcomes: c.courseOutcomes,
        description: c.description,
        objectives: c.objectives
      })),
      infrastructure: {
        department: this.knowledgeBase.infrastructure.department,
        established: this.knowledgeBase.infrastructure.established,
        undergraduateIntake: this.knowledgeBase.infrastructure.undergraduateIntake,
        labs: this.knowledgeBase.infrastructure.labs.map(lab => ({
          name: lab.name,
          capacity: lab.capacity,
          equipment: lab.equipment,
          description: lab.description,
          location: lab.location
        })),
        researchFacilities: this.knowledgeBase.infrastructure.researchFacilities || []
      },
      calendar: this.knowledgeBase.calendar
    };
    
    return context;
  }

  // Generate intelligent response using Llama 3.0
  async generateIntelligentResponse(userMessage, history = []) {
    try {
      const context = this.createComprehensiveContext();
      
      // Always provide ALL comprehensive data for complete context
      const focusedData = `COMPLETE DEPARTMENTAL DATA:

FACULTY DATA (${context.faculty.length} members):
${context.faculty.map(f => `
- ${f.name} (${f.designation})
  Email: ${f.email}
  Phone: ${f.phone}
  Specialization: ${Array.isArray(f.specialization) ? f.specialization.join(', ') : f.specialization}
  Research Areas: ${Array.isArray(f.researchAreas) ? f.researchAreas.join(', ') : f.researchAreas}
  Teaches: ${Array.isArray(f.teaches) ? f.teaches.join(', ') : 'Not specified'}
  Office: ${f.office}
  Qualifications: ${f.qualifications}
`).join('')}

COURSES DATA (${context.courses.length} courses):
${context.courses.map(c => `
- ${c.name} (${c.code})
  Semester: ${c.semester}
  Credits: ${c.credits}
  Instructor: ${c.instructor}
  Prerequisites: ${Array.isArray(c.prerequisites) ? c.prerequisites.join(', ') : c.prerequisites}
  Description: ${c.description}
  Course Outcomes: ${Array.isArray(c.courseOutcomes) ? c.courseOutcomes.join('; ') : c.courseOutcomes}
  Objectives: ${Array.isArray(c.objectives) ? c.objectives.join('; ') : c.objectives}
  Topics: ${Array.isArray(c.topics) ? c.topics.join(', ') : 'Not specified'}
  Course Type: ${c.courseType}
  Contact Hours: ${c.contactHours}
  Examination: CIE ${c.examination.cieMarks} marks, SEE ${c.examination.seeMarks} marks
`).join('')}

INFRASTRUCTURE DATA:
${context.infrastructure.labs.map(lab => `
- ${lab.name}
  Capacity: ${lab.capacity} students
  Location: ${lab.location}
  Description: ${lab.description}
  Equipment: ${lab.equipment.map(eq => `${eq.name} (${eq.quantity} units)`).join(', ')}
`).join('')}

CALENDAR DATA (${context.calendar.length} events):
${context.calendar.slice(0, 10).map(event => `
- ${event.title} (${event.date})
  Type: ${event.type}
  Description: ${event.description}
`).join('')}`;
      
      const prompt = `You are Liam, the official AI assistant for the Department of Artificial Intelligence and Machine Learning, B.M.S. College of Engineering.

You are connected to structured departmental data containing faculty information, syllabus details, course lists, infrastructure, and academic programs. Use ONLY the provided and verified information from this internal data when answering.

DEPARTMENT CONTEXT:
- Department: ${context.department}
- Established: ${context.infrastructure.established}
- Undergraduate Intake: ${context.infrastructure.undergraduateIntake} students

${focusedData}

USER QUESTION: ${userMessage}

CORE INSTRUCTIONS:
1. Always rely on the college dataset above for facts — never invent information
2. When the user asks a question, search internally within the given data and return only matching, verified content
3. Keep the conversation continuous — remember previous user messages and maintain context throughout the session
4. Each reply must be short, precise, and directly answer the question (2–5 sentences maximum)
5. Avoid greetings, intros, or repetitive text. Do not restate previous questions
6. If a faculty, course, or email is mentioned, respond only with that exact person's verified details
7. If multiple matching items exist, list them clearly using bullet points
8. If information is missing in your dataset, say: "That information isn't available in the current records"
9. Never respond with data from outside the department or public internet
10. Use clear and natural English. Sound like ChatGPT — confident, simple, and professional
11. Never output markdown formatting unless explicitly asked
12. Maintain context memory: when the user refers to "her" or "him" in the next question, understand who they meant from the last message

BEHAVIOR AND STYLE RULES:
- Always be factual and minimal
- Never guess or mix up details between faculty
- Avoid filler lines like "I'm happy to help" or "It's great to chat with you"
- For every name, email, or course, double-check you respond from the internal dataset only
- Keep consistency in data (emails, names, designations, course titles, etc.)
- Respond like ChatGPT — short, clear, and accurate

RESPONSE:`;

      console.log('Calling Llama with prompt length:', prompt.length);
      
      const response = await axios.post(this.llamaUrl, {
        model: this.llamaModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 300
        }
      }, {
        timeout: 30000
      });

      console.log('Llama response received');
      return response.data.response;

    } catch (error) {
      console.log('Llama error:', error.message);
      console.log('Using fallback response');
      return this.generateFallbackResponse(userMessage);
    }
  }

  // Enhanced fallback response with comprehensive data
  generateFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Specific faculty queries
    if (lowerMessage.includes('sandeep') && lowerMessage.includes('varma')) {
      const faculty = this.knowledgeBase.faculty.find(f => f.name.toLowerCase().includes('sandeep'));
      if (faculty) {
        return `Dr. Sandeep Varma N (${faculty.designation}) - Email: ${faculty.email}`;
      }
    }
    
    if (lowerMessage.includes('pallavi')) {
      const faculty = this.knowledgeBase.faculty.find(f => f.name.toLowerCase().includes('pallavi'));
      if (faculty) {
        return `Dr. Pallavi B (${faculty.designation}) - Email: ${faculty.email}`;
      }
    }
    
    if (lowerMessage.includes('hod') || lowerMessage.includes('head')) {
      const hod = this.knowledgeBase.faculty.find(f => f.designation.toLowerCase().includes('hod'));
      if (hod) {
        return `Dr. M Dakshayini is the Professor and Head of the Department of Artificial Intelligence and Machine Learning.`;
      }
    }
    
    // Semester-specific course queries
    if (lowerMessage.includes('5th') || lowerMessage.includes('fifth') || lowerMessage.includes('semester 5')) {
      const semester5Courses = this.knowledgeBase.courses.filter(c => c.semester.toLowerCase().includes('5th'));
      if (semester5Courses.length > 0) {
        const courseList = semester5Courses.map(c => `• ${c.name} (${c.code})`).join('\n');
        return `Semester V courses:\n${courseList}`;
      }
    }
    
    // Faculty queries
    if (lowerMessage.includes('faculty') || lowerMessage.includes('professor') || lowerMessage.includes('teacher') || lowerMessage.includes('instructor')) {
      const faculty = this.knowledgeBase.faculty;
      const facultyList = faculty.map(f => 
        `• ${f.name} (${f.designation}) - ${f.email}`
      ).join('\n');
      
      return `Faculty members:\n${facultyList}`;
    }
    
    // Course queries
    if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('syllabus')) {
      const courses = this.knowledgeBase.courses;
      const courseList = courses.map(c => 
        `• ${c.name} (${c.code}) - ${c.semester} semester, ${c.credits} credits`
      ).join('\n');
      
      return `Courses:\n${courseList}`;
    }
    
    // Infrastructure queries
    if (lowerMessage.includes('lab') || lowerMessage.includes('equipment') || lowerMessage.includes('infrastructure')) {
      const labs = this.knowledgeBase.infrastructure.labs;
      const labList = labs.map(lab => 
        `• ${lab.name} (${lab.capacity} students) - ${lab.equipment.map(eq => `${eq.name} (${eq.quantity})`).join(', ')}`
      ).join('\n');
      
      return `Labs:\n${labList}`;
    }
    
    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `I can help with faculty, courses, labs, and academic information. What do you need?`;
    }
    
    return `I can help with faculty, courses, infrastructure, and academic calendar information. What specific information do you need?`;
  }

  // Generate suggestions based on context
  generateSuggestions(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('faculty') || lowerMessage.includes('professor')) {
      return [
        "Show me all faculty members",
        "Who teaches machine learning?",
        "Faculty contact information"
      ];
    }
    
    if (lowerMessage.includes('course') || lowerMessage.includes('subject')) {
      return [
        "Show me all courses",
        "Semester 5 courses",
        "Course prerequisites"
      ];
    }
    
    if (lowerMessage.includes('lab') || lowerMessage.includes('equipment')) {
      return [
        "Show me all labs",
        "ML Lab 1 equipment",
        "Lab capacity details"
      ];
    }
    
    return [
      "Faculty information",
      "Course details", 
      "Lab facilities"
    ];
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Faculty API
    this.app.get('/api/faculty', (req, res) => {
      res.json({ data: this.knowledgeBase.faculty });
    });

    this.app.get('/api/faculty/stats/overview', (req, res) => {
      const stats = {
        total: this.knowledgeBase.faculty.length,
        professors: this.knowledgeBase.faculty.filter(f => f.designation.includes('Professor')).length,
        associateProfessors: this.knowledgeBase.faculty.filter(f => f.designation.includes('Associate Professor')).length,
        assistantProfessors: this.knowledgeBase.faculty.filter(f => f.designation.includes('Assistant Professor')).length
      };
      res.json({ data: stats });
    });

    // Courses API
    this.app.get('/api/courses', (req, res) => {
      res.json({ data: this.knowledgeBase.courses });
    });

    this.app.get('/api/courses/stats/overview', (req, res) => {
      const stats = {
        total: this.knowledgeBase.courses.length,
        semesters: [...new Set(this.knowledgeBase.courses.map(c => c.semester))].length,
        totalCredits: this.knowledgeBase.courses.reduce((sum, c) => sum + (c.credits || 0), 0)
      };
      res.json({ data: stats });
    });

    // Infrastructure API
    this.app.get('/api/infrastructure', (req, res) => {
      res.json({ data: [this.knowledgeBase.infrastructure] });
    });

    // Calendar API
    this.app.get('/api/calendar', (req, res) => {
      res.json({ data: this.knowledgeBase.calendar });
    });

    // AI Chat API
    this.app.post('/api/ai/chat', async (req, res) => {
      try {
        const { message, history = [] } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        const response = await this.generateIntelligentResponse(message, history);
        const suggestions = this.generateSuggestions(message);

        res.json({
          data: {
            response: response,
            sources: ['Comprehensive Knowledge Base'],
            suggestions: suggestions,
            confidence: 0.9,
            intent: 'intelligent_response',
            entities: {
              faculty: [],
              courses: [],
              specializations: [],
              researchAreas: [],
              semesters: [],
              equipment: [],
              locations: []
            }
          }
        });

      } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
      }
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Advanced AI Agent running on port ${this.port}`);
      console.log(`📊 Serving ${this.knowledgeBase.faculty.length} faculty members`);
      console.log(`📚 Serving ${this.knowledgeBase.courses.length} courses`);
      console.log(`🏢 Serving infrastructure data`);
      console.log(`📅 Serving calendar data`);
      console.log(`🤖 AI Agent trained and ready for intelligent conversations!`);
    });
  }
}

// Start the AI Agent
const agent = new ComprehensiveAIAgent();
agent.start();