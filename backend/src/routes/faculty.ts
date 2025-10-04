import express, { Request, Response } from 'express';
import { Faculty } from '../models/Faculty';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { search, designation, specialization } = req.query;
  
  let query: any = {};
  
  // Search by name, specialization, or research areas
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
      { researchAreas: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by designation
  if (designation) {
    query.designation = { $regex: designation, $options: 'i' };
  }
  
  // Filter by specialization
  if (specialization) {
    query.specialization = { $regex: specialization, $options: 'i' };
  }
  
  const faculty = await Faculty.find(query).sort({ name: 1 });
  
  return res.json({
    success: true,
    count: faculty.length,
    data: faculty
  });
}));

// @desc    Get single faculty member
// @route   GET /api/faculty/:id
// @access  Public
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const faculty = await Faculty.findOne({ id: req.params.id });
  
  if (!faculty) {
    return res.status(404).json({
      success: false,
      error: 'Faculty member not found'
    });
  }
  
  return res.json({
    success: true,
    data: faculty
  });
}));

// @desc    Get faculty by designation
// @route   GET /api/faculty/designation/:designation
// @access  Public
router.get('/designation/:designation', asyncHandler(async (req: Request, res: Response) => {
  const faculty = await Faculty.find({ 
    designation: { $regex: req.params.designation, $options: 'i' } 
  }).sort({ name: 1 });
  
  return res.json({
    success: true,
    count: faculty.length,
    data: faculty
  });
}));

// @desc    Get faculty by specialization
// @route   GET /api/faculty/specialization/:specialization
// @access  Public
router.get('/specialization/:specialization', asyncHandler(async (req: Request, res: Response) => {
  const faculty = await Faculty.find({ 
    specialization: { $regex: req.params.specialization, $options: 'i' } 
  }).sort({ name: 1 });
  
  return res.json({
    success: true,
    count: faculty.length,
    data: faculty
  });
}));

// @desc    Get faculty statistics
// @route   GET /api/faculty/stats/overview
// @access  Public
router.get('/stats/overview', asyncHandler(async (req: Request, res: Response) => {
  const totalFaculty = await Faculty.countDocuments();
  const designations = await Faculty.aggregate([
    { $group: { _id: '$designation', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const specializations = await Faculty.aggregate([
    { $unwind: '$specialization' },
    { $group: { _id: '$specialization', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const totalPublications = await Faculty.aggregate([
    { $group: { _id: null, total: { $sum: '$publications' } } }
  ]);
  
  return res.json({
    success: true,
    data: {
      totalFaculty,
      designations,
      specializations,
      totalPublications: totalPublications[0]?.total || 0
    }
  });
}));

export default router;
