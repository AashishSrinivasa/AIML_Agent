const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Read comprehensive data files
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_faculty.json'), 'utf8'));
const courseData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_courses.json'), 'utf8'));
const calendarData = [JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_academic_calendar.json'), 'utf8'))];
const infrastructureData = [JSON.parse(fs.readFileSync(path.join(__dirname, 'data/comprehensive_infrastructure.json'), 'utf8'))];

// Faculty routes
app.get('/api/faculty', (req, res) => {
  const { search, designation, specialization } = req.query;
  
  let filteredFaculty = facultyData;
  
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
  
  filteredFaculty.sort((a, b) => a.name.localeCompare(b.name));
  
  res.json({
    success: true,
    count: filteredFaculty.length,
    data: filteredFaculty
  });
});

app.get('/api/faculty/stats/overview', (req, res) => {
  const totalFaculty = facultyData.length;
  
  // Calculate designations
  const designationMap = new Map();
  facultyData.forEach(faculty => {
    const designation = faculty.designation;
    designationMap.set(designation, (designationMap.get(designation) || 0) + 1);
  });
  const designations = Array.from(designationMap.entries()).map(([designation, count]) => ({
    _id: designation,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Calculate specializations
  const specializationMap = new Map();
  facultyData.forEach(faculty => {
    if (faculty.specialization && Array.isArray(faculty.specialization)) {
      faculty.specialization.forEach(spec => {
        specializationMap.set(spec, (specializationMap.get(spec) || 0) + 1);
      });
    }
  });
  const specializations = Array.from(specializationMap.entries()).map(([specialization, count]) => ({
    _id: specialization,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Calculate total publications
  const totalPublications = facultyData.reduce((total, faculty) => {
    return total + (faculty.publications || 0);
  }, 0);
  
  // Calculate total research areas
  const researchAreaMap = new Map();
  facultyData.forEach(faculty => {
    if (faculty.researchAreas && Array.isArray(faculty.researchAreas)) {
      faculty.researchAreas.forEach(area => {
        researchAreaMap.set(area, (researchAreaMap.get(area) || 0) + 1);
      });
    }
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

// Courses routes
app.get('/api/courses', (req, res) => {
  const { search, semester, instructor, credits } = req.query;
  
  let filteredCourses = courseData;
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredCourses = filteredCourses.filter(course => 
      course.name.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      (course.topics && course.topics.some(topic => topic.toLowerCase().includes(searchTerm)))
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
  
  filteredCourses.sort((a, b) => a.code.localeCompare(b.code));
  
  res.json({
    success: true,
    count: filteredCourses.length,
    data: filteredCourses
  });
});

app.get('/api/courses/stats/overview', (req, res) => {
  const totalCourses = courseData.length;
  
  // Calculate semesters
  const semesterMap = new Map();
  courseData.forEach(course => {
    const semester = course.semester;
    semesterMap.set(semester, (semesterMap.get(semester) || 0) + 1);
  });
  const semesters = Array.from(semesterMap.entries()).map(([semester, count]) => ({
    _id: semester,
    count
  })).sort((a, b) => a._id.localeCompare(b._id));
  
  // Calculate instructors
  const instructorMap = new Map();
  courseData.forEach(course => {
    const instructor = course.instructor;
    instructorMap.set(instructor, (instructorMap.get(instructor) || 0) + 1);
  });
  const instructors = Array.from(instructorMap.entries()).map(([instructor, count]) => ({
    _id: instructor,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Calculate credits
  const creditMap = new Map();
  courseData.forEach(course => {
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

// Calendar routes
app.get('/api/calendar', (req, res) => {
  const { year } = req.query;
  
  let calendar = calendarData;
  
  if (year) {
    calendar = calendarData.filter(cal => 
      cal.academicYear === year
    );
    if (calendar.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Academic calendar not found for the specified year'
      });
    }
    calendar = calendar[0];
  } else {
    calendar = calendarData.sort((a, b) => 
      b.academicYear.localeCompare(a.academicYear)
    )[0];
  }
  
  res.json({
    success: true,
    data: calendar
  });
});

// Infrastructure routes
app.get('/api/infrastructure', (req, res) => {
  const { department } = req.query;
  
  let infrastructure = infrastructureData;
  
  if (department) {
    infrastructure = infrastructureData.filter(infra => 
      infra.department && infra.department.toLowerCase().includes(department.toLowerCase())
    );
    if (infrastructure.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Infrastructure details not found for the specified department'
      });
    }
    infrastructure = infrastructure[0];
  } else {
    infrastructure = infrastructureData[0];
  }
  
  res.json({
    success: true,
    data: infrastructure
  });
});

app.get('/api/infrastructure/labs', (req, res) => {
  const infrastructure = infrastructureData[0];
  res.json({
    success: true,
    data: infrastructure.labs || []
  });
});

app.get('/api/infrastructure/research', (req, res) => {
  const infrastructure = infrastructureData[0];
  res.json({
    success: true,
    data: infrastructure.researchFacilities || []
  });
});

// AI routes (mock responses)
app.get('/api/ai/help', (req, res) => {
  res.json({
    success: true,
    data: {
      capabilities: [
        {
          category: "Faculty Information",
          description: "Get details about faculty members, their specializations, and research areas"
        },
        {
          category: "Course Information", 
          description: "Access course details, prerequisites, and academic information"
        },
        {
          category: "Academic Calendar",
          description: "View important dates, events, and examination schedules"
        },
        {
          category: "Infrastructure",
          description: "Learn about labs, facilities, and available equipment"
        }
      ]
    }
  });
});

app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  const lowerMessage = message.toLowerCase();
  
  let response = "";
  let sources = [];
  
  // Faculty-related queries
  if (lowerMessage.includes('faculty') || lowerMessage.includes('professor') || lowerMessage.includes('teacher') || lowerMessage.includes('staff')) {
    if (lowerMessage.includes('how many') || lowerMessage.includes('total') || lowerMessage.includes('count')) {
      response = `We have ${facultyData.length} faculty members in our Machine Learning department. `;
    } else if (lowerMessage.includes('head') || lowerMessage.includes('hod')) {
      const hod = facultyData.find(f => f.designation.includes('HOD'));
      if (hod) {
        response = `Our Head of Department is ${hod.name} (${hod.designation}). `;
        response += `Dr. ${hod.name} specializes in ${hod.specialization.join(', ')} and has research interests in ${hod.researchAreas.join(', ')}. `;
        response += `You can contact them at ${hod.email}. `;
      }
    } else if (lowerMessage.includes('specialization') || lowerMessage.includes('research')) {
      const specializations = [...new Set(facultyData.flatMap(f => f.specialization))];
      response = `Our faculty members specialize in various areas including: ${specializations.slice(0, 10).join(', ')}. `;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
      response = `You can find faculty contact information in our faculty directory. `;
      response += `For example, our HOD Dr. M Dakshayini can be reached at dakshayini.ise@bmsce.ac.in. `;
    } else {
      response = `We have ${facultyData.length} faculty members including 1 HOD, 1 Professor, 3 Associate Professors, and 14 Assistant Professors. `;
      response += `They specialize in areas like Machine Learning, AI, Deep Learning, Computer Vision, NLP, and more. `;
    }
    sources.push('Faculty Directory');
  }
  
  // Course-related queries
  else if (lowerMessage.includes('course') || lowerMessage.includes('subject') || lowerMessage.includes('syllabus')) {
    if (lowerMessage.includes('how many') || lowerMessage.includes('total')) {
      response = `We offer ${courseData.length} courses in our Machine Learning program. `;
    } else if (lowerMessage.includes('semester') || lowerMessage.includes('year')) {
      const semesters = [...new Set(courseData.map(c => c.semester))];
      response = `Our courses are distributed across semesters: ${semesters.join(', ')}. `;
    } else if (lowerMessage.includes('credit') || lowerMessage.includes('credits')) {
      const credits = [...new Set(courseData.map(c => c.credits))];
      response = `Our courses have different credit structures: ${credits.join(', ')} credits. `;
    } else {
      response = `We offer ${courseData.length} comprehensive courses covering topics like Machine Learning, Deep Learning, AI, Data Science, and more. `;
      response += `Courses are designed to provide both theoretical knowledge and practical skills. `;
    }
    sources.push('Course Catalog');
  }
  
  // Infrastructure-related queries
  else if (lowerMessage.includes('lab') || lowerMessage.includes('infrastructure') || lowerMessage.includes('facility') || lowerMessage.includes('equipment')) {
    if (infrastructureData[0] && infrastructureData[0].labs) {
      response = `Our department has ${infrastructureData[0].labs.length} state-of-the-art labs: `;
      infrastructureData[0].labs.forEach((lab, index) => {
        response += `${lab.name} (Capacity: ${lab.capacity}), `;
      });
      response = response.slice(0, -2) + `. `;
      
      if (infrastructureData[0].labs[0] && infrastructureData[0].labs[0].equipment) {
        response += `Our main lab, ${infrastructureData[0].labs[0].name}, is equipped with ${infrastructureData[0].labs[0].equipment.length} different types of equipment including high-performance computing workstations. `;
      }
    } else {
      response = `Our department has state-of-the-art infrastructure including specialized labs for Machine Learning, AI research, and practical training. `;
    }
    sources.push('Infrastructure Guide');
  }
  
  // Calendar-related queries
  else if (lowerMessage.includes('calendar') || lowerMessage.includes('event') || lowerMessage.includes('exam') || lowerMessage.includes('schedule')) {
    if (calendarData[0]) {
      response = `Our academic calendar for ${calendarData[0].academicYear} includes various events, examinations, and important dates. `;
      if (calendarData[0].semesters && calendarData[0].semesters.length > 0) {
        response += `We have ${calendarData[0].semesters.length} semesters with detailed schedules. `;
      }
    } else {
      response = `You can find our academic calendar with all important dates, examination schedules, and events. `;
    }
    sources.push('Academic Calendar');
  }
  
  // General department queries
  else if (lowerMessage.includes('department') || lowerMessage.includes('about') || lowerMessage.includes('overview')) {
    response = `The Machine Learning (AI and ML) department at BMSCE is a leading center for artificial intelligence education and research. `;
    response += `We have ${facultyData.length} faculty members, offer ${courseData.length} courses, and maintain state-of-the-art infrastructure. `;
    response += `Our department focuses on cutting-edge areas like Deep Learning, Computer Vision, NLP, and AI applications. `;
    sources.push('Department Overview');
  }
  
  // Contact information
  else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('address')) {
    response = `You can contact our department at: `;
    response += `Phone: +91-80-26622130-35, `;
    response += `Email: info@bmsce.ac.in, `;
    response += `Address: P.O. Box No.: 1908, Bull Temple Road, Bangalore - 560 019, Karnataka, India. `;
    sources.push('Contact Information');
  }
  
  // Default response for unrecognized queries
  else {
    response = `I understand you're asking about "${message}". `;
    response += `I can help you with information about our ${facultyData.length} faculty members, ${courseData.length} courses, `;
    response += `academic calendar, and infrastructure. Could you please be more specific about what you'd like to know? `;
    sources.push('General Information');
  }
  
  // Add helpful suggestions
  response += `\n\nYou can also ask about specific faculty members, course details, lab facilities, or academic schedules.`;
  
  res.json({
    success: true,
    data: {
      response,
      sources: sources.length > 0 ? sources : ['General Information']
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on port ${PORT}`);
  console.log(`📊 Serving ${facultyData.length} faculty members`);
  console.log(`📚 Serving ${courseData.length} courses`);
  console.log(`📅 Serving ${calendarData.length} calendar entries`);
  console.log(`🏢 Serving ${infrastructureData.length} infrastructure entries`);
});
