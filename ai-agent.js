#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class DemoAIAgent {
  constructor() {
    this.app = express();
    this.port = 5001;
    this.knowledgeBase = {};
    this.conversationHistory = new Map();
    
    // Initialize Google Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('❌ GEMINI_API_KEY not found in environment variables.');
      console.log('📋 Please set your API key in .env file');
    } else {
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
    }
    
    this.setupMiddleware();
    this.loadComprehensiveData();
    this.setupRoutes();
    this.startServer();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  loadComprehensiveData() {
    try {
      console.log('🧠 Loading Comprehensive Knowledge Base...');
      
      const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_faculty.json'), 'utf8'));
      this.knowledgeBase.faculty = facultyData;
      
      const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_courses.json'), 'utf8'));
      this.knowledgeBase.courses = coursesData;
      
      const infrastructureData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_infrastructure.json'), 'utf8'));
      this.knowledgeBase.infrastructure = infrastructureData;
      
      const calendarData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_academic_calendar.json'), 'utf8'));
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
      console.log(`   📊 Faculty: ${this.knowledgeBase.faculty.length} members`);
      console.log(`   📚 Courses: ${this.knowledgeBase.courses.length} courses`);
      console.log(`   🏢 Infrastructure: ${this.knowledgeBase.infrastructure.labs.length} labs`);
      console.log(`   📅 Calendar: ${this.knowledgeBase.calendar.length} events`);
      
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  }

  // Advanced intelligent response with Gemini integration
  async generateIntelligentResponse(userMessage, sessionId = 'default') {
    const lowerMessage = userMessage.toLowerCase();
    
    // Get conversation history
    const conversationHistory = this.conversationHistory.get(sessionId) || [];
    
    // Analyze intent
    const intent = this.analyzeUserIntent(userMessage);
    const extractedInfo = this.extractKeyInformation(userMessage);
    
    // Try Gemini first if available
    if (this.model) {
      try {
        const geminiResponse = await this.generateGeminiResponse(userMessage, conversationHistory, intent, extractedInfo);
        if (geminiResponse) {
          // Update conversation history
          conversationHistory.push({ role: 'user', content: userMessage });
          conversationHistory.push({ role: 'assistant', content: geminiResponse.response });
          if (conversationHistory.length > 10) {
            conversationHistory.splice(0, conversationHistory.length - 10);
          }
          this.conversationHistory.set(sessionId, conversationHistory);
          
          return geminiResponse;
        }
      } catch (error) {
        console.log('❌ Gemini error:', error.message);
        console.log('🔄 Using fallback response');
      }
    }
    
    // Fallback to rule-based response
    return this.generateFallbackResponse(userMessage, sessionId, intent, extractedInfo);
  }

  // Generate response using Gemini
  async generateGeminiResponse(userMessage, conversationHistory, intent, extractedInfo) {
    const context = this.createComprehensiveContext();
    
    // Build conversation context
    const conversationContext = conversationHistory.length > 0 ? 
      `\nCONVERSATION HISTORY:\n${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}` : '';
    
    const prompt = `You are Liam, the official AI assistant for the Department of Artificial Intelligence and Machine Learning, B.M.S. College of Engineering.

You are connected to structured departmental data. Use ONLY the provided information from this internal data when answering.

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

${conversationContext}

USER QUESTION: ${userMessage}
DETECTED INTENT: ${intent}
EXTRACTED INFO: ${JSON.stringify(extractedInfo)}

INSTRUCTIONS:
1. Always rely on the college dataset above for facts — never invent information
2. Use conversation history to understand context and references
3. For greetings (hello, hi, hey), respond warmly and introduce yourself as Liam
4. For course questions, provide specific course details from the data
5. For faculty questions, provide specific faculty information from the data
6. For infrastructure questions, provide specific lab and facility information
7. Always suggest 2-3 relevant follow-up questions at the end
8. Use bullet points for lists, but keep responses concise (2-5 sentences + suggestions)
9. Be friendly and professional in all interactions

RESPONSE FORMAT:
[Your main answer in 2-5 sentences]

SUGGESTED FOLLOW-UP QUESTIONS:
• [Question 1]
• [Question 2] 
• [Question 3]

RESPONSE:`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract suggestions from the response
    const suggestionsMatch = text.match(/SUGGESTED FOLLOW-UP QUESTIONS:\s*•\s*(.+?)\s*•\s*(.+?)\s*•\s*(.+?)(?:\n|$)/s);
    const suggestions = suggestionsMatch ? [
      suggestionsMatch[1].trim(),
      suggestionsMatch[2].trim(),
      suggestionsMatch[3].trim()
    ] : [
      'Tell me about the faculty members',
      'What courses are available?',
      'Show me the department facilities'
    ];
    
    return {
      response: text.replace(/SUGGESTED FOLLOW-UP QUESTIONS:.*$/s, '').trim(),
      suggestions: suggestions,
      intent: intent,
      extractedInfo: extractedInfo
    };
  }

  // Fallback response generation
  generateFallbackResponse(userMessage, sessionId, intent, extractedInfo) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Get conversation history
    const conversationHistory = this.conversationHistory.get(sessionId) || [];
    
    // Update conversation history
    conversationHistory.push({ role: 'user', content: userMessage });
    
    let response = '';
    let suggestions = [];
    
    // Generate response based on intent
    switch (intent) {
      case 'greeting':
        response = `Hello! I'm Liam, your AI assistant for the AIML department at BMSCE. I can help you with faculty information, course details, academic guidance, and more. What would you like to know?`;
        suggestions = [
          'Tell me about the faculty members',
          'What courses are available?',
          'Show me the department facilities'
        ];
        break;
        
      case 'career_guidance':
        const dataScienceCourses = this.knowledgeBase.courses.filter(c => 
          c.name.toLowerCase().includes('data') || 
          c.name.toLowerCase().includes('machine learning') ||
          c.name.toLowerCase().includes('analytics')
        );
        if (dataScienceCourses.length > 0) {
          response = `To become a data scientist, focus on these courses:
${dataScienceCourses.slice(0, 5).map(c => `• ${c.semester}: ${c.name} (${c.credits} credits)`).join('\n')}

These courses will give you the foundation needed for a data science career.`;
        } else {
          response = `To become a data scientist, focus on courses in Machine Learning, Data Analytics, and Statistics. Check the courses page for detailed information.`;
        }
        suggestions = [
          'What courses should I take for data science?',
          'Show me faculty who specialize in AI',
          'What are the prerequisites for machine learning courses?'
        ];
        break;
        
      case 'faculty_course_mapping':
        if (lowerMessage.includes('computer vision')) {
          const computerVisionFaculty = this.knowledgeBase.faculty.filter(f => 
            f.specialization && f.specialization.some(s => s.toLowerCase().includes('computer vision'))
          );
          if (computerVisionFaculty.length > 0) {
            response = `Computer Vision courses are taught by:
• Dr. Vinutha H - specializes in Computer Vision and Pattern Recognition
• Dr. Seemanthini K - expert in Computer Vision and Deep Learning
• Dr. Sowmya Lakshmi B S - focuses on Deep Learning and Computer Vision`;
          } else {
            response = `Computer Vision courses are taught by faculty members specializing in Computer Vision, Deep Learning, and Pattern Recognition.`;
          }
        } else {
          response = `Faculty members teach various courses based on their specializations. What specific subject are you interested in?`;
        }
        suggestions = [
          'What other courses does this faculty teach?',
          'Show me all faculty members',
          'What are their research areas?'
        ];
        break;
        
      case 'contact_information':
        if (lowerMessage.includes('sandeep') && lowerMessage.includes('varma')) {
          const sandeep = this.knowledgeBase.faculty.find(f => f.name.toLowerCase().includes('sandeep'));
          if (sandeep) {
            response = `Dr. Sandeep Varma N (${sandeep.designation}) - Email: ${sandeep.email}`;
          } else {
            response = `Dr. Sandeep Varma N - Email: sandeep.mel@bmsce.ac.in`;
          }
        } else if (lowerMessage.includes('pallavi')) {
          const pallavi = this.knowledgeBase.faculty.find(f => f.name.toLowerCase().includes('pallavi'));
          if (pallavi) {
            response = `Dr. Pallavi B (${pallavi.designation}) - Email: ${pallavi.email}`;
          } else {
            response = `Dr. Pallavi B - Email: pallavib.mel@bmsce.ac.in`;
          }
        } else if (lowerMessage.includes('hod') || lowerMessage.includes('head')) {
          response = `Dr. M Dakshayini is the Professor and Head of the Department of Artificial Intelligence and Machine Learning.`;
        } else {
          response = `I can help you find faculty contact information. Which faculty member are you looking for?`;
        }
        suggestions = [
          'Show me all faculty members',
          'What are their specializations?',
          'Who is the HOD?'
        ];
        break;
        
      case 'semester_course_query':
        const semester5Courses = this.knowledgeBase.courses.filter(c => c.semester.toLowerCase().includes('5th'));
        if (semester5Courses.length > 0) {
          response = `Semester V courses include:
• Deep Learning Fundamentals (4 credits)
• Natural Language Processing (4 credits)
• Computer Vision (4 credits)
• Data Science and Analytics (4 credits)

These courses build on your foundation from previous semesters.`;
        } else {
          response = `Semester 5 courses focus on advanced topics like Deep Learning, NLP, Computer Vision, and Data Science.`;
        }
        suggestions = [
          'What are the prerequisites for these courses?',
          'Who teaches these courses?',
          'Show me courses from other semesters'
        ];
        break;
        
      case 'infrastructure_query':
        if (this.knowledgeBase.infrastructure && this.knowledgeBase.infrastructure.labs) {
          const labs = this.knowledgeBase.infrastructure.labs;
          response = `Available Labs:
• ${labs[0].name} - ${labs[0].capacity} students, ${labs[0].location}
• ${labs[1].name} - ${labs[1].capacity} students, ${labs[1].location}
• ${labs[2].name} - ${labs[2].capacity} students, ${labs[2].location}
• ${labs[3].name} - ${labs[3].capacity} students, ${labs[3].location}

All labs are equipped with modern computing facilities and specialized software.`;
        } else {
          response = `The department has 4 modern computer labs with advanced computing facilities for AI/ML research and development.`;
        }
        suggestions = [
          'What equipment is available in the labs?',
          'Show me faculty members',
          'What courses are available?'
        ];
        break;
        
      case 'faculty_listing':
        const facultyList = this.knowledgeBase.faculty.slice(0, 5).map(f => 
          `• ${f.name} (${f.designation}) - ${f.specialization ? f.specialization[0] : 'AI/ML'}`).join('\n');
        response = `Faculty Members:
${facultyList}

... and ${this.knowledgeBase.faculty.length - 5} more faculty members.

For specific faculty details, ask about individual members.`;
        suggestions = [
          'Tell me about Dr. Sandeep Varma',
          'Who teaches computer vision?',
          'What are the research areas?'
        ];
        break;
        
      case 'course_query':
        if (lowerMessage.includes('all courses') || lowerMessage.includes('available courses')) {
          const allCourses = this.knowledgeBase.courses.slice(0, 8).map(c => 
            `• ${c.name} (${c.code}) - ${c.semester} - ${c.credits} credits`).join('\n');
          response = `Available Courses:
${allCourses}

... and ${this.knowledgeBase.courses.length - 8} more courses.

For detailed course information, visit the Courses page.`;
        } else if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
          const mlCourses = this.knowledgeBase.courses.filter(c => 
            c.name.toLowerCase().includes('machine learning') || 
            c.name.toLowerCase().includes('ml')
          );
          if (mlCourses.length > 0) {
            response = `Machine Learning Courses:
${mlCourses.map(c => `• ${c.name} (${c.code}) - ${c.semester} - ${c.credits} credits`).join('\n')}`;
          } else {
            response = `Machine Learning courses are available across different semesters. Check the Courses page for detailed information.`;
          }
        } else {
          response = `I can help you with course information. We have ${this.knowledgeBase.courses.length} courses across 6 semesters (3rd to 8th). What specific course information do you need?`;
        }
        suggestions = [
          'Show me all available courses',
          'What machine learning courses are there?',
          'Tell me about semester 5 courses'
        ];
        break;
        
      default:
        response = `I can help you with faculty information, course details, academic guidance, and department facilities. What specific information do you need?`;
        suggestions = [
          'Tell me about the faculty',
          'What courses are available?',
          'Show me the labs'
        ];
    }
    
    // Update conversation history
    conversationHistory.push({ role: 'assistant', content: response });
    if (conversationHistory.length > 10) {
      conversationHistory.splice(0, conversationHistory.length - 10);
    }
    this.conversationHistory.set(sessionId, conversationHistory);
    
    return { response, suggestions, intent, extractedInfo };
  }

  analyzeUserIntent(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Prioritize specific queries first
    if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('syllabus') || lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
      return 'course_query';
    }
    if (lowerMessage.includes('semester') && lowerMessage.includes('course')) {
      return 'semester_course_query';
    }
    if (lowerMessage.includes('teaches') || lowerMessage.includes('who teaches')) {
      return 'faculty_course_mapping';
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('contact') || lowerMessage.includes('sandeep') || lowerMessage.includes('pallavi') || lowerMessage.includes('hod')) {
      return 'contact_information';
    }
    if (lowerMessage.includes('career') || lowerMessage.includes('become')) {
      return 'career_guidance';
    }
    if (lowerMessage.includes('lab') || lowerMessage.includes('infrastructure') || lowerMessage.includes('facility')) {
      return 'infrastructure_query';
    }
    if (lowerMessage.includes('show') && lowerMessage.includes('faculty') || lowerMessage.includes('all faculty')) {
      return 'faculty_listing';
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    }
    
    return 'general_inquiry';
  }

  extractKeyInformation(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const extracted = {
      semester: null,
      facultyName: null,
      courseName: null,
      specialization: null
    };
    
    const semesterMatch = lowerMessage.match(/(\d+)(?:st|nd|rd|th)?\s*semester/);
    if (semesterMatch) {
      extracted.semester = semesterMatch[1];
    }
    
    return extracted;
  }

  // Create comprehensive context from knowledge base
  createComprehensiveContext() {
    return {
      department: "Department of Artificial Intelligence and Machine Learning",
      faculty: this.knowledgeBase.faculty || [],
      courses: this.knowledgeBase.courses || [],
      infrastructure: this.knowledgeBase.infrastructure || { labs: [], established: "2020", undergraduateIntake: 60 },
      calendar: this.knowledgeBase.calendar || []
    };
  }

  setupRoutes() {
    // AI Chat API
    this.app.post('/api/ai/chat', async (req, res) => {
      try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        console.log('💬 Received message:', message);
        
        const result = await this.generateIntelligentResponse(message, sessionId);
        
        res.json({
          data: {
            response: result.response,
            sources: ['Faculty Directory', 'Course Catalog', 'Infrastructure Guide'],
            suggestions: result.suggestions,
            confidence: 0.95,
            intent: result.intent,
            extractedInfo: result.extractedInfo
          }
        });
        
      } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
      }
    });

    // Other API endpoints
    this.app.get('/api/faculty', (req, res) => {
      res.json({ data: this.knowledgeBase.faculty });
    });

    this.app.get('/api/courses', (req, res) => {
      res.json({ data: this.knowledgeBase.courses });
    });

    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }

  startServer() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Demo AI Agent running on port ${this.port}`);
      console.log(`📊 Serving ${this.knowledgeBase.faculty.length} faculty members`);
      console.log(`📚 Serving ${this.knowledgeBase.courses.length} courses`);
      console.log(`🏢 Serving infrastructure data`);
      console.log(`📅 Serving calendar data`);
      console.log(`🤖 Demo AI Agent ready for intelligent conversations!`);
      console.log(`\n💡 This is a demo version. For full Gemini features, get your API key from:`);
      console.log(`   https://makersuite.google.com/app/apikey`);
    });
  }
}

// Start the demo agent
new DemoAIAgent();
