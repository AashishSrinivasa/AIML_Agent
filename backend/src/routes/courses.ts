import express, { Request, Response } from 'express';
import { Course } from '../models/Course';
import { asyncHandler } from '../utils/errorHandler';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { search, semester, instructor, credits } = req.query;
  
  // Read comprehensive courses data from JSON file
  const courseData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/comprehensive_courses.json'), 'utf8')
  );
  
  let filteredCourses = courseData;
  
  // Search by name, description, or topics
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredCourses = filteredCourses.filter((course: any) => 
      course.name.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      (course.topics && course.topics.some((topic: string) => topic.toLowerCase().includes(searchTerm)))
    );
  }
  
  // Filter by semester
  if (semester) {
    filteredCourses = filteredCourses.filter((course: any) => 
      course.semester.toLowerCase().includes((semester as string).toLowerCase())
    );
  }
  
  // Filter by instructor
  if (instructor) {
    filteredCourses = filteredCourses.filter((course: any) => 
      course.instructor.toLowerCase().includes((instructor as string).toLowerCase())
    );
  }
  
  // Filter by credits
  if (credits) {
    const creditValue = parseInt(credits as string);
    filteredCourses = filteredCourses.filter((course: any) => 
      course.credits === creditValue
    );
  }
  
  // Sort by code
  filteredCourses.sort((a: any, b: any) => a.code.localeCompare(b.code));
  
  return res.json({
    success: true,
    count: filteredCourses.length,
    data: filteredCourses
  });
}));

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findOne({ id: req.params.id });
  
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found'
    });
  }
  
  return res.json({
    success: true,
    data: course
  });
}));

// @desc    Get courses by semester
// @route   GET /api/courses/semester/:semester
// @access  Public
router.get('/semester/:semester', asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find({ 
    semester: { $regex: req.params.semester, $options: 'i' } 
  }).sort({ code: 1 });
  
  return res.json({
    success: true,
    count: courses.length,
    data: courses
  });
}));

// @desc    Get courses by instructor
// @route   GET /api/courses/instructor/:instructor
// @access  Public
router.get('/instructor/:instructor', asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find({ 
    instructor: { $regex: req.params.instructor, $options: 'i' } 
  }).sort({ code: 1 });
  
  return res.json({
    success: true,
    count: courses.length,
    data: courses
  });
}));

// @desc    Get course statistics
// @route   GET /api/courses/stats/overview
// @access  Public
router.get('/stats/overview', asyncHandler(async (req: Request, res: Response) => {
  // Read comprehensive courses data from JSON file
  const courseData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/comprehensive_courses.json'), 'utf8')
  );
  
  const totalCourses = courseData.length;
  
  // Calculate semesters
  const semesterMap = new Map();
  courseData.forEach((course: any) => {
    const semester = course.semester;
    semesterMap.set(semester, (semesterMap.get(semester) || 0) + 1);
  });
  const semesters = Array.from(semesterMap.entries()).map(([semester, count]) => ({
    _id: semester,
    count
  })).sort((a, b) => a._id.localeCompare(b._id));
  
  // Calculate instructors
  const instructorMap = new Map();
  courseData.forEach((course: any) => {
    const instructor = course.instructor;
    instructorMap.set(instructor, (instructorMap.get(instructor) || 0) + 1);
  });
  const instructors = Array.from(instructorMap.entries()).map(([instructor, count]) => ({
    _id: instructor,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Calculate credits
  const creditMap = new Map();
  courseData.forEach((course: any) => {
    const credits = course.credits;
    creditMap.set(credits, (creditMap.get(credits) || 0) + 1);
  });
  const credits = Array.from(creditMap.entries()).map(([credits, count]) => ({
    _id: credits,
    count
  })).sort((a, b) => a._id - b._id);
  
  return res.json({
    success: true,
    data: {
      totalCourses,
      semesters,
      instructors,
      credits
    }
  });
}));

// @desc    Get course prerequisites
// @route   GET /api/courses/:id/prerequisites
// @access  Public
router.get('/:id/prerequisites', asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findOne({ id: req.params.id });
  
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found'
    });
  }
  
  // Find courses that have this course as a prerequisite
  const dependentCourses = await Course.find({
    prerequisites: { $in: [course.name] }
  });
  
  return res.json({
    success: true,
    data: {
      course: course.name,
      prerequisites: course.prerequisites,
      dependentCourses: dependentCourses.map(c => ({
        code: c.code,
        name: c.name,
        semester: c.semester
      }))
    }
  });
}));

export default router;
