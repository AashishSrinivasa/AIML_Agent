const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Load comprehensive data
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_faculty.json'), 'utf8'));
const courseData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_courses.json'), 'utf8'));
const calendarData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_academic_calendar.json'), 'utf8'));
const infrastructureData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_infrastructure.json'), 'utf8'));

// AI Knowledge Base - Comprehensive training data
const knowledgeBase = {
  // Faculty Information
  faculty: facultyData.map(faculty => ({
    name: faculty.name,
    designation: faculty.designation,
    qualification: faculty.qualification,
    specialization: faculty.specialization || [],
    researchAreas: faculty.researchAreas || [],
    publications: faculty.publications || 0,
    experience: faculty.experience || 0,
    email: faculty.email,
    phone: faculty.phone,
    office: faculty.office,
    officeHours: faculty.officeHours,
    bio: faculty.bio || '',
    achievements: faculty.achievements || [],
    projects: faculty.projects || []
  })),
  
  // Course Information
  courses: courseData.map(course => ({
    code: course.code,
    name: course.name,
    description: course.description,
    semester: course.semester,
    credits: course.credits,
    instructor: course.instructor,
    prerequisites: course.prerequisites || [],
    objectives: course.objectives || [],
    outcomes: course.outcomes || [],
    topics: course.topics || [],
    textbooks: course.textbooks || [],
    references: course.references || [],
    assessment: course.assessment || {},
    labWork: course.labWork || []
  })),
  
  // Calendar Information
  calendar: {
    academicYear: calendarData.academicYear,
    semesters: calendarData.semesters || [],
    events: calendarData.events || [],
    holidays: calendarData.holidays || [],
    examinations: calendarData.examinations || []
  },
  
  // Infrastructure Information
  infrastructure: {
    department: infrastructureData.department,
    labs: infrastructureData.labs || [],
    researchFacilities: infrastructureData.researchFacilities || [],
    equipment: infrastructureData.equipment || [],
    software: infrastructureData.software || [],
    library: infrastructureData.library || {},
    computerLabs: infrastructureData.computerLabs || []
  },
  
  // Department Information
  department: {
    name: "Machine Learning (AI and ML) Department",
    college: "B.M.S. College of Engineering",
    vision: "To be a globally recognized center of excellence in Artificial Intelligence and Machine Learning education, research, and innovation.",
    mission: "To provide world-class education in AI/ML, foster cutting-edge research, and produce industry-ready professionals who can solve real-world problems using artificial intelligence.",
    contact: {
      phone: "+91-80-26622130-35",
      email: "info@bmsce.ac.in",
      address: "P.O. Box No.: 1908, Bull Temple Road, Bangalore - 560 019, Karnataka, India"
    }
  }
};

// Advanced AI Response Generator
class AIMLAgent {
  constructor() {
    this.knowledgeBase = knowledgeBase;
    this.responseTemplates = this.initializeResponseTemplates();
  }

  initializeResponseTemplates() {
    return {
      faculty: {
        general: "Our department has {count} faculty members with diverse specializations in {specializations}.",
        specific: "Dr. {name} is a {designation} specializing in {specialization}. {bio} Contact: {email}",
        hod: "Our Head of Department is Dr. {name} ({designation}). {bio}",
        research: "Our faculty members are actively involved in research areas including {researchAreas}.",
        contact: "You can contact our faculty members through their individual emails or visit their offices during office hours."
      },
      courses: {
        general: "We offer {count} comprehensive courses covering various aspects of AI and Machine Learning.",
        specific: "{name} ({code}) is a {credits}-credit course taught by {instructor} in {semester} semester.",
        semester: "In {semester} semester, we offer courses like {courses}.",
        prerequisites: "The prerequisites for {course} include {prerequisites}.",
        outcomes: "After completing {course}, students will be able to {outcomes}."
      },
      infrastructure: {
        labs: "Our department has {count} state-of-the-art labs: {labs}.",
        equipment: "Our labs are equipped with {equipment}.",
        research: "We have specialized research facilities including {facilities}.",
        software: "Students have access to industry-standard software like {software}."
      },
      calendar: {
        events: "Our academic calendar includes important events like {events}.",
        exams: "Examination schedules are available for {semesters}.",
        holidays: "Academic holidays include {holidays}."
      }
    };
  }

  // Advanced question analysis
  analyzeQuestion(question) {
    const lowerQ = question.toLowerCase();
    
    return {
      type: this.detectQuestionType(lowerQ),
      keywords: this.extractKeywords(lowerQ),
      intent: this.detectIntent(lowerQ),
      entities: this.extractEntities(lowerQ)
    };
  }

  detectQuestionType(question) {
    if (question.includes('who') || question.includes('faculty') || question.includes('professor') || question.includes('teacher')) {
      return 'faculty';
    } else if (question.includes('what') && (question.includes('course') || question.includes('subject') || question.includes('syllabus'))) {
      return 'courses';
    } else if (question.includes('when') || question.includes('calendar') || question.includes('exam') || question.includes('schedule')) {
      return 'calendar';
    } else if (question.includes('where') || question.includes('lab') || question.includes('infrastructure') || question.includes('facility')) {
      return 'infrastructure';
    } else if (question.includes('how') || question.includes('contact') || question.includes('reach')) {
      return 'contact';
    } else if (question.includes('why') || question.includes('about') || question.includes('department')) {
      return 'general';
    }
    return 'general';
  }

  extractKeywords(question) {
    const keywords = [];
    const allSpecializations = [...new Set(this.knowledgeBase.faculty.flatMap(f => f.specialization))];
    const allResearchAreas = [...new Set(this.knowledgeBase.faculty.flatMap(f => f.researchAreas))];
    const allCourses = this.knowledgeBase.courses.map(c => c.name);
    
    // Check for faculty specializations (avoid duplicates)
    allSpecializations.forEach(spec => {
      if (question.toLowerCase().includes(spec.toLowerCase()) && !keywords.includes(spec)) {
        keywords.push(spec);
      }
    });
    
    // Check for research areas (avoid duplicates)
    allResearchAreas.forEach(area => {
      if (question.toLowerCase().includes(area.toLowerCase()) && !keywords.includes(area)) {
        keywords.push(area);
      }
    });
    
    // Check for course names (avoid duplicates)
    allCourses.forEach(course => {
      if (question.toLowerCase().includes(course.toLowerCase()) && !keywords.includes(course)) {
        keywords.push(course);
      }
    });
    
    return keywords;
  }

  detectIntent(question) {
    if (question.includes('how many') || question.includes('count') || question.includes('total')) {
      return 'count';
    } else if (question.includes('who is') || question.includes('name of')) {
      return 'specific';
    } else if (question.includes('what are') || question.includes('list')) {
      return 'list';
    } else if (question.includes('when is') || question.includes('schedule')) {
      return 'schedule';
    } else if (question.includes('where is') || question.includes('location')) {
      return 'location';
    } else if (question.includes('how to') || question.includes('contact')) {
      return 'howto';
    }
    return 'general';
  }

  extractEntities(question) {
    const entities = [];
    
    // Extract faculty names
    this.knowledgeBase.faculty.forEach(faculty => {
      if (question.includes(faculty.name.toLowerCase())) {
        entities.push({ type: 'faculty', value: faculty });
      }
    });
    
    // Extract course codes/names
    this.knowledgeBase.courses.forEach(course => {
      if (question.includes(course.code.toLowerCase()) || question.includes(course.name.toLowerCase())) {
        entities.push({ type: 'course', value: course });
      }
    });
    
    return entities;
  }

  // Generate intelligent response using free LLM
  async generateResponse(question) {
    const analysis = this.analyzeQuestion(question);
    let response = "";
    let sources = [];

    // Get relevant data based on question type
    let relevantData = this.getRelevantData(analysis);
    
    // Use free LLM for better responses
    try {
      response = await this.generateLLMResponse(question, relevantData, analysis);
    } catch (error) {
      console.log('LLM fallback to rule-based response');
      response = this.generateRuleBasedResponse(question, analysis);
    }

    return {
      response: response.trim(),
      sources: sources,
      confidence: this.calculateConfidence(analysis)
    };
  }

  // Get relevant data for the question
  getRelevantData(analysis) {
    const { faculty, courses, infrastructure, calendar } = this.knowledgeBase;
    
    switch (analysis.type) {
      case 'faculty':
        return {
          faculty: faculty,
          specializations: [...new Set(faculty.flatMap(f => f.specialization))],
          researchAreas: [...new Set(faculty.flatMap(f => f.researchAreas))],
          totalFaculty: faculty.length
        };
      case 'courses':
        return {
          courses: courses,
          semesters: [...new Set(courses.map(c => c.semester))],
          instructors: [...new Set(courses.map(c => c.instructor))],
          totalCourses: courses.length
        };
      case 'infrastructure':
        return {
          labs: infrastructure.labs,
          equipment: infrastructure.equipment,
          software: infrastructure.software
        };
      case 'calendar':
        return {
          academicYear: calendar.academicYear,
          events: calendar.events,
          examinations: calendar.examinations
        };
      default:
        return {
          department: this.knowledgeBase.department,
          faculty: faculty,
          courses: courses
        };
    }
  }

  // Generate response using Llama LLM via Ollama
  async generateLLMResponse(question, data, analysis) {
    const prompt = this.buildLlamaPrompt(question, data, analysis);
    
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
               model: 'llama3:latest', // Available Llama model
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 300
          }
        })
      });

      if (!response.ok) {
        throw new Error('Llama API error');
      }

      const result = await response.json();
      return result.response || this.generateRuleBasedResponse(question, analysis);
    } catch (error) {
      console.log('Llama not available, using fallback');
      throw error;
    }
  }

  // Build context-aware prompt for Llama LLM
  buildLlamaPrompt(question, data, analysis) {
    let context = "";
    let systemPrompt = "You are a helpful AI assistant for the AIML (Artificial Intelligence and Machine Learning) department at BMSCE College of Engineering. Provide concise, accurate, and helpful responses about faculty, courses, infrastructure, and academic information.";
    
    if (analysis.type === 'faculty' && analysis.keywords.length > 0) {
      const matchingFaculty = data.faculty.filter(f => 
        f.specialization.some(spec => analysis.keywords.includes(spec)) ||
        f.researchAreas.some(area => analysis.keywords.includes(area))
      );
      
      context = `Faculty specializing in ${analysis.keywords.join(', ')}:\n`;
      matchingFaculty.forEach(f => {
        context += `- ${f.name} (${f.designation}) - ${f.email}\n`;
        context += `  Specializations: ${f.specialization.join(', ')}\n`;
        context += `  Research Areas: ${f.researchAreas.join(', ')}\n\n`;
      });
    } else if (analysis.type === 'courses') {
      context = `Available courses:\n`;
      data.courses.forEach(c => {
        context += `- ${c.name} (${c.code}) - ${c.semester} semester - ${c.instructor}\n`;
      });
    } else if (analysis.type === 'infrastructure') {
      context = `Department Labs:\n`;
      data.labs.forEach(l => {
        context += `- ${l.name} (Capacity: ${l.capacity})\n`;
      });
    } else if (analysis.type === 'calendar') {
      context = `Academic Calendar ${data.academicYear}:\n`;
      if (data.events) context += `Events: ${data.events.join(', ')}\n`;
      if (data.examinations) context += `Examinations: ${data.examinations.map(e => e.name).join(', ')}\n`;
    }

    return `${systemPrompt}\n\nContext Information:\n${context}\n\nUser Question: ${question}\n\nProvide a helpful, concise response:`;
  }

  // Build context-aware prompt for LLM (fallback)
  buildPrompt(question, data, analysis) {
    let context = "";
    
    if (analysis.type === 'faculty' && analysis.keywords.length > 0) {
      const matchingFaculty = data.faculty.filter(f => 
        f.specialization.some(spec => analysis.keywords.includes(spec)) ||
        f.researchAreas.some(area => analysis.keywords.includes(area))
      );
      
      context = `Faculty specializing in ${analysis.keywords.join(', ')}: `;
      context += matchingFaculty.map(f => `${f.name} (${f.designation})`).join(', ');
    } else if (analysis.type === 'courses') {
      context = `Available courses: ${data.courses.map(c => `${c.name} (${c.semester})`).join(', ')}`;
    } else if (analysis.type === 'infrastructure') {
      context = `Labs: ${data.labs.map(l => l.name).join(', ')}`;
    }

    return `Context: ${context}\nQuestion: ${question}\nAnswer concisely:`;
  }

  // Fallback rule-based response (cleaner version)
  generateRuleBasedResponse(question, analysis) {
    const { faculty, courses, infrastructure, calendar } = this.knowledgeBase;
    
    switch (analysis.type) {
      case 'faculty':
        if (analysis.keywords.length > 0) {
          const matchingFaculty = faculty.filter(f => 
            f.specialization.some(spec => analysis.keywords.includes(spec)) ||
            f.researchAreas.some(area => analysis.keywords.includes(area))
          );
          
          if (matchingFaculty.length > 0) {
            return `Faculty specializing in ${analysis.keywords.join(', ')}:\n` +
                   matchingFaculty.map(f => `• ${f.name} (${f.designation}) - ${f.email}`).join('\n');
          }
        }
        
        if (question.includes('hod') || question.includes('head')) {
          const hod = faculty.find(f => f.designation.includes('HOD'));
          return hod ? `Head of Department: Dr. ${hod.name} (${hod.email})` : 'HOD information not available';
        }
        
        return `We have ${faculty.length} faculty members. You can find their details in the faculty directory.`;
        
      case 'courses':
        if (question.includes('semester')) {
          const semester = question.match(/\d+/)?.[0];
          if (semester) {
            const semesterCourses = courses.filter(c => c.semester.includes(semester));
            return semesterCourses.length > 0 
              ? `${semester} semester courses:\n${semesterCourses.map(c => `• ${c.name} - ${c.instructor}`).join('\n')}`
              : `No courses found for ${semester} semester`;
          }
        }
        return `We offer ${courses.length} courses across different semesters.`;
        
      case 'infrastructure':
        return `We have ${infrastructure.labs.length} labs: ${infrastructure.labs.map(l => l.name).join(', ')}`;
        
      case 'calendar':
        return `Academic year: ${calendar.academicYear}. Check the calendar section for detailed schedules.`;
        
      case 'contact':
        return `Contact: ${this.knowledgeBase.department.contact.phone} | ${this.knowledgeBase.department.contact.email}`;
        
      default:
        return `I can help you with faculty, courses, infrastructure, and calendar information. What would you like to know?`;
    }
  }


  calculateConfidence(analysis) {
    let confidence = 0.5; // Base confidence
    
    if (analysis.keywords.length > 0) confidence += 0.2;
    if (analysis.entities.length > 0) confidence += 0.2;
    if (analysis.intent !== 'general') confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}

// Initialize AI Agent
const aiAgent = new AIMLAgent();

// API Routes
app.get('/api/faculty', (req, res) => {
  const { search, designation, specialization } = req.query;
  
  let filteredFaculty = knowledgeBase.faculty;
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredFaculty = filteredFaculty.filter(faculty => 
      faculty.name.toLowerCase().includes(searchTerm) ||
      faculty.specialization.some(spec => spec.toLowerCase().includes(searchTerm)) ||
      faculty.researchAreas.some(area => area.toLowerCase().includes(searchTerm))
    );
  }
  
  if (designation) {
    filteredFaculty = filteredFaculty.filter(faculty => 
      faculty.designation.toLowerCase().includes(designation.toLowerCase())
    );
  }
  
  if (specialization) {
    filteredFaculty = filteredFaculty.filter(faculty => 
      faculty.specialization.some(spec => 
        spec.toLowerCase().includes(specialization.toLowerCase())
      )
    );
  }
  
  res.json({
    success: true,
    count: filteredFaculty.length,
    data: filteredFaculty
  });
});

app.get('/api/faculty/stats/overview', (req, res) => {
  const faculty = knowledgeBase.faculty;
  const totalFaculty = faculty.length;
  
  const designationMap = new Map();
  faculty.forEach(f => {
    const designation = f.designation;
    designationMap.set(designation, (designationMap.get(designation) || 0) + 1);
  });
  const designations = Array.from(designationMap.entries()).map(([designation, count]) => ({
    _id: designation,
    count
  })).sort((a, b) => b.count - a.count);
  
  const specializationMap = new Map();
  faculty.forEach(f => {
    f.specialization.forEach(spec => {
      specializationMap.set(spec, (specializationMap.get(spec) || 0) + 1);
    });
  });
  const specializations = Array.from(specializationMap.entries()).map(([specialization, count]) => ({
    _id: specialization,
    count
  })).sort((a, b) => b.count - a.count);
  
  const totalPublications = faculty.reduce((total, f) => total + f.publications, 0);
  
  const researchAreaMap = new Map();
  faculty.forEach(f => {
    f.researchAreas.forEach(area => {
      researchAreaMap.set(area, (researchAreaMap.get(area) || 0) + 1);
    });
  });
  const totalResearchAreas = researchAreaMap.size;
  
  res.json({
    success: true,
    data: {
      totalFaculty,
      designations,
      specializations,
      totalPublications,
      totalResearchAreas
    }
  });
});

app.get('/api/courses', (req, res) => {
  const { search, semester, instructor, credits } = req.query;
  
  let filteredCourses = knowledgeBase.courses;
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredCourses = filteredCourses.filter(course => 
      course.name.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.topics.some(topic => topic.toLowerCase().includes(searchTerm))
    );
  }
  
  if (semester) {
    filteredCourses = filteredCourses.filter(course => 
      course.semester.toLowerCase().includes(semester.toLowerCase())
    );
  }
  
  if (instructor) {
    filteredCourses = filteredCourses.filter(course => 
      course.instructor.toLowerCase().includes(instructor.toLowerCase())
    );
  }
  
  if (credits) {
    const creditValue = parseInt(credits);
    filteredCourses = filteredCourses.filter(course => 
      course.credits === creditValue
    );
  }
  
  res.json({
    success: true,
    count: filteredCourses.length,
    data: filteredCourses
  });
});

app.get('/api/courses/stats/overview', (req, res) => {
  const courses = knowledgeBase.courses;
  const totalCourses = courses.length;
  
  const semesterMap = new Map();
  courses.forEach(course => {
    const semester = course.semester;
    semesterMap.set(semester, (semesterMap.get(semester) || 0) + 1);
  });
  const semesters = Array.from(semesterMap.entries()).map(([semester, count]) => ({
    _id: semester,
    count
  })).sort((a, b) => a._id.localeCompare(b._id));
  
  const instructorMap = new Map();
  courses.forEach(course => {
    const instructor = course.instructor;
    instructorMap.set(instructor, (instructorMap.get(instructor) || 0) + 1);
  });
  const instructors = Array.from(instructorMap.entries()).map(([instructor, count]) => ({
    _id: instructor,
    count
  })).sort((a, b) => b.count - a.count);
  
  const creditMap = new Map();
  courses.forEach(course => {
    const credits = course.credits;
    creditMap.set(credits, (creditMap.get(credits) || 0) + 1);
  });
  const credits = Array.from(creditMap.entries()).map(([credits, count]) => ({
    _id: credits,
    count
  })).sort((a, b) => a._id - b._id);
  
  res.json({
    success: true,
    data: {
      totalCourses,
      semesters,
      instructors,
      credits
    }
  });
});

app.get('/api/calendar', (req, res) => {
  res.json({
    success: true,
    data: knowledgeBase.calendar
  });
});

app.get('/api/infrastructure', (req, res) => {
  res.json({
    success: true,
    data: knowledgeBase.infrastructure
  });
});

app.get('/api/infrastructure/labs', (req, res) => {
  res.json({
    success: true,
    data: knowledgeBase.infrastructure.labs
  });
});

app.get('/api/infrastructure/research', (req, res) => {
  res.json({
    success: true,
    data: knowledgeBase.infrastructure.researchFacilities
  });
});

app.get('/api/infrastructure/stats', (req, res) => {
  const { infrastructure } = knowledgeBase;
  res.json({
    success: true,
    data: {
      totalLabs: infrastructure.labs.length,
      totalEquipment: infrastructure.equipment ? infrastructure.equipment.length : 0,
      totalSoftware: infrastructure.software ? infrastructure.software.length : 0,
      totalResearchFacilities: infrastructure.researchFacilities.length
    }
  });
});

// AI Chat endpoint with advanced intelligence
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
      data: {
        response: response.response,
        sources: response.sources,
        confidence: response.confidence
      }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.json({
      success: false,
      error: 'Sorry, I encountered an error processing your request. Please try again.'
    });
  }
});

// AI Help endpoint
app.get('/api/ai/help', (req, res) => {
  res.json({
    success: true,
    data: {
      capabilities: [
        {
          category: 'Faculty Information',
          description: 'Get details about faculty members, their specializations, research areas, and contact information'
        },
        {
          category: 'Course Information',
          description: 'Learn about courses, syllabi, prerequisites, and academic requirements'
        },
        {
          category: 'Infrastructure',
          description: 'Information about labs, equipment, software, and facilities'
        },
        {
          category: 'Academic Calendar',
          description: 'Examination schedules, events, holidays, and important dates'
        },
        {
          category: 'Department Overview',
          description: 'General information about the AIML department and its programs'
        }
      ],
      examples: [
        'Who is the head of department?',
        'What courses are available in 6th semester?',
        'Tell me about Machine Learning faculty',
        'What labs are available?',
        'When are the mid-term exams?',
        'How can I contact Dr. Rajesh Kumar?',
        'What are the research areas in AI?',
        'Tell me about the department infrastructure'
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Advanced AI Agent running on port ${PORT}`);
  console.log(`📊 Serving ${knowledgeBase.faculty.length} faculty members`);
  console.log(`📚 Serving ${knowledgeBase.courses.length} courses`);
  console.log(`🏢 Serving infrastructure data`);
  console.log(`📅 Serving calendar data`);
  console.log(`🤖 AI Agent trained and ready for intelligent conversations!`);
});
