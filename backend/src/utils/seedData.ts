import mongoose from 'mongoose';
import { Faculty } from '../models/Faculty';
import { Course } from '../models/Course';
import { AcademicCalendar } from '../models/AcademicCalendar';
import { Infrastructure } from '../models/Infrastructure';
import fs from 'fs';
import path from 'path';

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Read comprehensive JSON files
    const facultyData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/comprehensive_faculty.json'), 'utf8')
    );
    const courseData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/comprehensive_courses.json'), 'utf8')
    );
    const calendarData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/comprehensive_academic_calendar.json'), 'utf8')
    );
    const infrastructureData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/comprehensive_infrastructure.json'), 'utf8')
    );

    // Clear existing data
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await AcademicCalendar.deleteMany({});
    await Infrastructure.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Seed Faculty
    await Faculty.insertMany(facultyData);
    console.log(`✅ Seeded ${facultyData.length} faculty members`);

    // Seed Courses
    await Course.insertMany(courseData);
    console.log(`✅ Seeded ${courseData.length} courses`);

    // Seed Academic Calendar
    await AcademicCalendar.insertMany([calendarData]);
    console.log('✅ Seeded academic calendar');

    // Seed Infrastructure
    await Infrastructure.insertMany([infrastructureData]);
    console.log('✅ Seeded infrastructure data');

    console.log('🎉 Data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

export default seedData;
