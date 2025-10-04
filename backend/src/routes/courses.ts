import express, { Request, Response } from 'express';
import { Course } from '../models/Course';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { search, semester, instructor, credits } = req.query;
  
  let query: any = {};
  
  // Search by name, description, or topics
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { topics: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by semester
  if (semester) {
    query.semester = { $regex: semester, $options: 'i' };
  }
  
  // Filter by instructor
  if (instructor) {
    query.instructor = { $regex: instructor, $options: 'i' };
  }
  
  // Filter by credits
  if (credits) {
    query.credits = parseInt(credits as string);
  }
  
  const courses = await Course.find(query).sort({ code: 1 });
  
  return res.json({
    success: true,
    count: courses.length,
    data: courses
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
  const totalCourses = await Course.countDocuments();
  const semesters = await Course.aggregate([
    { $group: { _id: '$semester', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  const instructors = await Course.aggregate([
    { $group: { _id: '$instructor', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const credits = await Course.aggregate([
    { $group: { _id: '$credits', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
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
