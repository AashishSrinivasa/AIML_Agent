import express, { Request, Response } from 'express';
import { AcademicCalendar } from '../models/AcademicCalendar';
import { asyncHandler } from '../utils/errorHandler';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Get academic calendar
// @route   GET /api/calendar
// @access  Public
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { year } = req.query;
  
  // Read comprehensive academic calendar data from JSON file
  const calendarData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../data/comprehensive_academic_calendar.json'), 'utf8')
  );
  
  let calendar = calendarData;
  
  // Filter by year if specified
  if (year) {
    calendar = calendarData.filter((cal: any) => 
      cal.academicYear === year
    );
    if (calendar.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Academic calendar not found for the specified year'
      });
    }
    calendar = calendar[0]; // Return the first (and likely only) match
  } else {
    // Return the most recent calendar
    calendar = calendarData.sort((a: any, b: any) => 
      b.academicYear.localeCompare(a.academicYear)
    )[0];
  }
  
  return res.json({
    success: true,
    data: calendar
  });
}));

// @desc    Get events by type
// @route   GET /api/calendar/events/:type
// @access  Public
router.get('/events/:type', asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.params;
  const { year } = req.query;
  
  let query: any = {};
  if (year) {
    query.academicYear = year;
  }
  
  const calendar = await AcademicCalendar.findOne(query).sort({ academicYear: -1 });
  
  if (!calendar) {
    return res.status(404).json({
      success: false,
      error: 'Academic calendar not found'
    });
  }
  
  const events = calendar.semesters.flatMap(semester => 
    semester.events.filter(event => event.type === type)
  );
  
  // Also include important dates of the same type
  const importantDates = calendar.importantDates.filter(event => event.type === type);
  
  return res.json({
    success: true,
    data: {
      events: [...events, ...importantDates].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    }
  });
}));

// @desc    Get upcoming events
// @route   GET /api/calendar/upcoming
// @access  Public
router.get('/upcoming', asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;
  const { year } = req.query;
  
  let query: any = {};
  if (year) {
    query.academicYear = year;
  }
  
  const calendar = await AcademicCalendar.findOne(query).sort({ academicYear: -1 });
  
  if (!calendar) {
    return res.status(404).json({
      success: false,
      error: 'Academic calendar not found'
    });
  }
  
  const today = new Date();
  const allEvents = [
    ...calendar.semesters.flatMap(semester => 
      semester.events.map(event => ({ ...event, semester: semester.name }))
    ),
    ...calendar.importantDates.map(event => ({ ...event, semester: 'Important Dates' }))
  ];
  
  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, parseInt(limit as string));
  
  return res.json({
    success: true,
    data: upcomingEvents
  });
}));

// @desc    Get examination schedule
// @route   GET /api/calendar/exams
// @access  Public
router.get('/exams', asyncHandler(async (req: Request, res: Response) => {
  const { semester, year } = req.query;
  
  let query: any = {};
  if (year) {
    query.academicYear = year;
  }
  
  const calendar = await AcademicCalendar.findOne(query).sort({ academicYear: -1 });
  
  if (!calendar) {
    return res.status(404).json({
      success: false,
      error: 'Academic calendar not found'
    });
  }
  
  let examSchedule = calendar.examinationSchedule;
  
  if (semester) {
    examSchedule = examSchedule.filter(schedule => 
      schedule.semester.toLowerCase().includes((semester as string).toLowerCase())
    );
  }
  
  return res.json({
    success: true,
    data: examSchedule
  });
}));

// @desc    Get semester information
// @route   GET /api/calendar/semesters
// @access  Public
router.get('/semesters', asyncHandler(async (req: Request, res: Response) => {
  const { year } = req.query;
  
  let query: any = {};
  if (year) {
    query.academicYear = year;
  }
  
  const calendar = await AcademicCalendar.findOne(query).sort({ academicYear: -1 });
  
  if (!calendar) {
    return res.status(404).json({
      success: false,
      error: 'Academic calendar not found'
    });
  }
  
  return res.json({
    success: true,
    data: calendar.semesters
  });
}));

// @desc    Get current semester
// @route   GET /api/calendar/current-semester
// @access  Public
router.get('/current-semester', asyncHandler(async (req: Request, res: Response) => {
  const calendar = await AcademicCalendar.findOne().sort({ academicYear: -1 });
  
  if (!calendar) {
    return res.status(404).json({
      success: false,
      error: 'Academic calendar not found'
    });
  }
  
  const today = new Date();
  const currentSemester = calendar.semesters.find(semester => {
    const startDate = new Date(semester.startDate);
    const endDate = new Date(semester.endDate);
    return today >= startDate && today <= endDate;
  });
  
  if (!currentSemester) {
    return res.json({
      success: true,
      data: null,
      message: 'No active semester found'
    });
  }
  
  return res.json({
    success: true,
    data: currentSemester
  });
}));

export default router;
