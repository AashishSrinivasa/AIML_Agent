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
      
      // Create a focused prompt based on the user's question
      let focusedData = '';
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('faculty') || lowerMessage.includes('professor') || lowerMessage.includes('teacher')) {
        focusedData = `FACULTY DATA (${context.faculty.length} members):
${context.faculty.map(f => `
- ${f.name} (${f.designation})
  Email: ${f.email}
  Phone: ${f.phone}
  Specialization: ${Array.isArray(f.specialization) ? f.specialization.join(', ') : f.specialization}
  Research Areas: ${Array.isArray(f.researchAreas) ? f.researchAreas.join(', ') : f.researchAreas}
  Teaches: ${Array.isArray(f.teaches) ? f.teaches.join(', ') : 'Not specified'}
  Office: ${f.office}
  Qualifications: ${f.qualifications}
`).join('')}`;
      } else if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('syllabus')) {
        focusedData = `COURSES DATA (${context.courses.length} courses):
${context.courses.map(c => `
- ${c.name} (${c.code})
  Semester: ${c.semester}
  Credits: ${c.credits}
  Instructor: ${c.instructor}
  Prerequisites: ${Array.isArray(c.prerequisites) ? c.prerequisites.join(', ') : c.prerequisites}
  Description: ${c.description}
  Course Outcomes: ${Array.isArray(c.courseOutcomes) ? c.courseOutcomes.join('; ') : c.courseOutcomes}
  Objectives: ${Array.isArray(c.objectives) ? c.objectives.join('; ') : c.objectives}
`).join('')}`;
      } else if (lowerMessage.includes('lab') || lowerMessage.includes('equipment') || lowerMessage.includes('infrastructure')) {
        focusedData = `INFRASTRUCTURE DATA:
${context.infrastructure.labs.map(lab => `
- ${lab.name}
  Capacity: ${lab.capacity} students
  Location: ${lab.location}
  Description: ${lab.description}
  Equipment: ${lab.equipment.map(eq => `${eq.name} (${eq.quantity} units)`).join(', ')}
`).join('')}`;
      } else {
        // For general questions, provide all data
        focusedData = `FACULTY DATA (${context.faculty.length} members):
${context.faculty.slice(0, 5).map(f => `
- ${f.name} (${f.designation})
  Email: ${f.email}
  Specialization: ${Array.isArray(f.specialization) ? f.specialization.join(', ') : f.specialization}
`).join('')}

COURSES DATA (${context.courses.length} courses):
${context.courses.slice(0, 5).map(c => `
- ${c.name} (${c.code})
  Semester: ${c.semester}
  Credits: ${c.credits}
  Instructor: ${c.instructor}
`).join('')}

INFRASTRUCTURE DATA:
${context.infrastructure.labs.map(lab => `
- ${lab.name}
  Capacity: ${lab.capacity} students
  Equipment: ${lab.equipment.map(eq => `${eq.name} (${eq.quantity} units)`).join(', ')}
`).join('')}`;
      }
      
      const prompt = `You are Liam, an intelligent AI assistant for the B.M.S. College of Engineering Machine Learning (AI and ML) Department.

DEPARTMENT CONTEXT:
- Department: ${context.department}
- Established: ${context.infrastructure.established}
- Undergraduate Intake: ${context.infrastructure.undergraduateIntake} students

${focusedData}

USER QUESTION: ${userMessage}

INSTRUCTIONS:
1. Answer based on the data provided above
2. Be conversational and helpful like ChatGPT
3. Provide specific, accurate information from the data
4. If asked about faculty, provide their contact details, what they teach, and specialization
5. If asked about courses, provide detailed information including outcomes, credits, prerequisites
6. If asked about infrastructure, provide specific equipment and capacity details
7. Be concise but informative
8. Use bullet points for lists
9. Always be friendly and professional
10. If you don't have specific information, say so clearly

RESPONSE:`;

      console.log('Calling Llama with prompt length:', prompt.length);
      
      const response = await axios.post(this.llamaUrl, {
        model: this.llamaModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 400
        }
      }, {
        timeout: 20000
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
    
    // Faculty queries
    if (lowerMessage.includes('faculty') || lowerMessage.includes('professor') || lowerMessage.includes('teacher') || lowerMessage.includes('instructor')) {
      const faculty = this.knowledgeBase.faculty.slice(0, 5);
      const facultyList = faculty.map(f => 
        `• ${f.name} (${f.designation})\n  Email: ${f.email}\n  Specialization: ${Array.isArray(f.specialization) ? f.specialization.join(', ') : f.specialization}`
      ).join('\n\n');
      
      return `Here are our faculty members:\n\n${facultyList}\n\nNeed more details about any specific faculty member?`;
    }
    
    // Course queries
    if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('syllabus')) {
      const courses = this.knowledgeBase.courses.slice(0, 5);
      const courseList = courses.map(c => 
        `• ${c.name} (${c.code})\n  Semester: ${c.semester}\n  Credits: ${c.credits}\n  Instructor: ${c.instructor}`
      ).join('\n\n');
      
      return `Here are our courses:\n\n${courseList}\n\nWant details about any specific course?`;
    }
    
    // Infrastructure queries
    if (lowerMessage.includes('lab') || lowerMessage.includes('equipment') || lowerMessage.includes('infrastructure')) {
      const labs = this.knowledgeBase.infrastructure.labs.slice(0, 3);
      const labList = labs.map(lab => 
        `• ${lab.name}\n  Capacity: ${lab.capacity} students\n  Equipment: ${lab.equipment.map(eq => `${eq.name} (${eq.quantity})`).join(', ')}`
      ).join('\n\n');
      
      return `Our infrastructure includes:\n\n${labList}\n\nNeed more details about any specific lab?`;
    }
    
    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hi! 👋 I'm Liam, your AI assistant for the AIML department at BMSCE. I can help you with:\n\n• Faculty information and contacts\n• Course details and outcomes\n• Lab equipment and facilities\n• Academic calendar\n\nWhat would you like to know?`;
    }
    
    return `I can help you with information about our AIML department including faculty, courses, infrastructure, and academic calendar. What specific information are you looking for?`;
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