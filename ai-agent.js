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
const infrastructureData = [JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_infrastructure.json'), 'utf8'))];

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
        data: infrastructureData[0],
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
    const infra = infrastructureData[0];
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
    const infra = infrastructureData[0];
    return infra.labs || {};
  }

  // Extract equipment information
  extractEquipmentInformation() {
    const infra = infrastructureData[0];
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
    
    // Faculty-related intents
    if (this.matchesPattern(questionLower, ['who teaches', 'who is', 'faculty', 'professor', 'instructor', 'teacher'])) {
      return 'faculty_search';
    }
    
    // Course-related intents
    if (this.matchesPattern(questionLower, ['course', 'subject', 'syllabus', 'curriculum', 'semester', 'credit'])) {
      return 'course_search';
    }
    
    // Infrastructure-related intents
    if (this.matchesPattern(questionLower, ['lab', 'laboratory', 'equipment', 'infrastructure', 'facility', 'computer', 'hardware'])) {
      return 'infrastructure_search';
    }
    
    // Calendar-related intents
    if (this.matchesPattern(questionLower, ['calendar', 'schedule', 'event', 'exam', 'holiday', 'date', 'time'])) {
      return 'calendar_search';
    }
    
    // General information
    if (this.matchesPattern(questionLower, ['what is', 'tell me about', 'explain', 'information', 'about'])) {
      return 'general_info';
    }
    
    // Greeting
    if (this.matchesPattern(questionLower, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
      return 'greeting';
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
        if (analysis.expanded.includes('lab') || analysis.expanded.includes('laboratory')) {
          results[key] = lab;
        }
      });
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
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3:latest',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      });

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
    let systemPrompt = "You are an intelligent AI assistant for the AIML (Artificial Intelligence and Machine Learning) department at B.M.S. College of Engineering. You have comprehensive knowledge about faculty, courses, infrastructure, and academic calendar. Provide helpful, accurate, and conversational responses.";
    
    // Add conversation context
    if (this.conversationContext.length > 1) {
      context += "Previous conversation context:\n";
      this.conversationContext.slice(-3).forEach(conv => {
        context += `Q: ${conv.question}\n`;
      });
      context += "\n";
    }
    
    // Add relevant data based on intent
    switch (analysis.intent) {
      case 'faculty_search':
        if (data.faculty.length > 0) {
          context += "Faculty Information:\n";
          data.faculty.forEach(faculty => {
            context += `- ${faculty.name} (${faculty.designation})\n`;
            context += `  Specialization: ${Array.isArray(faculty.specialization) ? faculty.specialization.join(', ') : faculty.specialization || 'N/A'}\n`;
            context += `  Research Areas: ${Array.isArray(faculty.researchAreas) ? faculty.researchAreas.join(', ') : faculty.researchAreas || 'N/A'}\n`;
            context += `  Email: ${faculty.email || 'N/A'}\n\n`;
          });
        }
        break;
        
      case 'course_search':
        if (data.courses.length > 0) {
          context += "Course Information:\n";
          data.courses.forEach(course => {
            context += `- ${course.name} (${course.code})\n`;
            context += `  Semester: ${course.semester}\n`;
            context += `  Instructor: ${course.instructor || 'N/A'}\n`;
            context += `  Topics: ${Array.isArray(course.topics) ? course.topics.slice(0, 5).join(', ') : course.topics || 'N/A'}\n\n`;
          });
        }
        break;
        
      case 'infrastructure_search':
        if (Object.keys(data.infrastructure).length > 0) {
          context += "Infrastructure Information:\n";
          Object.entries(data.infrastructure).forEach(([key, lab]) => {
            context += `- ${lab.name}\n`;
            context += `  Capacity: ${lab.capacity}\n`;
            context += `  Description: ${lab.description || 'N/A'}\n\n`;
          });
        }
        break;
        
      case 'calendar_search':
        if (data.calendar.events && data.calendar.events.length > 0) {
          context += "Calendar Information:\n";
          data.calendar.events.forEach(event => {
            context += `- ${event.name} (${event.type})\n`;
            context += `  Date: ${event.date}\n`;
            context += `  Description: ${event.description || 'N/A'}\n\n`;
          });
        }
        break;
        
      case 'greeting':
        context += "This is a greeting. Be warm and welcoming, and offer to help with information about the AIML department.\n";
        break;
        
      default:
        context += "General department information available about faculty, courses, infrastructure, and academic calendar.\n";
    }
    
    return `${systemPrompt}\n\n${context}\n\nUser Question: ${question}\n\nProvide a helpful, conversational response:`;
  }

  // Generate fallback response
  generateFallbackResponse(question, data, analysis) {
    switch (analysis.intent) {
      case 'faculty_search':
        if (data.faculty.length > 0) {
          const facultyList = data.faculty.slice(0, 5).map(f => 
            `• ${f.name} (${f.designation}) - ${Array.isArray(f.specialization) ? f.specialization.slice(0, 2).join(', ') : f.specialization || 'General'}`
          ).join('\n');
          return `Here are the faculty members I found:\n\n${facultyList}\n\nWould you like more details about any specific faculty member?`;
        }
        return "I couldn't find specific faculty information for your query. Could you please rephrase your question or ask about a particular specialization?";
        
      case 'course_search':
        if (data.courses.length > 0) {
          const courseList = data.courses.slice(0, 5).map(c => 
            `• ${c.name} (${c.code}) - Semester ${c.semester}`
          ).join('\n');
          return `Here are the courses I found:\n\n${courseList}\n\nWould you like more details about any specific course?`;
        }
        return "I couldn't find specific course information for your query. Could you please specify the semester or course name?";
        
      case 'infrastructure_search':
        if (Object.keys(data.infrastructure).length > 0) {
          const labList = Object.values(data.infrastructure).slice(0, 3).map(lab => 
            `• ${lab.name} - Capacity: ${lab.capacity}`
          ).join('\n');
          return `Here are the infrastructure facilities I found:\n\n${labList}\n\nWould you like more details about any specific lab or facility?`;
        }
        return "I couldn't find specific infrastructure information for your query. Could you please specify what type of facility you're looking for?";
        
      case 'greeting':
        return "Hello! I'm your AI assistant for the AIML department at BMSCE. I can help you with information about faculty, courses, infrastructure, and academic calendar. What would you like to know?";
        
      default:
        return "I can help you with information about faculty, courses, infrastructure, and academic calendar at the AIML department. Could you please be more specific about what you'd like to know?";
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