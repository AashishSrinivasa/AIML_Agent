import express, { Request, Response } from 'express';
import { Infrastructure } from '../models/Infrastructure';
import { asyncHandler } from '../utils/errorHandler';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Get infrastructure details
// @route   GET /api/infrastructure
// @access  Public
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { department } = req.query;
  
  // Read comprehensive infrastructure data from JSON file
  const infrastructureData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/comprehensive_infrastructure.json'), 'utf8')
  );
  
  let infrastructure = infrastructureData;
  
  // Filter by department if specified
  if (department) {
    infrastructure = infrastructureData.filter((infra: any) => 
      infra.department && infra.department.toLowerCase().includes((department as string).toLowerCase())
    );
    if (infrastructure.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Infrastructure details not found for the specified department'
      });
    }
    infrastructure = infrastructure[0]; // Return the first match
  } else {
    // Return the first infrastructure entry (likely the main one)
    infrastructure = infrastructureData[0];
  }
  
  return res.json({
    success: true,
    data: infrastructure
  });
}));

// @desc    Get labs information
// @route   GET /api/infrastructure/labs
// @access  Public
router.get('/labs', asyncHandler(async (req: Request, res: Response) => {
  const { search, capacity } = req.query;
  
  let query: any = {};
  if (search) {
    query['labs.name'] = { $regex: search, $options: 'i' };
  }
  if (capacity) {
    query['labs.capacity'] = { $gte: parseInt(capacity as string) };
  }
  
  const infrastructure = await Infrastructure.findOne(query);
  
  if (!infrastructure) {
    return res.status(404).json({
      success: false,
      error: 'Infrastructure details not found'
    });
  }
  
  return res.json({
    success: true,
    data: infrastructure.labs
  });
}));

// @desc    Get specific lab details
// @route   GET /api/infrastructure/labs/:labName
// @access  Public
router.get('/labs/:labName', asyncHandler(async (req: Request, res: Response) => {
  const { labName } = req.params;
  
  const infrastructure = await Infrastructure.findOne({
    'labs.name': { $regex: labName, $options: 'i' }
  });
  
  if (!infrastructure) {
    return res.status(404).json({
      success: false,
      error: 'Lab not found'
    });
  }
  
  const lab = infrastructure.labs.find(l => 
    l.name.toLowerCase().includes(labName.toLowerCase())
  );
  
  if (!lab) {
    return res.status(404).json({
      success: false,
      error: 'Lab not found'
    });
  }
  
  return res.json({
    success: true,
    data: lab
  });
}));

// @desc    Get research facilities
// @route   GET /api/infrastructure/research
// @access  Public
router.get('/research', asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  
  let query: any = {};
  if (search) {
    query['researchFacilities.name'] = { $regex: search, $options: 'i' };
  }
  
  const infrastructure = await Infrastructure.findOne(query);
  
  if (!infrastructure) {
    return res.status(404).json({
      success: false,
      error: 'Infrastructure details not found'
    });
  }
  
  return res.json({
    success: true,
    data: infrastructure.researchFacilities
  });
}));

// @desc    Get library information
// @route   GET /api/infrastructure/library
// @access  Public
router.get('/library', asyncHandler(async (req: Request, res: Response) => {
  const infrastructure = await Infrastructure.findOne();
  
  if (!infrastructure) {
    return res.status(404).json({
      success: false,
      error: 'Infrastructure details not found'
    });
  }
  
  return res.json({
    success: true,
    data: infrastructure.library
  });
}));

// @desc    Get computer labs information
// @route   GET /api/infrastructure/computer-labs
// @access  Public
router.get('/computer-labs', asyncHandler(async (req: Request, res: Response) => {
  const infrastructure = await Infrastructure.findOne();
  
  if (!infrastructure) {
    return res.status(404).json({
      success: false,
      error: 'Infrastructure details not found'
    });
  }
  
  return res.json({
    success: true,
    data: infrastructure.computerLabs
  });
}));

// @desc    Get infrastructure statistics
// @route   GET /api/infrastructure/stats
// @access  Public
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const infrastructure = await Infrastructure.findOne();
  
  if (!infrastructure) {
    return res.status(404).json({
      success: false,
      error: 'Infrastructure details not found'
    });
  }
  
  const totalEquipment = infrastructure.labs.reduce((total, lab) => 
    total + lab.equipment.reduce((labTotal, equipment) => labTotal + equipment.quantity, 0), 0
  );
  
  const equipmentByCondition = infrastructure.labs.reduce((acc, lab) => {
    lab.equipment.forEach(equipment => {
      acc[equipment.condition] = (acc[equipment.condition] || 0) + equipment.quantity;
    });
    return acc;
  }, {} as Record<string, number>);
  
  return res.json({
    success: true,
    data: {
      totalLabs: infrastructure.labs.length,
      totalClassrooms: infrastructure.classrooms.total,
      totalComputerLabs: infrastructure.computerLabs.total,
      totalComputers: infrastructure.computerLabs.computers,
      totalBooks: infrastructure.library.books,
      totalJournals: infrastructure.library.journals,
      totalEquipment,
      equipmentByCondition,
      researchFacilities: infrastructure.researchFacilities.length
    }
  });
}));

export default router;
