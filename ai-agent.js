const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');
const stringSimilarity = require('string-similarity');
const natural = require('natural');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Load comprehensive data
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_faculty.json'), 'utf8'));
const courseData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_courses.json'), 'utf8'));
const calendarData = [JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_academic_calendar.json'), 'utf8'))];
const infrastructureData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_infrastructure.json'), 'utf8'));

// Advanced AI Agent Class
class AdvancedAIAgent {
  constructor() {
    this.knowledgeBase = this.buildComprehensiveKnowledgeBase();
    this.fuzzySearch = this.initializeFuzzySearch();
    this.abbreviations = this.buildAbbreviationMap();
    this.conversationContext = [];
    this.initializeNaturalLanguageProcessing();
  }

  // Build comprehensive knowledge base from all data
  buildComprehensiveKnowledgeBase() {
    const knowledgeBase = {
      faculty: {
        data: facultyData,
        searchableText: this.createSearchableFacultyText(),
        specializations: this.extractFacultySpecializations(),
        researchAreas: this.extractFacultyResearchAreas(),
        contacts: this.extractFacultyContacts()
      },
      courses: {
        data: courseData,
        searchableText: this.createSearchableCourseText(),
        semesters: this.extractCourseSemesters(),
        instructors: this.extractCourseInstructors(),
        topics: this.extractCourseTopics()
      },
      infrastructure: {
        data: infrastructureData,
        searchableText: this.createSearchableInfrastructureText(),
        labs: this.extractLabInformation(),
        equipment: this.extractEquipmentInformation()
      },
      calendar: {
        data: calendarData[0],
        searchableText: this.createSearchableCalendarText(),
        events: this.extractCalendarEvents(),
        semesters: this.extractCalendarSemesters()
      }
    };
    
    console.log('🧠 Comprehensive Knowledge Base Built:');
    console.log(`   📊 Faculty: ${knowledgeBase.faculty.data.length} members`);
    console.log(`   📚 Courses: ${knowledgeBase.courses.data.length} courses`);
    console.log(`   🏢 Infrastructure: ${Object.keys(knowledgeBase.infrastructure.labs).length} labs`);
    console.log(`   📅 Calendar: ${knowledgeBase.calendar.events.length} events`);
    
    return knowledgeBase;
  }

  // Create searchable text for faculty
  createSearchableFacultyText() {
    return facultyData.map(faculty => ({
      id: faculty.id,
      name: faculty.name,
      designation: faculty.designation,
      specialization: Array.isArray(faculty.specialization) ? faculty.specialization.join(' ') : faculty.specialization || '',
      researchAreas: Array.isArray(faculty.researchAreas) ? faculty.researchAreas.join(' ') : faculty.researchAreas || '',
      email: faculty.email,
      phone: faculty.phone,
      searchText: `${faculty.name} ${faculty.designation} ${faculty.specialization || ''} ${faculty.researchAreas || ''} ${faculty.email || ''}`.toLowerCase()
    }));
  }

  // Create searchable text for courses
  createSearchableCourseText() {
    return courseData.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      semester: course.semester,
      instructor: course.instructor,
      topics: Array.isArray(course.topics) ? course.topics.join(' ') : course.topics || '',
      prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(' ') : course.prerequisites || '',
      searchText: `${course.name} ${course.code} ${course.semester} ${course.instructor} ${course.topics || ''} ${course.prerequisites || ''}`.toLowerCase()
    }));
  }

  // Create searchable text for infrastructure
  createSearchableInfrastructureText() {
    const infra = infrastructureData;
    let searchText = '';
    
    if (infra.labs) {
      Object.values(infra.labs).forEach(lab => {
        searchText += `${lab.name} ${lab.capacity} ${lab.description || ''} `;
        if (lab.equipment) {
          lab.equipment.forEach(eq => {
            searchText += `${eq.name || eq} ${eq.quantity || ''} `;
          });
        }
      });
    }
    
    return searchText.toLowerCase();
  }

  // Create searchable text for calendar
  createSearchableCalendarText() {
    const calendar = calendarData[0];
    let searchText = '';
    
    if (calendar.events) {
      calendar.events.forEach(event => {
        searchText += `${event.name} ${event.type} ${event.date} ${event.description || ''} `;
      });
    }
    
    return searchText.toLowerCase();
  }

  // Extract faculty specializations
  extractFacultySpecializations() {
    const specializations = new Set();
    facultyData.forEach(faculty => {
      if (faculty.specialization && Array.isArray(faculty.specialization)) {
        faculty.specialization.forEach(spec => specializations.add(spec.toLowerCase()));
      }
    });
    return Array.from(specializations);
  }

  // Extract faculty research areas
  extractFacultyResearchAreas() {
    const researchAreas = new Set();
    facultyData.forEach(faculty => {
      if (faculty.researchAreas && Array.isArray(faculty.researchAreas)) {
        faculty.researchAreas.forEach(area => researchAreas.add(area.toLowerCase()));
      }
    });
    return Array.from(researchAreas);
  }

  // Extract faculty contacts
  extractFacultyContacts() {
    return facultyData.map(faculty => ({
      name: faculty.name,
      email: faculty.email,
      phone: faculty.phone
    }));
  }

  // Extract course semesters
  extractCourseSemesters() {
    const semesters = new Set();
    courseData.forEach(course => {
      if (course.semester) {
        semesters.add(course.semester.toString());
      }
    });
    return Array.from(semesters);
  }

  // Extract course instructors
  extractCourseInstructors() {
    const instructors = new Set();
    courseData.forEach(course => {
      if (course.instructor) {
        instructors.add(course.instructor);
      }
    });
    return Array.from(instructors);
  }

  // Extract course topics
  extractCourseTopics() {
    const topics = new Set();
    courseData.forEach(course => {
      if (course.topics && Array.isArray(course.topics)) {
        course.topics.forEach(topic => topics.add(topic.toLowerCase()));
      }
    });
    return Array.from(topics);
  }

  // Extract lab information
  extractLabInformation() {
    const infra = infrastructureData;
    return infra.labs || {};
  }

  // Extract equipment information
  extractEquipmentInformation() {
    const infra = infrastructureData;
    const equipment = [];
    
    if (infra.labs) {
      Object.values(infra.labs).forEach(lab => {
        if (lab.equipment && Array.isArray(lab.equipment)) {
          lab.equipment.forEach(eq => {
            equipment.push({
              name: eq.name || eq,
              quantity: eq.quantity,
              condition: eq.condition,
              lab: lab.name
            });
          });
        }
      });
    }
    
    return equipment;
  }

  // Extract calendar events
  extractCalendarEvents() {
    const calendar = calendarData[0];
    return calendar.events || [];
  }

  // Extract calendar semesters
  extractCalendarSemesters() {
    const calendar = calendarData[0];
    const semesters = new Set();
    
    if (calendar.events) {
      calendar.events.forEach(event => {
        if (event.semester) {
          semesters.add(event.semester);
        }
      });
    }
    
    return Array.from(semesters);
  }

  // Initialize fuzzy search
  initializeFuzzySearch() {
    const allSearchableData = [
      ...this.knowledgeBase.faculty.searchableText,
      ...this.knowledgeBase.courses.searchableText,
      { searchText: this.knowledgeBase.infrastructure.searchableText },
      { searchText: this.knowledgeBase.calendar.searchableText }
    ];

    return new Fuse(allSearchableData, {
      keys: ['searchText', 'name', 'specialization', 'researchAreas', 'topics'],
      threshold: 0.3,
      includeScore: true
    });
  }

  // Build abbreviation map
  buildAbbreviationMap() {
    return {
      'ml': 'machine learning',
      'ai': 'artificial intelligence',
      'dl': 'deep learning',
      'nlp': 'natural language processing',
      'cv': 'computer vision',
      'ds': 'data science',
      'da': 'data analytics',
      'dm': 'data mining',
      'bmsce': 'b.m.s. college of engineering',
      'aiml': 'artificial intelligence and machine learning',
      'prof': 'professor',
      'dr': 'doctor',
      'asst': 'assistant',
      'assoc': 'associate',
      'sem': 'semester',
      'lab': 'laboratory',
      'dept': 'department',
      'fac': 'faculty',
      'stud': 'student',
      'res': 'research',
      'proj': 'project',
      'hw': 'hardware',
      'sw': 'software',
      'gpu': 'graphics processing unit',
      'cpu': 'central processing unit',
      'ram': 'random access memory',
      'ssd': 'solid state drive',
      'hdd': 'hard disk drive'
    };
  }

  // Initialize natural language processing
  initializeNaturalLanguageProcessing() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  // Expand abbreviations in text
  expandAbbreviations(text) {
    let expandedText = text.toLowerCase();
    
    Object.entries(this.abbreviations).forEach(([abbr, full]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      expandedText = expandedText.replace(regex, full);
    });
    
    return expandedText;
  }

  // Advanced question analysis
  analyzeQuestion(question) {
    const expandedQuestion = this.expandAbbreviations(question);
    const tokens = this.tokenizer.tokenize(expandedQuestion);
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
    
    // Intent detection
    const intent = this.detectIntent(expandedQuestion, tokens);
    
    // Entity extraction
    const entities = this.extractEntities(expandedQuestion, tokens);
    
    // Context analysis
    const context = this.analyzeContext(expandedQuestion);
    
    return {
      original: question,
      expanded: expandedQuestion,
      tokens,
      stemmedTokens,
      intent,
      entities,
      context,
      confidence: this.calculateConfidence(intent, entities, context)
    };
  }

  // Detect user intent
  detectIntent(question, tokens) {
    const questionLower = question.toLowerCase();
    
    // Greeting patterns - more conversational
    if (this.matchesPattern(questionLower, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'what can you do', 'help me', 'start'])) {
      return 'greeting';
    }
    
    // Faculty-related intents - more conversational
    if (this.matchesPattern(questionLower, ['who teaches', 'who is', 'faculty', 'professor', 'instructor', 'teacher', 'dr.', 'dr ', 'sir', 'ma\'am', 'mentor', 'guide', 'staff'])) {
      return 'faculty_search';
    }
    
    // Course-related intents - more conversational
    if (this.matchesPattern(questionLower, ['course', 'subject', 'syllabus', 'curriculum', 'semester', 'credit', 'study', 'learn', 'class', 'lecture', 'module'])) {
      return 'course_search';
    }
    
    // Infrastructure-related intents - more conversational (check this first)
    if (this.matchesPattern(questionLower, ['lab', 'laboratory', 'equipment', 'infrastructure', 'facility', 'computer', 'hardware', 'available', 'what\'s in', 'what is in', 'machines', 'tools', 'setup', 'software', 'ml lab', 'machine learning lab', 'lab 1', 'lab 2', 'center of excellence'])) {
      return 'infrastructure_search';
    }
    
    // Calendar-related intents - more conversational
    if (this.matchesPattern(questionLower, ['calendar', 'schedule', 'event', 'exam', 'holiday', 'date', 'time', 'timing', 'upcoming', 'deadline'])) {
      return 'calendar_search';
    }
    
    // General information (check this last to avoid conflicts)
    if (this.matchesPattern(questionLower, ['what is', 'tell me about', 'explain', 'information', 'about']) && 
        !this.matchesPattern(questionLower, ['lab', 'equipment', 'facility', 'infrastructure'])) {
      return 'general_info';
    }
    
    return 'general_query';
  }

  // Check if question matches any patterns
  matchesPattern(text, patterns) {
    return patterns.some(pattern => text.includes(pattern));
  }

  // Extract entities from question
  extractEntities(question, tokens) {
    const entities = {
      faculty: [],
      courses: [],
      specializations: [],
      researchAreas: [],
      semesters: [],
      equipment: [],
      locations: []
    };
    
    // Extract faculty names
    this.knowledgeBase.faculty.data.forEach(faculty => {
      if (question.toLowerCase().includes(faculty.name.toLowerCase())) {
        entities.faculty.push(faculty.name);
      }
    });
    
    // Extract course names
    this.knowledgeBase.courses.data.forEach(course => {
      if (question.toLowerCase().includes(course.name.toLowerCase()) || 
          question.toLowerCase().includes(course.code.toLowerCase())) {
        entities.courses.push(course.name);
      }
    });
    
    // Extract specializations
    this.knowledgeBase.faculty.specializations.forEach(spec => {
      if (question.toLowerCase().includes(spec)) {
        entities.specializations.push(spec);
      }
    });
    
    // Extract research areas
    this.knowledgeBase.faculty.researchAreas.forEach(area => {
      if (question.toLowerCase().includes(area)) {
        entities.researchAreas.push(area);
      }
    });
    
    // Extract semesters
    this.knowledgeBase.courses.semesters.forEach(sem => {
      if (question.toLowerCase().includes(sem)) {
        entities.semesters.push(sem);
      }
    });
    
    return entities;
  }

  // Analyze context
  analyzeContext(question) {
    const context = {
      isQuestion: question.includes('?'),
      isGreeting: this.matchesPattern(question, ['hello', 'hi', 'hey']),
      isFarewell: this.matchesPattern(question, ['bye', 'goodbye', 'see you']),
      urgency: this.matchesPattern(question, ['urgent', 'asap', 'quickly', 'immediately']) ? 'high' : 'normal',
      politeness: this.matchesPattern(question, ['please', 'thank you', 'thanks', 'could you', 'would you']) ? 'polite' : 'neutral'
    };
    
    return context;
  }

  // Calculate confidence score
  calculateConfidence(intent, entities, context) {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on intent clarity
    if (intent !== 'general_query') confidence += 0.2;
    
    // Increase confidence based on entities found
    const entityCount = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
    confidence += Math.min(entityCount * 0.1, 0.3);
    
    // Increase confidence for clear questions
    if (context.isQuestion) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  // Generate intelligent response
  async generateResponse(question) {
    try {
      const analysis = this.analyzeQuestion(question);
      
      // Add to conversation context
      this.conversationContext.push({
        question: question,
        analysis: analysis,
        timestamp: new Date()
      });
      
      // Keep only last 5 conversations
      if (this.conversationContext.length > 5) {
        this.conversationContext = this.conversationContext.slice(-5);
      }
      
      // Get relevant data based on intent
      const relevantData = this.getRelevantData(analysis);
      
      // Generate response using Llama LLM
      const response = await this.generateLLMResponse(question, relevantData, analysis);
      
      return {
        response: response,
        sources: this.getSources(relevantData),
        confidence: analysis.confidence,
        intent: analysis.intent,
        entities: analysis.entities
      };
      
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Please try rephrasing your question or ask about faculty, courses, infrastructure, or academic calendar.",
        sources: [],
        confidence: 0.1,
        intent: 'error',
        entities: {}
      };
    }
  }

  // Get relevant data based on analysis
  getRelevantData(analysis) {
    const data = {
      faculty: [],
      courses: [],
      infrastructure: {},
      calendar: {},
      context: analysis.context
    };
    
    switch (analysis.intent) {
      case 'faculty_search':
        data.faculty = this.searchFaculty(analysis);
        break;
      case 'course_search':
        data.courses = this.searchCourses(analysis);
        break;
      case 'infrastructure_search':
        data.infrastructure = this.searchInfrastructure(analysis);
        break;
      case 'calendar_search':
        data.calendar = this.searchCalendar(analysis);
        break;
      case 'general_info':
        data.faculty = this.knowledgeBase.faculty.data.slice(0, 5);
        data.courses = this.knowledgeBase.courses.data.slice(0, 5);
        data.infrastructure = this.knowledgeBase.infrastructure.labs;
        break;
      default:
        // Return sample data for general queries
        data.faculty = this.knowledgeBase.faculty.data.slice(0, 3);
        data.courses = this.knowledgeBase.courses.data.slice(0, 3);
    }
    
    return data;
  }

  // Search faculty based on analysis
  searchFaculty(analysis) {
    let results = [];
    
    // Direct name match
    if (analysis.entities.faculty.length > 0) {
      results = this.knowledgeBase.faculty.data.filter(faculty => 
        analysis.entities.faculty.some(name => 
          faculty.name.toLowerCase().includes(name.toLowerCase())
        )
      );
    }
    
    // Specialization match
    if (analysis.entities.specializations.length > 0) {
      const specResults = this.knowledgeBase.faculty.data.filter(faculty => 
        faculty.specialization && Array.isArray(faculty.specialization) &&
        faculty.specialization.some(spec => 
          analysis.entities.specializations.some(entity => 
            spec.toLowerCase().includes(entity)
          )
        )
      );
      results = [...results, ...specResults];
    }
    
    // Research area match
    if (analysis.entities.researchAreas.length > 0) {
      const researchResults = this.knowledgeBase.faculty.data.filter(faculty => 
        faculty.researchAreas && Array.isArray(faculty.researchAreas) &&
        faculty.researchAreas.some(area => 
          analysis.entities.researchAreas.some(entity => 
            area.toLowerCase().includes(entity)
          )
        )
      );
      results = [...results, ...researchResults];
    }
    
    // Fuzzy search if no direct matches
    if (results.length === 0) {
      const fuzzyResults = this.fuzzySearch.search(analysis.expanded);
      results = fuzzyResults.slice(0, 5).map(result => result.item);
    }
    
    // Remove duplicates
    const uniqueResults = results.filter((faculty, index, self) => 
      index === self.findIndex(f => f.id === faculty.id)
    );
    
    return uniqueResults.slice(0, 10);
  }

  // Search courses based on analysis
  searchCourses(analysis) {
    let results = [];
    
    // Direct course name match
    if (analysis.entities.courses.length > 0) {
      results = this.knowledgeBase.courses.data.filter(course => 
        analysis.entities.courses.some(name => 
          course.name.toLowerCase().includes(name.toLowerCase()) ||
          course.code.toLowerCase().includes(name.toLowerCase())
        )
      );
    }
    
    // Semester match
    if (analysis.entities.semesters.length > 0) {
      const semResults = this.knowledgeBase.courses.data.filter(course => 
        analysis.entities.semesters.some(sem => 
          course.semester.toString() === sem
        )
      );
      results = [...results, ...semResults];
    }
    
    // Fuzzy search if no direct matches
    if (results.length === 0) {
      const fuzzyResults = this.fuzzySearch.search(analysis.expanded);
      results = fuzzyResults.slice(0, 5).map(result => result.item);
    }
    
    // Remove duplicates
    const uniqueResults = results.filter((course, index, self) => 
      index === self.findIndex(c => c.id === course.id)
    );
    
    return uniqueResults.slice(0, 10);
  }

  // Search infrastructure based on analysis
  searchInfrastructure(analysis) {
    const infra = this.knowledgeBase.infrastructure.data;
    const results = {};
    
    if (infra.labs) {
      Object.entries(infra.labs).forEach(([key, lab]) => {
        // Check for various infrastructure-related terms
        const searchTerms = ['lab', 'laboratory', 'equipment', 'facility', 'infrastructure', 'computer', 'hardware', 'ml lab', 'machine learning lab'];
        const hasMatch = searchTerms.some(term => analysis.expanded.includes(term));
        
        if (hasMatch) {
          results[key] = lab;
        }
      });
    }
    
    // If no specific matches, return all labs for general infrastructure queries
    if (Object.keys(results).length === 0 && infra.labs) {
      return infra.labs;
    }
    
    return results;
  }

  // Search calendar based on analysis
  searchCalendar(analysis) {
    const calendar = this.knowledgeBase.calendar.data;
    const results = {
      events: [],
      semesters: []
    };
    
    if (calendar.events) {
      results.events = calendar.events.filter(event => 
        analysis.expanded.includes(event.name.toLowerCase()) ||
        analysis.expanded.includes(event.type.toLowerCase())
      );
    }
    
    return results;
  }

  // Generate LLM response
  async generateLLMResponse(question, data, analysis) {
    const prompt = this.buildAdvancedPrompt(question, data, analysis);
    
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama3:latest',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 300 // Reduced tokens for faster response
          }
        })
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Llama API error: ${response.status}`);
      }

      const result = await response.json();
      return result.response || this.generateFallbackResponse(question, data, analysis);
      
    } catch (error) {
      console.log('Llama not available, using fallback');
      return this.generateFallbackResponse(question, data, analysis);
    }
  }

  // Build advanced prompt for Llama
  buildAdvancedPrompt(question, data, analysis) {
    let context = "";
    let systemPrompt = `You are Liam, an AI assistant for the AIML department at B.M.S. College of Engineering. You're friendly, conversational, and helpful - like talking to a knowledgeable friend who works at the college.

IMPORTANT RESPONSE STYLE:
- Be conversational and natural, not robotic
- Use bullet points (•) for lists instead of paragraphs
- Keep responses concise but informative
- Ask follow-up questions to engage the user
- Use emojis sparingly but appropriately
- Sound like you're having a real conversation

RESPONSE FORMAT:
- Start with a friendly acknowledgment
- Present information in clear bullet points
- End with a helpful follow-up question or offer
- Keep it under 150 words unless detailed info is needed`;

    // Add conversation context
    if (this.conversationContext.length > 1) {
      context += "Recent conversation:\n";
      this.conversationContext.slice(-2).forEach(conv => {
        context += `User: ${conv.question}\n`;
      });
      context += "\n";
    }
    
    // Add relevant data based on intent
    switch (analysis.intent) {
      case 'faculty_search':
        if (data.faculty.length > 0) {
          context += "Available faculty:\n";
          data.faculty.slice(0, 5).forEach(faculty => {
            context += `• ${faculty.name} (${faculty.designation})\n`;
            context += `  - Specializes in: ${Array.isArray(faculty.specialization) ? faculty.specialization.slice(0, 3).join(', ') : faculty.specialization || 'General'}\n`;
            context += `  - Email: ${faculty.email || 'Contact department'}\n\n`;
          });
        }
        break;
        
      case 'course_search':
        if (data.courses.length > 0) {
          context += "Available courses:\n";
          data.courses.slice(0, 5).forEach(course => {
            context += `• ${course.name} (${course.code})\n`;
            context += `  - Semester: ${course.semester}\n`;
            context += `  - Instructor: ${course.instructor || 'TBA'}\n\n`;
          });
        }
        break;
        
      case 'infrastructure_search':
        if (Object.keys(data.infrastructure).length > 0) {
          context += "Available facilities:\n";
          Object.entries(data.infrastructure).forEach(([key, lab]) => {
            context += `• ${lab.name}\n`;
            context += `  - Capacity: ${lab.capacity} students\n`;
            if (lab.equipment && lab.equipment.length > 0) {
              context += `  - Equipment: ${lab.equipment.slice(0, 3).join(', ')}\n`;
            }
            context += "\n";
          });
        }
        break;
        
      case 'calendar_search':
        if (data.calendar.events && data.calendar.events.length > 0) {
          context += "Upcoming events:\n";
          data.calendar.events.slice(0, 3).forEach(event => {
            context += `• ${event.name} - ${event.date}\n`;
          });
        }
        break;
        
      case 'greeting':
        context += "User is greeting you. Be warm and enthusiastic. Offer specific help with department info.\n";
        break;
        
      default:
        context += "User needs general help. Offer specific assistance with faculty, courses, or facilities.\n";
    }
    
    return `${systemPrompt}\n\n${context}\n\nUser: ${question}\n\nLiam:`;
  }

  // Generate fallback response
  generateFallbackResponse(question, data, analysis) {
    const lowerQuestion = question.toLowerCase();
    
    switch (analysis.intent) {
      case 'faculty_search':
        if (data.faculty.length > 0) {
          const facultyList = data.faculty.slice(0, 4).map(f => 
            `• ${f.name} (${f.designation})\n  - Specializes in: ${Array.isArray(f.specialization) ? f.specialization.slice(0, 2).join(', ') : f.specialization || 'General'}\n  - Email: ${f.email || 'Contact department'}`
          ).join('\n\n');
          
          return `Great! I found some faculty members for you:\n\n${facultyList}\n\nWant to know more about any specific professor? Just ask! 😊`;
        }
        return "Hmm, I couldn't find faculty matching that. Try asking about specific specializations like 'machine learning faculty' or 'AI professors' - I'll help you find the right person! 🤔";
        
      case 'course_search':
        if (data.courses.length > 0) {
          const courseList = data.courses.slice(0, 4).map(c => 
            `• ${c.name} (${c.code})\n  - Semester: ${c.semester}\n  - Instructor: ${c.instructor || 'TBA'}`
          ).join('\n\n');
          
          return `Here are the courses I found:\n\n${courseList}\n\nNeed details about any specific course? I can tell you about topics, prerequisites, or more! 📚`;
        }
        return "I couldn't find courses matching that. Try asking about specific semesters like 'semester 5 courses' or course names like 'machine learning' - I'll help you out! 🎓";
        
      case 'infrastructure_search':
        if (Object.keys(data.infrastructure).length > 0) {
          // Check if user is asking about a specific lab
          const lowerQuestion = question.toLowerCase();
          if (lowerQuestion.includes('ml lab 1') || lowerQuestion.includes('machine learning lab 1')) {
            const mlLab1 = Object.values(data.infrastructure).find(lab => lab.name === 'Machine Learning Lab 1');
            if (mlLab1) {
              const equipmentList = mlLab1.equipment.map(eq => 
                `• ${eq.name} (${eq.quantity} units)\n  - Specs: ${eq.specifications}`
              ).join('\n\n');
              
              return `Perfect! Here's what's available in Machine Learning Lab 1:\n\n${equipmentList}\n\nNeed more details about any specific equipment? Just ask! 🔬`;
            }
          }
          
          const labList = Object.values(data.infrastructure).slice(0, 3).map(lab => {
            let response = `• ${lab.name}\n  - Capacity: ${lab.capacity} students`;
            if (lab.equipment && lab.equipment.length > 0) {
              const equipmentNames = lab.equipment.slice(0, 3).map(eq => eq.name || eq).join(', ');
              response += `\n  - Equipment: ${equipmentNames}`;
            }
            return response;
          }).join('\n\n');
          
          return `Here's what we have available:\n\n${labList}\n\nWant to know more about any specific lab or equipment? Just ask! 🔬`;
        }
        return "I couldn't find specific facilities matching that. Try asking about 'labs', 'computer facilities', or 'research equipment' - I'll show you what's available! 🏢";
        
      case 'greeting':
        return "Hey there! 👋 I'm Liam, your AI assistant for the AIML department at BMSCE. I can help you with:\n\n• Faculty information\n• Course details\n• Lab facilities\n• Academic calendar\n\nWhat would you like to explore today?";
        
      default:
        if (lowerQuestion.includes('equipment') || lowerQuestion.includes('lab')) {
          return "Looking for lab equipment? I can help you find what's available in our facilities! Try asking about specific labs like 'ML Lab 1 equipment' or 'computer lab facilities' 🔧";
        }
        if (lowerQuestion.includes('course') || lowerQuestion.includes('subject')) {
          return "Interested in courses? I can show you what's available! Try asking about specific semesters or subjects like 'semester 6 courses' or 'AI subjects' 📖";
        }
        if (lowerQuestion.includes('professor') || lowerQuestion.includes('teacher')) {
          return "Looking for faculty info? I can help you find professors by specialization! Try asking about 'machine learning professors' or 'AI faculty' 👨‍🏫";
        }
        return "I'm here to help! 😊 Try asking about:\n\n• Faculty members\n• Courses by semester\n• Lab facilities\n• Equipment available\n\nWhat interests you most?";
    }
  }

  // Get sources for response
  getSources(data) {
    const sources = [];
    
    if (data.faculty.length > 0) sources.push('Faculty Directory');
    if (data.courses.length > 0) sources.push('Course Catalog');
    if (Object.keys(data.infrastructure).length > 0) sources.push('Infrastructure Guide');
    if (data.calendar.events && data.calendar.events.length > 0) sources.push('Academic Calendar');
    
    return sources;
  }
}

// Initialize AI Agent
const aiAgent = new AdvancedAIAgent();

// API Routes
app.get('/api/faculty', (req, res) => {
  res.json({
    success: true,
    count: facultyData.length,
    data: facultyData
  });
});

app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    count: courseData.length,
    data: courseData
  });
});

app.get('/api/infrastructure', (req, res) => {
  res.json({
    success: true,
    data: infrastructureData
  });
});

app.get('/api/calendar', (req, res) => {
  res.json({
    success: true,
    data: calendarData
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.json({
      success: false,
      error: 'Please provide a message'
    });
  }
  
  try {
    const response = await aiAgent.generateResponse(message.trim());
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.json({
      success: false,
      error: 'Sorry, I encountered an error processing your request. Please try again.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Advanced AI Agent running on port ${PORT}`);
  console.log(`📊 Serving ${facultyData.length} faculty members`);
  console.log(`📚 Serving ${courseData.length} courses`);
  console.log(`🏢 Serving infrastructure data`);
  console.log(`📅 Serving calendar data`);
  console.log(`🤖 AI Agent trained and ready for intelligent conversations!`);
});