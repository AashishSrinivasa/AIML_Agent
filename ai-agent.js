#!/usr/bin/env node

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIMLAgent {
  constructor() {
    this.app = express();
    this.port = 5001;
    this.knowledgeBase = {};
    this.conversationHistory = new Map();
    
    // Initialize Google Gemini AI
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBQmFySnKjg0GbjYHvUI6Pfpl-9e2GYYTY';
    if (!apiKey) {
      console.log('❌ GEMINI_API_KEY not found in environment variables.');
      console.log('📋 Please set your API key in .env file');
      this.genAI = null;
      this.model = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 800,
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
      console.error('❌ Error loading knowledge base:', error.message);
      process.exit(1);
    }
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Faculty routes
    this.app.get('/api/faculty', (req, res) => {
      const { search, designation, specialization, researchArea } = req.query;
      
      let filteredFaculty = this.knowledgeBase.faculty;
      
      // Search by name, specialization, or research areas
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredFaculty = filteredFaculty.filter(faculty => 
          faculty.name.toLowerCase().includes(searchTerm) ||
          (faculty.specialization && Array.isArray(faculty.specialization) && 
           faculty.specialization.some(spec => spec.toLowerCase().includes(searchTerm))) ||
          (faculty.researchAreas && Array.isArray(faculty.researchAreas) && 
           faculty.researchAreas.some(area => area.toLowerCase().includes(searchTerm)))
        );
      }
      
      // Filter by designation
      if (designation) {
        filteredFaculty = filteredFaculty.filter(faculty => 
          faculty.designation && faculty.designation.toLowerCase().includes(designation.toLowerCase())
        );
      }
      
      // Filter by specialization
      if (specialization) {
        filteredFaculty = filteredFaculty.filter(faculty => 
          faculty.specialization && Array.isArray(faculty.specialization) && 
          faculty.specialization.some(spec => spec.toLowerCase().includes(specialization.toLowerCase()))
        );
      }
      
      // Filter by research area
      if (researchArea) {
        filteredFaculty = filteredFaculty.filter(faculty => 
          faculty.researchAreas && Array.isArray(faculty.researchAreas) && 
          faculty.researchAreas.some(area => area.toLowerCase().includes(researchArea.toLowerCase()))
        );
      }
      
      res.json({ data: filteredFaculty });
    });

    this.app.get('/api/faculty/stats/overview', (req, res) => {
      const stats = {
        total: this.knowledgeBase.faculty.length,
        professors: this.knowledgeBase.faculty.filter(f => f.designation.includes('Professor')).length,
        associateProfessors: this.knowledgeBase.faculty.filter(f => f.designation.includes('Associate')).length,
        assistantProfessors: this.knowledgeBase.faculty.filter(f => f.designation.includes('Assistant')).length
      };
      res.json({ data: stats });
    });

    // Courses routes
    this.app.get('/api/courses', (req, res) => {
      const { search, semester, instructor, credits } = req.query;
      
      let filteredCourses = this.knowledgeBase.courses;
      
      // Search by name, code, or instructor
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
          course.name.toLowerCase().includes(searchTerm) ||
          course.code.toLowerCase().includes(searchTerm) ||
          (course.instructor && course.instructor.toLowerCase().includes(searchTerm)) ||
          (course.topics && Array.isArray(course.topics) && 
           course.topics.some(topic => topic.toLowerCase().includes(searchTerm)))
        );
      }
      
      // Filter by semester
      if (semester) {
        filteredCourses = filteredCourses.filter(course => 
          course.semester === semester
        );
      }
      
      // Filter by instructor
      if (instructor) {
        filteredCourses = filteredCourses.filter(course => 
          course.instructor && course.instructor.toLowerCase().includes(instructor.toLowerCase())
        );
      }
      
      // Filter by credits
      if (credits) {
        filteredCourses = filteredCourses.filter(course => 
          course.credits === parseInt(credits)
        );
      }
      
      res.json({ data: filteredCourses });
    });

    this.app.get('/api/courses/stats/overview', (req, res) => {
      const stats = {
        total: this.knowledgeBase.courses.length,
        semesters: new Set(this.knowledgeBase.courses.map(c => c.semester)).size,
        totalCredits: this.knowledgeBase.courses.reduce((sum, c) => sum + c.credits, 0)
      };
      res.json({ data: stats });
    });

    // Infrastructure routes
    this.app.get('/api/infrastructure', (req, res) => {
      res.json({ data: this.knowledgeBase.infrastructure });
    });

    // Calendar routes
    this.app.get('/api/calendar', (req, res) => {
      // Return the full calendar object, not just events
      const calendarData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_academic_calendar.json'), 'utf8'));
      res.json({ data: calendarData });
    });

    // AI Chat route
    this.app.post('/api/ai/chat', async (req, res) => {
      try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message || !message.trim()) {
          return res.status(400).json({ error: 'Message is required' });
        }

        const response = await this.generateIntelligentResponse(message, sessionId);
        res.json({ data: response });
        
      } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Help route
    this.app.get('/api/ai/help', (req, res) => {
      res.json({
        data: {
          capabilities: [
            { category: 'Faculty Information', description: 'Get details about faculty members, their specializations, and contact information' },
            { category: 'Course Information', description: 'Access course details, prerequisites, and semester-wise information' },
            { category: 'Infrastructure', description: 'Learn about labs, equipment, and facilities available' },
            { category: 'Academic Calendar', description: 'Check exam schedules, holidays, and important dates' },
            { category: 'Department Information', description: 'Get information about the AIML department, location, and vision' }
          ]
        }
      });
    });

    // Faculty CRUD routes
    this.app.post('/api/faculty', (req, res) => {
      try {
        const newFaculty = {
          id: `faculty_${Date.now()}`,
          ...req.body,
          createdAt: new Date().toISOString()
        };
        
        this.knowledgeBase.faculty.push(newFaculty);
        this.saveFacultyData();
        
        res.status(201).json({
          success: true,
          data: newFaculty
        });
      } catch (error) {
        console.error('Error creating faculty:', error);
        res.status(500).json({ error: 'Failed to create faculty member' });
      }
    });

    this.app.put('/api/faculty/:id', (req, res) => {
      try {
        const facultyIndex = this.knowledgeBase.faculty.findIndex(f => f.id === req.params.id);
        
        if (facultyIndex === -1) {
          return res.status(404).json({
            success: false,
            message: 'Faculty member not found'
          });
        }
        
        this.knowledgeBase.faculty[facultyIndex] = {
          ...this.knowledgeBase.faculty[facultyIndex],
          ...req.body,
          updatedAt: new Date().toISOString()
        };
        
        this.saveFacultyData();
        
        res.json({
          success: true,
          data: this.knowledgeBase.faculty[facultyIndex]
        });
      } catch (error) {
        console.error('Error updating faculty:', error);
        res.status(500).json({ error: 'Failed to update faculty member' });
      }
    });

    this.app.delete('/api/faculty/:id', (req, res) => {
      try {
        const facultyIndex = this.knowledgeBase.faculty.findIndex(f => f.id === req.params.id);
        
        if (facultyIndex === -1) {
          return res.status(404).json({
            success: false,
            message: 'Faculty member not found'
          });
        }
        
        const deletedFaculty = this.knowledgeBase.faculty.splice(facultyIndex, 1)[0];
        this.saveFacultyData();
        
        res.json({
          success: true,
          data: deletedFaculty
        });
      } catch (error) {
        console.error('Error deleting faculty:', error);
        res.status(500).json({ error: 'Failed to delete faculty member' });
      }
    });

    // Courses CRUD routes
    this.app.post('/api/courses', (req, res) => {
      try {
        const newCourse = {
          id: `course_${Date.now()}`,
          ...req.body,
          createdAt: new Date().toISOString()
        };
        
        this.knowledgeBase.courses.push(newCourse);
        this.saveCoursesData();
        
        res.status(201).json({
          success: true,
          data: newCourse
        });
      } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Failed to create course' });
      }
    });

    this.app.put('/api/courses/:id', (req, res) => {
      try {
        const courseIndex = this.knowledgeBase.courses.findIndex(c => c.id === req.params.id);
        
        if (courseIndex === -1) {
          return res.status(404).json({
            success: false,
            message: 'Course not found'
          });
        }
        
        this.knowledgeBase.courses[courseIndex] = {
          ...this.knowledgeBase.courses[courseIndex],
          ...req.body,
          updatedAt: new Date().toISOString()
        };
        
        this.saveCoursesData();
        
        res.json({
          success: true,
          data: this.knowledgeBase.courses[courseIndex]
        });
      } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Failed to update course' });
      }
    });

    this.app.delete('/api/courses/:id', (req, res) => {
      try {
        const courseIndex = this.knowledgeBase.courses.findIndex(c => c.id === req.params.id);
        
        if (courseIndex === -1) {
          return res.status(404).json({
            success: false,
            message: 'Course not found'
          });
        }
        
        const deletedCourse = this.knowledgeBase.courses.splice(courseIndex, 1)[0];
        this.saveCoursesData();
        
        res.json({
          success: true,
          data: deletedCourse
        });
      } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course' });
      }
    });
  }

  async generateIntelligentResponse(userMessage, sessionId) {
    const intent = this.analyzeUserIntent(userMessage);
    const extractedInfo = this.extractKeyInformation(userMessage);
    
    // Get conversation history
    const conversationHistory = this.conversationHistory.get(sessionId) || [];
    
    // Try Gemini first if available
    if (this.model) {
      try {
        console.log('🤖 Attempting Gemini response...');
        const geminiResponse = await this.generateGeminiResponse(userMessage, intent, extractedInfo, conversationHistory);
        if (geminiResponse) {
          console.log('✅ Gemini response successful');
          this.updateConversationHistory(sessionId, userMessage, geminiResponse.response);
          return geminiResponse;
        } else {
          console.log('❌ Gemini returned null, using enhanced fallback');
        }
      } catch (error) {
        console.log('❌ Gemini error:', error.message);
        console.log('Using enhanced fallback response');
      }
    } else {
      console.log('❌ Gemini model not available, using enhanced fallback');
    }
    
    // Enhanced fallback response with more intelligence
    const fallbackResponse = this.generateIntelligentFallbackResponse(userMessage, intent, extractedInfo, sessionId);
    this.updateConversationHistory(sessionId, userMessage, fallbackResponse.response);
    return fallbackResponse;
  }

  async generateGeminiResponse(userMessage, intent, extractedInfo, conversationHistory) {
    const context = this.createComprehensiveContext();
    const conversationContext = conversationHistory.length > 0 
      ? `\n\nCONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      : '';

    const prompt = `You are LIAM, an AI assistant for the AIML Department at BMSCE. Provide ChatGPT-quality responses that are concise, relevant, and perfectly formatted.

DEPARTMENT DATA (use when relevant):
FACULTY DATA:
${context.faculty.map(f => `
- ${f.name}
  Designation: ${f.designation}
  Email: ${f.email}
  Phone: ${f.phone || 'Not specified'}
  Office: ${f.office || 'Department of AIML'}
  Specialization: ${Array.isArray(f.specialization) ? f.specialization.join(', ') : f.specialization}
  Research Areas: ${Array.isArray(f.researchAreas) ? f.researchAreas.join(', ') : 'Not specified'}
  Qualifications: ${Array.isArray(f.qualifications) ? f.qualifications.join(', ') : 'Not specified'}
`).join('')}

COURSES DATA:
${context.courses.map(c => `
- ${c.name}
  Code: ${c.code}
  Semester: ${c.semester}
  Credits: ${c.credits}
  Instructor: ${c.instructor || 'TBA'}
  Prerequisites: ${Array.isArray(c.prerequisites) ? c.prerequisites.join(', ') : c.prerequisites}
  Description: ${c.description}
  Course Type: ${c.courseType}
  Contact Hours: ${c.contactHours}
  Examination: CIE ${c.examination.cieMarks} marks, SEE ${c.examination.seeMarks} marks
`).join('')}

INFRASTRUCTURE DATA:
Department Location: ${context.infrastructure.location ? `${context.infrastructure.location.building}, ${context.infrastructure.location.floor} - ${context.infrastructure.location.description}` : 'PJ Block, 7th Floor - All labs, classrooms, and faculty staff rooms are located here'}

${context.infrastructure.labs.map(lab => `
- ${lab.name}
  Capacity: ${lab.capacity} students
  Location: ${lab.location}
  Equipment: ${lab.equipment.map(eq => `${eq.name} (${eq.quantity} units) - ${eq.specifications}`).join(', ')}
  Facilities: ${lab.facilities.join(', ')}
  Availability: ${lab.availability}
  Special Features: ${lab.specialFeatures.join(', ')}
`).join('')}

${conversationContext}

USER QUESTION: ${userMessage}
DETECTED INTENT: ${intent}
EXTRACTED INFO: ${JSON.stringify(extractedInfo)}

CRITICAL INSTRUCTIONS:
1. Answer what is asked with sufficient detail - be informative and relevant
2. Use formal, professional tone like ChatGPT
3. Format responses with proper bullet points using • symbol
4. Provide comprehensive information - maximum 8-10 bullet points
5. For department queries, use exact data provided above
6. For general questions, provide accurate, detailed answers
7. Include relevant context and additional useful information
8. Always provide 2-3 relevant follow-up suggestions
9. Use **bold** for important headers and key information
10. Structure information clearly with proper spacing and organization

RESPONSE FORMAT:
[Direct answer to the question with bullet points]

SUGGESTED FOLLOW-UP QUESTIONS:
• [Question 1]
• [Question 2]
• [Question 3]

RESPONSE:`;

    try {
      console.log('📤 Sending prompt to Gemini via REST API...');
      
      // Use REST API directly
      const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBQmFySnKjg0GbjYHvUI6Pfpl-9e2GYYTY';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const text = data.candidates[0].content.parts[0].text;
        
        console.log('📥 Received response from Gemini:', text.substring(0, 100) + '...');
        
        // Parse the response to extract main answer and suggestions
        const parts = text.split('SUGGESTED FOLLOW-UP QUESTIONS:');
        const mainResponse = parts[0].trim();
        const suggestionsText = parts[1] ? parts[1].trim() : '';
        
        let suggestions = [];
        if (suggestionsText) {
          suggestions = suggestionsText
            .split('\n')
            .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
            .filter(line => line.length > 0)
            .slice(0, 3);
        }
        
        // If no suggestions found, provide default ones based on intent
        if (suggestions.length === 0) {
          switch (intent) {
            case 'greeting':
              suggestions = [
                "Tell me about the faculty members",
                "What courses are available in 5th semester?",
                "Show me the lab facilities"
              ];
              break;
            case 'faculty_listing':
            case 'faculty_query':
              suggestions = [
                "Tell me about more faculty members",
                "What are the research areas in the department?",
                "Show me faculty by specialization"
              ];
              break;
            case 'course_query':
            case 'semester_course_query':
              suggestions = [
                "Show me courses by semester",
                "Tell me about 5th semester courses",
                "What are the core courses?"
              ];
              break;
            case 'infrastructure_query':
            case 'lab_query':
              suggestions = [
                "Tell me about specific lab equipment",
                "What are the lab timings?",
                "Show me research facilities"
              ];
              break;
            case 'calendar_query':
              suggestions = [
                "Show me all events this month",
                "Tell me about exam dates",
                "What are the important deadlines?"
              ];
              break;
            default:
              suggestions = [
                "Tell me about the AIML department",
                "What courses do you offer?",
                "Show me the faculty members"
              ];
          }
        }
        
        return {
          response: mainResponse,
          suggestions: suggestions,
          intent: intent,
          extractedInfo: extractedInfo
        };
      }
    } catch (error) {
      console.error('❌ Gemini REST API error:', error);
      console.error('Error details:', error.message);
    }
    
    return null;
  }

  generateIntelligentFallbackResponse(userMessage, intent, extractedInfo, sessionId) {
    const context = this.createComprehensiveContext();
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions = [];
    
    // Enhanced context-aware responses
    switch (intent) {
             case 'greeting':
               response = `Hello! I'm LIAM, the AI assistant for the AIML Department at BMSCE. I can help you with:

• Faculty information and research areas
• Course details and prerequisites
• Lab facilities and equipment
• Academic calendar and events

What would you like to know?`;

               suggestions = [
                 "Tell me about the faculty members",
                 "What courses are available in 5th semester?",
                 "Show me the lab facilities"
               ];
               break;
        
      case 'faculty_query':
      case 'faculty_listing':
        const facultyQuery = lowerMessage;
        let facultyResults = [];
        
        if (facultyQuery.includes('hod') || facultyQuery.includes('head')) {
          facultyResults = context.faculty.filter(f => 
            f.designation.toLowerCase().includes('hod') || 
            f.designation.toLowerCase().includes('head')
          );
        } else if (facultyQuery.includes('professor') || facultyQuery.includes('prof')) {
          facultyResults = context.faculty.filter(f => 
            f.designation.toLowerCase().includes('professor')
          );
        } else if (facultyQuery.includes('assistant')) {
          facultyResults = context.faculty.filter(f => 
            f.designation.toLowerCase().includes('assistant')
          );
        } else {
          // Search by name or specialization
          facultyResults = context.faculty.filter(f => 
            f.name.toLowerCase().includes(facultyQuery) ||
            f.specialization.some(s => s.toLowerCase().includes(facultyQuery)) ||
            f.researchAreas.some(r => r.toLowerCase().includes(facultyQuery))
          );
        }
        
               if (facultyResults.length > 0) {
                 response = `**Faculty Members Found:**\n\n`;
                 facultyResults.slice(0, 3).forEach(faculty => {
                   response += `**${faculty.name}**\n`;
                   response += `• Designation: ${faculty.designation}\n`;
                   response += `• Email: ${faculty.email}\n`;
                   response += `• Phone: ${faculty.phone || 'Not specified'}\n`;
                   response += `• Office: ${faculty.office || 'Department of AIML'}\n`;
                   response += `• Specialization: ${faculty.specialization.join(', ')}\n`;
                   response += `• Research Areas: ${faculty.researchAreas.join(', ')}\n\n`;
                 });

                 suggestions = [
                   "Tell me about more faculty members",
                   "What are the research areas in the department?",
                   "Show me faculty by specialization"
                 ];
               } else {
                 response = `**Available Faculty Members:**\n\n`;
                 context.faculty.slice(0, 3).forEach(faculty => {
                   response += `• **${faculty.name}** - ${faculty.designation}\n`;
                 });

                 suggestions = [
                   "Show me all faculty members",
                   "Tell me about professors",
                   "What are the research areas?"
                 ];
               }
        break;
        
      case 'course_query':
      case 'semester_course_query':
        const courseQuery = lowerMessage;
        let courseResults = [];
        
        if (courseQuery.includes('semester')) {
          const semesterMatch = courseQuery.match(/(\d+)/);
          if (semesterMatch) {
            const semester = semesterMatch[1];
            courseResults = context.courses.filter(c => c.semester.includes(semester));
          }
        } else if (extractedInfo.semester) {
          const semester = extractedInfo.semester;
          courseResults = context.courses.filter(c => c.semester.includes(semester));
        } else if (courseQuery.includes('credit')) {
          const creditMatch = courseQuery.match(/(\d+)/);
          if (creditMatch) {
            const credits = parseInt(creditMatch[1]);
            courseResults = context.courses.filter(c => c.credits === credits);
          }
        } else {
          courseResults = context.courses.filter(c => 
            c.name.toLowerCase().includes(courseQuery) ||
            c.code.toLowerCase().includes(courseQuery) ||
            c.instructor.toLowerCase().includes(courseQuery)
          );
        }
        
               if (courseResults.length > 0) {
                 response = `**Courses Found:**\n\n`;
                 courseResults.slice(0, 3).forEach(course => {
                   response += `**${course.name} (${course.code})**\n`;
                   response += `• Semester: ${course.semester}\n`;
                   response += `• Credits: ${course.credits}\n`;
                   response += `• Instructor: ${course.instructor}\n`;
                   response += `• Course Type: ${course.courseType}\n`;
                   response += `• Contact Hours: ${course.contactHours}\n`;
                   response += `• Prerequisites: ${Array.isArray(course.prerequisites) ? course.prerequisites.join(', ') : course.prerequisites}\n\n`;
                 });

                 suggestions = [
                   "Show me courses by semester",
                   "Tell me about 5th semester courses",
                   "What are the core courses?"
                 ];
               } else {
                 response = `**Available Courses:**\n\n`;
                 context.courses.slice(0, 3).forEach(course => {
                   response += `• **${course.name}** (${course.code}) - Semester ${course.semester}\n`;
                 });

                 suggestions = [
                   "Show me all courses",
                   "Tell me about 5th semester courses",
                   "What are the core subjects?"
                 ];
               }
        break;
        
      case 'lab_query':
      case 'infrastructure_query':
        response = `**Department Location:**\n`;
        response += `• Building: PJ Block\n`;
        response += `• Floor: 7th Floor\n`;
        response += `• Description: All labs, classrooms, and faculty staff rooms are located here\n\n`;
        response += `**Department Labs:**\n\n`;
        context.infrastructure.labs.forEach(lab => {
          response += `**${lab.name}**\n`;
          response += `• Capacity: ${lab.capacity} students\n`;
          response += `• Location: ${lab.location}\n`;
          response += `• Equipment: ${lab.equipment.map(eq => `${eq.name} (${eq.quantity} units)`).join(', ')}\n`;
          response += `• Facilities: ${lab.facilities.join(', ')}\n`;
          response += `• Availability: ${lab.availability}\n`;
          response += `• Special Features: ${lab.specialFeatures.join(', ')}\n\n`;
        });

        suggestions = [
          "Tell me about specific lab equipment",
          "What are the lab timings?",
          "Show me research facilities"
        ];
        break;
        
      case 'calendar_query':
        const upcomingEvents = context.calendar.events
          .filter(event => new Date(event.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
          
        if (upcomingEvents.length > 0) {
          response = `**Upcoming Events:**\n\n`;
          upcomingEvents.slice(0, 3).forEach(event => {
            response += `**${event.title}**\n`;
            response += `• Date: ${event.date}\n`;
            response += `• Type: ${event.type}\n`;
            response += `• Description: ${event.description}\n\n`;
          });
        } else {
          response = `**Academic Calendar:**\n\n`;
          response += `• Total Events: ${context.calendar.events.length}\n`;
          response += `• Academic Year: ${context.calendar.academicYear}\n`;
          response += `• Current Semester: ${context.calendar.currentSemester}\n\n`;
        }

        suggestions = [
          "Show me all events this month",
          "Tell me about exam dates",
          "What are the important deadlines?"
        ];
        break;
        
      default:
        response = `I can help you with:

• Faculty information
• Course details
• Lab facilities  
• Academic calendar

What would you like to know?`;

        suggestions = [
          "Tell me about the faculty",
          "Show me available courses",
          "What labs do we have?"
        ];
    }
    
    return {
      response: response,
      suggestions: suggestions,
      intent: intent,
      extractedInfo: extractedInfo,
      source: 'intelligent_fallback'
    };
  }

  generateFallbackResponse(userMessage, intent, extractedInfo, sessionId) {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions = [];
    
    switch (intent) {
      case 'greeting':
        response = `**Hey there! I'm LIAM ✨ Your AI companion for the AIML Department at BMSCE!** 

I'm here to help you with everything about our amazing department! I have access to comprehensive data about:

• **19 faculty members** with their specializations and research areas
• **27 courses** across 6 semesters (3rd to 8th)
• **4 specialized labs** with cutting-edge equipment and facilities
• **Department information** including location, vision, and HOD details

What would you like to know about the Department of Artificial Intelligence and Machine Learning? 🚀`;
        suggestions = [
          'Where is the AIML department located?',
          'Tell me about the faculty members',
          'What courses are available in 5th semester?'
        ];
        break;
        
      case 'department_location':
        response = `The Department of Artificial Intelligence and Machine Learning is located on the 7th floor of the PG Block at B.M.S. College of Engineering, Basavanagudi, Bengaluru. You can reach us at hod.mel@bmsce.ac.in for any department-related queries.`;
        suggestions = [
          'What is the vision of the AIML department?',
          'Who is the Head of the Department?',
          'When was the department established?'
        ];
        break;
        
      case 'department_overview':
        response = `The Department of Artificial Intelligence and Machine Learning at BMSCE offers a four-year B.E. program specializing in AI and ML. Our department was established in 2020 under the Faculty of Engineering and Technology. Our vision is to produce globally competent engineers skilled in AI and ML who contribute to technology, innovation, and research for societal development.`;
        suggestions = [
          'Who is the Head of the Department?',
          'What courses are offered?',
          'Tell me about the faculty'
        ];
        break;
        
      case 'hod_information':
        response = `Dr. M. Dakshayini is the Professor and Head of the Department of Artificial Intelligence and Machine Learning. You can contact the department at hod.mel@bmsce.ac.in for any academic or administrative queries.`;
        suggestions = [
          'What is the department vision?',
          'Where is the department located?',
          'Tell me about the faculty members'
        ];
        break;
        
      case 'infrastructure_query':
        if (lowerMessage.includes('equipment') && lowerMessage.includes('ml lab 1')) {
          const mlLab1 = this.knowledgeBase.infrastructure.labs.find(lab => lab.name === 'Machine Learning Lab 1');
          if (mlLab1) {
            const equipmentList = mlLab1.equipment.map(eq => 
              `**${eq.name}**\n• Quantity: ${eq.quantity} units\n• Specifications: ${eq.specifications}\n• Condition: ${eq.condition}\n`).join('\n');
            response = `**Equipment in Machine Learning Lab 1:**

${equipmentList}

**Facilities Available:**
• ${mlLab1.facilities.join('\n• ')}

**Availability:** ${mlLab1.availability}`;
          } else {
            response = `Machine Learning Lab 1 is equipped with standard ML workstations, data visualization displays, and comprehensive ML software suite including TensorFlow, PyTorch, and Scikit-learn.`;
          }
        } else if (lowerMessage.includes('equipment') && lowerMessage.includes('lab')) {
          const labName = this.extractLabName(lowerMessage);
          const lab = this.knowledgeBase.infrastructure.labs.find(l => 
            l.name.toLowerCase().includes(labName.toLowerCase())
          );
          if (lab) {
            const equipmentList = lab.equipment.map(eq => 
              `**${eq.name}**\n• Quantity: ${eq.quantity} units\n• Specifications: ${eq.specifications}\n`).join('\n');
            response = `**Equipment in ${lab.name}:**

${equipmentList}

**Facilities:** ${lab.facilities.join(', ')}`;
          } else {
            response = `The department has 4 modern computer labs with advanced computing facilities for AI/ML research and development.`;
          }
        } else {
          const labs = this.knowledgeBase.infrastructure.labs;
          const labList = labs.map(lab => 
            `**${lab.name}**\n• Capacity: ${lab.capacity} students\n• Location: ${lab.location}\n• Equipment: ${lab.equipment.length} types\n`).join('\n');
          response = `**Available Labs:**

${labList}

**All labs are equipped with modern computing facilities and specialized software.**`;
        }
        suggestions = [
          'What equipment is available in ML Lab 1?',
          'Tell me about the B.S. Narayan Center',
          'What facilities are available?'
        ];
        break;
        
      case 'faculty_listing':
        const facultyList = this.knowledgeBase.faculty.slice(0, 5).map(f => 
          `**${f.name}**\n• Designation: ${f.designation}\n• Specialization: ${Array.isArray(f.specialization) ? f.specialization[0] : 'AI/ML'}\n• Email: ${f.email}\n`).join('\n');
        response = `**Faculty Members:**

${facultyList}

**Department Statistics:**
• Total Faculty: ${this.knowledgeBase.faculty.length} members
• Professors: ${this.knowledgeBase.faculty.filter(f => f.designation.includes('Professor')).length}
• Associate Professors: ${this.knowledgeBase.faculty.filter(f => f.designation.includes('Associate')).length}
• Assistant Professors: ${this.knowledgeBase.faculty.filter(f => f.designation.includes('Assistant')).length}

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
            `**${c.name}**\n• Code: ${c.code}\n• Semester: ${c.semester}\n• Credits: ${c.credits}\n• Instructor: ${c.instructor || 'TBA'}\n`).join('\n');
          response = `**Available Courses:**

${allCourses}

**Course Statistics:**
• Total Courses: ${this.knowledgeBase.courses.length} courses
• Semesters Covered: 3rd to 8th (6 semesters)
• Total Credits: ${this.knowledgeBase.courses.reduce((sum, c) => sum + c.credits, 0)} credits

For detailed course information, visit the Courses page.`;
        } else if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
          const mlCourses = this.knowledgeBase.courses.filter(c => 
            c.name.toLowerCase().includes('machine learning') || 
            c.name.toLowerCase().includes('ml')
          );
          if (mlCourses.length > 0) {
            const mlCourseList = mlCourses.map(c => 
              `**${c.name}**\n• Code: ${c.code}\n• Semester: ${c.semester}\n• Credits: ${c.credits}\n• Instructor: ${c.instructor || 'TBA'}\n`).join('\n');
            response = `**Machine Learning Courses:**

${mlCourseList}

**ML Course Highlights:**
• Foundation Courses: Mathematical foundations and statistics
• Core ML: Introduction to ML and advanced topics
• Practical Labs: Hands-on ML lab sessions
• Projects: Real-world ML project implementation`;
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
        
      case 'semester_course_query':
        const semester5Courses = this.knowledgeBase.courses.filter(c => c.semester.toLowerCase().includes('5th'));
        if (semester5Courses.length > 0) {
          const courseList = semester5Courses.map(c => 
            `**${c.name}**\n• Code: ${c.code}\n• Credits: ${c.credits}\n• Instructor: ${c.instructor || 'TBA'}\n• Type: ${c.courseType}\n`).join('\n');
          response = `**Semester V Courses:**

${courseList}

**Semester V Highlights:**
• Advanced Topics: Deep Learning, NLP, Computer Vision
• Practical Focus: Hands-on projects and labs
• Industry Relevance: Real-world applications
• Prerequisites: Strong foundation from previous semesters

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
        
      case 'contact_information':
        if (lowerMessage.includes('sandeep') && lowerMessage.includes('varma')) {
          const sandeep = this.knowledgeBase.faculty.find(f => f.name.toLowerCase().includes('sandeep'));
          if (sandeep) {
            response = `**Dr. Sandeep Varma N**

**Contact Information:**
• Designation: ${sandeep.designation}
• Email: ${sandeep.email}
• Phone: ${sandeep.phone || 'Available on request'}
• Office: ${sandeep.office || 'Department of AIML'}

**Specialization:**
• ${Array.isArray(sandeep.specialization) ? sandeep.specialization.join('\n• ') : 'Data Privacy, Machine Learning'}

You can reach out for academic guidance and research collaboration.`;
          } else {
            response = `**Dr. Sandeep Varma N**

**Contact Information:**
• Email: sandeep.mel@bmsce.ac.in
• Department: Artificial Intelligence and Machine Learning
• Specialization: Data Privacy, Machine Learning

Available for academic consultations and research guidance.`;
          }
        } else if (lowerMessage.includes('pallavi')) {
          const pallavi = this.knowledgeBase.faculty.find(f => f.name.toLowerCase().includes('pallavi'));
          if (pallavi) {
            response = `**Dr. Pallavi B**

**Contact Information:**
• Designation: ${pallavi.designation}
• Email: ${pallavi.email}
• Phone: ${pallavi.phone || 'Available on request'}
• Office: ${pallavi.office || 'Department of AIML'}

**Specialization:**
• ${Array.isArray(pallavi.specialization) ? pallavi.specialization.join('\n• ') : 'Machine Learning, Data Analytics'}

You can reach out for academic guidance and research collaboration.`;
          } else {
            response = `**Dr. Pallavi B**

**Contact Information:**
• Email: pallavib.mel@bmsce.ac.in
• Department: Artificial Intelligence and Machine Learning
• Specialization: Machine Learning, Data Analytics

Available for academic consultations and research guidance.`;
          }
        } else {
          response = `I can help you find faculty contact information. Which faculty member are you looking for?`;
        }
        suggestions = [
          'Show me all faculty members',
          'What are their specializations?',
          'Who is the HOD?'
        ];
        break;
        
      case 'career_guidance':
        const dataScienceCourses = this.knowledgeBase.courses.filter(c => 
          c.name.toLowerCase().includes('data') || 
          c.name.toLowerCase().includes('machine learning') ||
          c.name.toLowerCase().includes('analytics')
        );
        if (dataScienceCourses.length > 0) {
          const courseList = dataScienceCourses.slice(0, 5).map(c => 
            `**${c.name}**\n• Semester: ${c.semester}\n• Credits: ${c.credits}\n• Code: ${c.code}\n`).join('\n');
          response = `**Data Science Career Pathway:**

${courseList}

**Career Development Tips:**
• Foundation: Build strong mathematical and statistical skills
• Programming: Master Python, R, and SQL
• Projects: Work on real-world data science projects
• Networking: Connect with faculty and industry professionals

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
            const facultyList = computerVisionFaculty.map(f => 
              `**${f.name}**\n• Designation: ${f.designation}\n• Specialization: ${Array.isArray(f.specialization) ? f.specialization.join(', ') : 'Computer Vision'}\n• Email: ${f.email}\n`).join('\n');
            response = `**Computer Vision Faculty:**

${facultyList}

**Computer Vision Expertise:**
• Image Processing: Advanced algorithms and techniques
• Pattern Recognition: Machine learning applications
• Deep Learning: Neural networks for computer vision
• Research Areas: Cutting-edge CV research projects

Contact these faculty members for computer vision guidance and research opportunities.`;
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
        
      default:
        response = `I'm here to help you with information about the AIML Department at BMSCE. I can assist you with details about our faculty, courses, department location, facilities, academic calendar, and more. What specific information would you like to know?`;
        suggestions = [
          'Where is the AIML department located?',
          'Tell me about the faculty members',
          'What courses are available?'
        ];
    }
    
    return { response, suggestions, intent, extractedInfo };
  }

  analyzeUserIntent(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Prioritize specific queries first
    if (lowerMessage.includes('where') && (lowerMessage.includes('department') || lowerMessage.includes('located') || lowerMessage.includes('location'))) {
      return 'department_location';
    }
    if (lowerMessage.includes('what is aiml') || lowerMessage.includes('aiml department') || lowerMessage.includes('department overview') || lowerMessage.includes('vision') || lowerMessage.includes('established')) {
      return 'department_overview';
    }
    if (lowerMessage.includes('hod') || lowerMessage.includes('head of department') || lowerMessage.includes('who is the head')) {
      return 'hod_information';
    }
    if (lowerMessage.includes('semester') && (lowerMessage.includes('course') || lowerMessage.includes('5') || lowerMessage.includes('5th'))) {
      return 'semester_course_query';
    }
    if (lowerMessage.includes('equipment') && lowerMessage.includes('lab')) {
      return 'infrastructure_query';
    }
    if ((lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('syllabus')) && !lowerMessage.includes('lab')) {
      return 'course_query';
    }
    if (lowerMessage.includes('available') && lowerMessage.includes('course')) {
      return 'course_query';
    }
    if ((lowerMessage.includes(' lab') || lowerMessage.includes('lab ') || lowerMessage.includes('labs')) || (lowerMessage.includes('infrastructure') && !lowerMessage.includes('course')) || (lowerMessage.includes('facility') && !lowerMessage.includes('course'))) {
      return 'infrastructure_query';
    }
    if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
      return 'course_query';
    }
    if (lowerMessage.includes('teaches') || lowerMessage.includes('who teaches')) {
      return 'faculty_course_mapping';
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('contact') || lowerMessage.includes('sandeep') || lowerMessage.includes('pallavi')) {
      return 'contact_information';
    }
    if (lowerMessage.includes('career') || lowerMessage.includes('become')) {
      return 'career_guidance';
    }
    if (lowerMessage.includes('faculty') || lowerMessage.includes('professor') || lowerMessage.includes('teacher') || lowerMessage.includes('staff')) {
      return 'faculty_listing';
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
      specialization: null,
      labName: null
    };
    
    // Extract semester
    const semesterMatch = lowerMessage.match(/(\d+)(?:st|nd|rd|th)?\s*semester/);
    if (semesterMatch) {
      extracted.semester = semesterMatch[1];
    }
    
    // Extract faculty name
    const facultyNames = this.knowledgeBase.faculty.map(f => f.name.toLowerCase());
    for (const name of facultyNames) {
      if (lowerMessage.includes(name)) {
        extracted.facultyName = name;
        break;
      }
    }
    
    // Extract course name
    const courseNames = this.knowledgeBase.courses.map(c => c.name.toLowerCase());
    for (const name of courseNames) {
      if (lowerMessage.includes(name)) {
        extracted.courseName = name;
        break;
      }
    }
    
    // Extract lab name
    const labNames = this.knowledgeBase.infrastructure.labs.map(l => l.name.toLowerCase());
    for (const name of labNames) {
      if (lowerMessage.includes(name)) {
        extracted.labName = name;
        break;
      }
    }
    
    return extracted;
  }

  extractLabName(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('ml lab 1') || lowerMessage.includes('machine learning lab 1')) {
      return 'Machine Learning Lab 1';
    }
    if (lowerMessage.includes('ml lab 2') || lowerMessage.includes('machine learning lab 2')) {
      return 'Machine Learning Lab 2';
    }
    if (lowerMessage.includes('ml lab 3') || lowerMessage.includes('machine learning lab 3')) {
      return 'Machine Learning Lab 3';
    }
    if (lowerMessage.includes('b.s. narayan') || lowerMessage.includes('center of excellence')) {
      return 'B.S. Narayan Center of Excellence in AI & ML';
    }
    return 'lab';
  }

  createComprehensiveContext() {
    return {
      faculty: this.knowledgeBase.faculty,
      courses: this.knowledgeBase.courses,
      infrastructure: this.knowledgeBase.infrastructure,
      calendar: this.knowledgeBase.calendar
    };
  }

  updateConversationHistory(sessionId, userMessage, aiResponse) {
    const conversationHistory = this.conversationHistory.get(sessionId) || [];
    conversationHistory.push({ role: 'user', content: userMessage });
    conversationHistory.push({ role: 'assistant', content: aiResponse });
    
    // Keep only last 10 messages
    if (conversationHistory.length > 10) {
      conversationHistory.splice(0, conversationHistory.length - 10);
    }
    
    this.conversationHistory.set(sessionId, conversationHistory);
  }

  saveFacultyData() {
    try {
      const facultyPath = path.join(__dirname, 'data/comprehensive_faculty.json');
      fs.writeFileSync(facultyPath, JSON.stringify(this.knowledgeBase.faculty, null, 2));
      console.log('✅ Faculty data saved successfully');
    } catch (error) {
      console.error('❌ Error saving faculty data:', error);
    }
  }

  saveCoursesData() {
    try {
      const coursesPath = path.join(__dirname, 'data/comprehensive_courses.json');
      fs.writeFileSync(coursesPath, JSON.stringify(this.knowledgeBase.courses, null, 2));
      console.log('✅ Courses data saved successfully');
    } catch (error) {
      console.error('❌ Error saving courses data:', error);
    }
  }

  startServer() {
    this.app.listen(this.port, () => {
      console.log(`🚀 AIML AI Agent running on port ${this.port}`);
      console.log(`📊 Serving ${this.knowledgeBase.faculty.length} faculty members`);
      console.log(`📚 Serving ${this.knowledgeBase.courses.length} courses`);
      console.log(`🏢 Serving infrastructure data`);
      console.log(`📅 Serving calendar data`);
      console.log(`🤖 AIML AI Agent ready for intelligent conversations!`);
    });
  }
}

// Start the server
new AIMLAgent();
