import express, { Request, Response } from 'express';
import { Faculty } from '../models/Faculty';
import { asyncHandler } from '../utils/errorHandler';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { search, designation, specialization } = req.query;
  
  // Read comprehensive faculty data from JSON file
  const facultyData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/comprehensive_faculty.json'), 'utf8')
  );
  
  let filteredFaculty = facultyData;
  
  // Search by name, specialization, or research areas
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredFaculty = filteredFaculty.filter((faculty: any) => 
      faculty.name.toLowerCase().includes(searchTerm) ||
      faculty.specialization.some((spec: string) => spec.toLowerCase().includes(searchTerm)) ||
      faculty.researchAreas.some((area: string) => area.toLowerCase().includes(searchTerm))
    );
  }
  
  // Filter by designation
  if (designation) {
    filteredFaculty = filteredFaculty.filter((faculty: any) => 
      faculty.designation.toLowerCase().includes((designation as string).toLowerCase())
    );
  }
  
  // Filter by specialization
  if (specialization) {
    filteredFaculty = filteredFaculty.filter((faculty: any) => 
      faculty.specialization.some((spec: string) => 
        spec.toLowerCase().includes((specialization as string).toLowerCase())
      )
    );
  }
  
  // Sort by name
  filteredFaculty.sort((a: any, b: any) => a.name.localeCompare(b.name));
  
  return res.json({
    success: true,
    count: filteredFaculty.length,
    data: filteredFaculty
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
  // Read comprehensive faculty data from JSON file
  const facultyData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/comprehensive_faculty.json'), 'utf8')
  );
  
  const totalFaculty = facultyData.length;
  
  // Calculate designations
  const designationMap = new Map();
  facultyData.forEach((faculty: any) => {
    const designation = faculty.designation;
    designationMap.set(designation, (designationMap.get(designation) || 0) + 1);
  });
  const designations = Array.from(designationMap.entries()).map(([designation, count]) => ({
    _id: designation,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Calculate specializations
  const specializationMap = new Map();
  facultyData.forEach((faculty: any) => {
    if (faculty.specialization && Array.isArray(faculty.specialization)) {
      faculty.specialization.forEach((spec: string) => {
        specializationMap.set(spec, (specializationMap.get(spec) || 0) + 1);
      });
    }
  });
  const specializations = Array.from(specializationMap.entries()).map(([specialization, count]) => ({
    _id: specialization,
    count
  })).sort((a, b) => b.count - a.count);
  
  // Calculate total publications
  const totalPublications = facultyData.reduce((total: number, faculty: any) => {
    return total + (faculty.publications || 0);
  }, 0);
  
  // Calculate total research areas
  const researchAreaMap = new Map();
  facultyData.forEach((faculty: any) => {
    if (faculty.researchAreas && Array.isArray(faculty.researchAreas)) {
      faculty.researchAreas.forEach((area: string) => {
        researchAreaMap.set(area, (researchAreaMap.get(area) || 0) + 1);
      });
    }
  });
  const totalResearchAreas = researchAreaMap.size;
  
  return res.json({
    success: true,
    data: {
      totalFaculty,
      designations,
      specializations,
      totalPublications,
      totalResearchAreas
    }
  });
}));

export default router;
