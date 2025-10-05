#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

class DemoAIAgent {
  constructor() {
    this.app = express();
    this.port = 5001;
    this.knowledgeBase = {};
    this.conversationHistory = new Map();
    
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

  // Advanced intelligent response simulation
  generateIntelligentResponse(userMessage, sessionId = 'default') {
    const lowerMessage = userMessage.toLowerCase();
    
    // Get conversation history
    const conversationHistory = this.conversationHistory.get(sessionId) || [];
    
    // Analyze intent
    const intent = this.analyzeUserIntent(userMessage);
    const extractedInfo = this.extractKeyInformation(userMessage);
    
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
        response = `To become a data scientist, focus on these courses:
• 3rd Semester: Mathematical Foundations, Data Structures, Probability & Statistics
• 4th Semester: Introduction to Machine Learning, Algorithms
• 5th Semester: Data Science and Analytics, Deep Learning Fundamentals

These courses will give you the foundation needed for a data science career.`;
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
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'greeting';
    }
    if (lowerMessage.includes('career') || lowerMessage.includes('become')) {
      return 'career_guidance';
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('contact') || lowerMessage.includes('sandeep') || lowerMessage.includes('pallavi') || lowerMessage.includes('hod')) {
      return 'contact_information';
    }
    if (lowerMessage.includes('teaches') || lowerMessage.includes('who teaches')) {
      return 'faculty_course_mapping';
    }
    if (lowerMessage.includes('semester') && lowerMessage.includes('course')) {
      return 'semester_course_query';
    }
    if (lowerMessage.includes('lab') || lowerMessage.includes('infrastructure') || lowerMessage.includes('facility')) {
      return 'infrastructure_query';
    }
    if (lowerMessage.includes('show') && lowerMessage.includes('faculty') || lowerMessage.includes('all faculty')) {
      return 'faculty_listing';
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

  setupRoutes() {
    // AI Chat API
    this.app.post('/api/ai/chat', async (req, res) => {
      try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }

        console.log('💬 Received message:', message);
        
        const result = this.generateIntelligentResponse(message, sessionId);
        
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
