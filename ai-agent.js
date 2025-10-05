require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class ComprehensiveAIAgent {
  constructor() {
    this.app = express();
    this.port = 5001;
    this.knowledgeBase = {};
    this.conversationHistory = new Map(); // Store conversation context per session
    
    // Initialize Google Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('❌ GEMINI_API_KEY not found in environment variables.');
      console.log('📋 Please run: node setup-gemini.js to set up your API key');
      process.exit(1);
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 500,
      }
    });
    console.log('✅ Google Gemini AI initialized successfully');
    
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

  // Generate intelligent response using Google Gemini with advanced features
  async generateIntelligentResponse(userMessage, history = [], sessionId = 'default') {
    try {
      const context = this.createComprehensiveContext();
      
      // Get conversation history for this session
      const conversationHistory = this.conversationHistory.get(sessionId) || [];
      
      // Analyze user intent and extract key information
      const intent = this.analyzeUserIntent(userMessage);
      const extractedInfo = this.extractKeyInformation(userMessage, context);
      
      // Build conversation context
      const conversationContext = conversationHistory.length > 0 ? 
        `\nCONVERSATION HISTORY:\n${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}` : '';
      
      // Create enhanced prompt with advanced features
      const prompt = `You are Liam, the official AI assistant for the Department of Artificial Intelligence and Machine Learning, B.M.S. College of Engineering.

You are connected to structured departmental data containing faculty information, syllabus details, course lists, infrastructure, and academic programs. Use ONLY the provided and verified information from this internal data when answering.

DEPARTMENT CONTEXT:
- Department: ${context.department}
- Established: ${context.infrastructure.established}
- Undergraduate Intake: ${context.infrastructure.undergraduateIntake} students

COMPLETE DEPARTMENTAL DATA:

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
`).join('')}

${conversationContext}

USER QUESTION: ${userMessage}
DETECTED INTENT: ${intent}
EXTRACTED INFO: ${JSON.stringify(extractedInfo)}

ADVANCED INSTRUCTIONS:
1. Always rely on the college dataset above for facts — never invent information
2. Use conversation history to understand context and references (like "her", "him", "that course", etc.)
3. For greetings (hello, hi, hey), respond warmly and introduce yourself as Liam, the AI assistant for AIML department
4. For course pathway questions, provide step-by-step guidance based on prerequisites
5. For faculty matching, consider specializations, research areas, and teaching subjects
6. For complex queries, break down into logical steps and provide comprehensive answers
7. Always suggest 2-3 relevant follow-up questions at the end of your response
8. Use bullet points for lists, but keep responses concise (2-5 sentences + suggestions)
9. If user asks about career paths, provide course recommendations and faculty mentors
10. For semester-specific questions, consider prerequisite chains and course progression
11. Maintain context memory throughout the conversation
12. Be friendly and professional in all interactions

RESPONSE FORMAT:
[Your main answer in 2-5 sentences]

SUGGESTED FOLLOW-UP QUESTIONS:
• [Question 1]
• [Question 2] 
• [Question 3]

RESPONSE:`;

      console.log('Calling Gemini with advanced features, prompt length:', prompt.length);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Update conversation history
      conversationHistory.push({ role: 'user', content: userMessage });
      conversationHistory.push({ role: 'assistant', content: text });
      
      // Keep only last 10 messages to manage memory
      if (conversationHistory.length > 10) {
        conversationHistory.splice(0, conversationHistory.length - 10);
      }
      
      this.conversationHistory.set(sessionId, conversationHistory);

      console.log('Gemini response received with context memory');
      return text;

    } catch (error) {
      console.log('❌ Gemini error:', error.message);
      console.log('🔄 Using fallback response');
      console.log('💡 Make sure your GEMINI_API_KEY is valid in .env file');
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
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening')) {
      return `Hello! I'm Liam, your AI assistant for the AIML department at BMSCE. I can help you with faculty information, course details, academic guidance, and more. What would you like to know?`;
    }
    
    return `I can help with faculty, courses, infrastructure, and academic calendar information. What specific information do you need?`;
  }

  // Advanced intent analysis
  analyzeUserIntent(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting detection
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
        lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || 
        lowerMessage.includes('good evening') || lowerMessage.includes('greetings')) {
      return 'greeting';
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('path') || lowerMessage.includes('become')) {
      return 'career_guidance';
    }
    if (lowerMessage.includes('prerequisite') || lowerMessage.includes('before') || lowerMessage.includes('need to take')) {
      return 'prerequisite_analysis';
    }
    if (lowerMessage.includes('teaches') || lowerMessage.includes('instructor') || lowerMessage.includes('who teaches')) {
      return 'faculty_course_mapping';
    }
    if (lowerMessage.includes('semester') && (lowerMessage.includes('what') || lowerMessage.includes('courses'))) {
      return 'semester_course_query';
    }
    if (lowerMessage.includes('research') || lowerMessage.includes('specialization')) {
      return 'research_interest_matching';
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('contact')) {
      return 'contact_information';
    }
    if (lowerMessage.includes('lab') || lowerMessage.includes('equipment') || lowerMessage.includes('infrastructure')) {
      return 'infrastructure_query';
    }
    if (lowerMessage.includes('faculty') || lowerMessage.includes('professor')) {
      return 'faculty_information';
    }
    if (lowerMessage.includes('course') || lowerMessage.includes('subject')) {
      return 'course_information';
    }
    
    return 'general_inquiry';
  }

  // Extract key information from user message
  extractKeyInformation(userMessage, context) {
    const lowerMessage = userMessage.toLowerCase();
    const extracted = {
      semester: null,
      facultyName: null,
      courseName: null,
      specialization: null,
      intent: null
    };
    
    // Extract semester
    const semesterMatch = lowerMessage.match(/(\d+)(?:st|nd|rd|th)?\s*semester/);
    if (semesterMatch) {
      extracted.semester = semesterMatch[1];
    }
    
    // Extract faculty name
    for (const faculty of context.faculty) {
      const nameParts = faculty.name.toLowerCase().split(' ');
      for (const part of nameParts) {
        if (lowerMessage.includes(part) && part.length > 2) {
          extracted.facultyName = faculty.name;
          break;
        }
      }
      if (extracted.facultyName) break;
    }
    
    // Extract course name
    for (const course of context.courses) {
      const courseWords = course.name.toLowerCase().split(' ');
      for (const word of courseWords) {
        if (lowerMessage.includes(word) && word.length > 3) {
          extracted.courseName = course.name;
          break;
        }
      }
      if (extracted.courseName) break;
    }
    
    // Extract specialization
    const specializations = ['machine learning', 'deep learning', 'computer vision', 'nlp', 'data science', 'ai', 'artificial intelligence'];
    for (const spec of specializations) {
      if (lowerMessage.includes(spec)) {
        extracted.specialization = spec;
        break;
      }
    }
    
    return extracted;
  }

  // Generate smart suggestions based on context and intent
  generateSuggestions(userMessage, intent = null, extractedInfo = null) {
    if (!intent) {
      intent = this.analyzeUserIntent(userMessage);
    }
    
    const suggestions = [];
    
    switch (intent) {
      case 'greeting':
        suggestions.push(
          'Tell me about the faculty members',
          'What courses are available?',
          'Show me the department facilities'
        );
        break;
        
      case 'career_guidance':
        suggestions.push(
          'What courses should I take for data science?',
          'Show me faculty who specialize in AI',
          'What are the prerequisites for machine learning courses?'
        );
        break;
        
      case 'faculty_course_mapping':
        suggestions.push(
          'What other courses does this faculty teach?',
          'Show me all faculty members',
          'What are their research areas?'
        );
        break;
        
      case 'semester_course_query':
        suggestions.push(
          'What are the prerequisites for these courses?',
          'Who teaches these courses?',
          'Show me courses from other semesters'
        );
        break;
        
      case 'research_interest_matching':
        suggestions.push(
          'What courses cover this topic?',
          'Show me faculty research areas',
          'What labs work on this research?'
        );
        break;
        
      case 'infrastructure_query':
        suggestions.push(
          'What equipment is available in other labs?',
          'Show me all lab capacities',
          'What research facilities are there?'
        );
        break;
        
      case 'prerequisite_analysis':
        suggestions.push(
          'Show me the complete course pathway',
          'What courses can I take next semester?',
          'Who teaches the prerequisite courses?'
        );
        break;
        
      default:
        suggestions.push(
          'Tell me about the faculty',
          'What courses are available?',
          'Show me the labs'
        );
    }
    
    return suggestions;
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

    // AI Chat API with advanced features
    this.app.post('/api/ai/chat', async (req, res) => {
      try {
        const { message, history = [], sessionId = 'default' } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Received message:', message, 'Session:', sessionId);
        
        // Analyze intent and extract information
        const intent = this.analyzeUserIntent(message);
        const context = this.createComprehensiveContext();
        const extractedInfo = this.extractKeyInformation(message, context);
        
        // Generate intelligent response with context
        const response = await this.generateIntelligentResponse(message, history, sessionId);
        
        // Generate smart suggestions based on intent
        const suggestions = this.generateSuggestions(message, intent, extractedInfo);

        res.json({
          data: {
            response: response,
            sources: ['Faculty Directory', 'Course Catalog', 'Infrastructure Guide', 'Academic Calendar'],
            suggestions: suggestions,
            confidence: 0.95,
            intent: intent,
            extractedInfo: extractedInfo,
            entities: {
              faculty: extractedInfo.facultyName ? [extractedInfo.facultyName] : [],
              courses: extractedInfo.courseName ? [extractedInfo.courseName] : [],
              specializations: extractedInfo.specialization ? [extractedInfo.specialization] : [],
              semesters: extractedInfo.semester ? [extractedInfo.semester] : []
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