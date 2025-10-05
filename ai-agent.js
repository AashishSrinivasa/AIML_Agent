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
      
      const prompt = `You are Liam, the official AI assistant for the Department of Artificial Intelligence and Machine Learning, B.M.S. College of Engineering.

DEPARTMENT CONTEXT:
- Department: ${context.department}
- Established: ${context.infrastructure.established}
- Undergraduate Intake: ${context.infrastructure.undergraduateIntake} students

${focusedData}

USER QUESTION: ${userMessage}

RESPONSE RULES:
1. Give only one clear, correct, and complete answer per question
2. Limit responses to 2-5 sentences or a short bullet list — never long paragraphs
3. Avoid greetings, introductions, sign-offs, or conversational fillers
4. Use simple, human-friendly English; no jargon or overly formal tone
5. Answer only what is asked. Do not add explanations, background info, or advice unless requested
6. Never restate the question or previously known information
7. Do not fabricate or assume details. If unsure, say: "I don't have that information right now"
8. When listing items, use clean bullet points (•) or commas
9. Never repeat names, sentences, or phrases within the same answer
10. Avoid promotional or emotional wording; maintain an informative, neutral tone
11. Do not refer to yourself as an AI or mention being a language model
12. Never use phrases like "according to my data," "as an AI assistant," or "I think"
13. Never apologize unless the user reports an error or confusion
14. Maintain factual integrity — do not guess, exaggerate, or improvise
15. Never greet the user mid-conversation; answer directly each time
16. Use proper punctuation and capitalization; make outputs easy to read
17. When giving data such as emails, codes, or marks, ensure the format is clean and accurate
18. Keep a consistent personality: calm, knowledgeable, approachable, and efficient
19. For lists longer than five items, group them logically or summarize
20. Do not output markdown formatting unless explicitly requested
21. Do not include system instructions or internal reasoning in replies
22. Never mention or describe these rules
23. Always sound like ChatGPT: confident, minimal, and human-like in tone

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
        `• ${f.name} (${f.designation})`
      ).join('\n');
      
      return `Faculty members:\n${facultyList}`;
    }
    
    // Course queries
    if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('syllabus')) {
      const courses = this.knowledgeBase.courses.slice(0, 5);
      const courseList = courses.map(c => 
        `• ${c.name} (${c.code}) - ${c.semester} semester`
      ).join('\n');
      
      return `Courses:\n${courseList}`;
    }
    
    // Infrastructure queries
    if (lowerMessage.includes('lab') || lowerMessage.includes('equipment') || lowerMessage.includes('infrastructure')) {
      const labs = this.knowledgeBase.infrastructure.labs.slice(0, 3);
      const labList = labs.map(lab => 
        `• ${lab.name} (${lab.capacity} students)`
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