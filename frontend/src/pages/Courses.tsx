import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, MapPin, User, Award, Calendar, Filter, ChevronDown, ChevronUp, GraduationCap, Code, Calculator, Sparkles, Zap } from 'lucide-react';
import { coursesApi, Course } from '../services/api.ts';
import { CourseFilters } from '../types/index.ts';

const Courses: React.FC = () => {
  const [filters, setFilters] = useState<CourseFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedCourseType, setSelectedCourseType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('name');

  const { data: coursesData, isLoading, error } = useQuery(
    ['courses', filters],
    () => coursesApi.getAll(filters),
    {
      keepPreviousData: true
    }
  );

  const { data: statsData } = useQuery('course-stats', coursesApi.getStats);

  // Process and filter courses
  const processedCourses = useMemo(() => {
    if (!coursesData?.data) return [];
    
    let filtered = coursesData.data;
    
    // Filter by semester
    if (selectedSemester !== 'all') {
      filtered = filtered.filter(course => course.semester === selectedSemester);
    }
    
    // Filter by course type
    if (selectedCourseType !== 'all') {
      filtered = filtered.filter(course => course.courseType === selectedCourseType);
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchLower) ||
        course.code.toLowerCase().includes(searchLower) ||
        (course.instructor || '').toLowerCase().includes(searchLower) ||
        (course.topics && Array.isArray(course.topics) && 
         course.topics.some(topic => topic.toLowerCase().includes(searchLower)))
      );
    }
    
    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'code':
          return a.code.localeCompare(b.code);
        case 'credits':
          return b.credits - a.credits;
        case 'semester':
          return a.semester.localeCompare(b.semester);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [coursesData?.data, selectedSemester, selectedCourseType, searchTerm, sortBy]);

  // Get unique semesters and course types
  const semesters = useMemo(() => {
    if (!coursesData?.data) return [];
    const uniqueSemesters = [...new Set(coursesData.data.map(course => course.semester))];
    return uniqueSemesters.sort();
  }, [coursesData?.data]);

  const courseTypes = useMemo(() => {
    if (!coursesData?.data) return [];
    const uniqueTypes = [...new Set(coursesData.data.map(course => course.courseType))];
    return uniqueTypes.sort();
  }, [coursesData?.data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };


  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSelectedSemester('all');
    setSelectedCourseType('all');
    setSortBy('name');
  };

  const getCourseTypeIcon = (courseType: string) => {
    switch (courseType) {
      case 'Basic Science':
        return <Calculator className="w-5 h-5" />;
      case 'Engineering Science':
        return <Code className="w-5 h-5" />;
      case 'Professional Core':
        return <BookOpen className="w-5 h-5" />;
      case 'Ability Enhancement':
        return <GraduationCap className="w-5 h-5" />;
      case 'Non-credit Mandatory':
        return <Award className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getCourseTypeColor = (courseType: string) => {
    switch (courseType) {
      case 'Basic Science':
        return 'bg-blue-100 text-blue-800';
      case 'Engineering Science':
        return 'bg-green-100 text-green-800';
      case 'Professional Core':
        return 'bg-purple-100 text-purple-800';
      case 'Ability Enhancement':
        return 'bg-orange-100 text-orange-800';
      case 'Non-credit Mandatory':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg">Failed to load courses data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto p-4 z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <BookOpen className="w-10 h-10 text-purple-600" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-purple-500/50"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Course Catalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Explore our comprehensive course offerings and academic programs
          </motion.p>
        </motion.div>

        {/* Stats */}
        {statsData?.data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statsData.data.total || 0}</div>
                  <div className="text-gray-600">Total Courses</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Calendar className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statsData.data.semesters || 0}</div>
                  <div className="text-gray-600">Semesters</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statsData.data.totalCredits || 0}</div>
                  <div className="text-gray-600">Total Credits</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{Math.round((statsData.data.totalCredits || 0) / (statsData.data.total || 1))}</div>
                  <div className="text-gray-600">Avg Credits</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, codes, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Semester Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>Semester {semester}</option>
                  ))}
                </select>
              </div>

              {/* Course Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
                <select
                  value={selectedCourseType}
                  onChange={(e) => setSelectedCourseType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {courseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Course Name</option>
                  <option value="code">Course Code</option>
                  <option value="credits">Credits</option>
                  <option value="semester">Semester</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {processedCourses.length} of {coursesData?.data?.length || 0} courses
          {selectedSemester !== 'all' && ` in Semester ${selectedSemester}`}
          {selectedCourseType !== 'all' && ` of type ${selectedCourseType}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg">Loading courses...</div>
        </div>
      ) : processedCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-600 text-lg">No courses found matching your criteria</div>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {processedCourses.map((course: Course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCourseTypeColor(course.courseType)}`}>
                        {course.courseType}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {course.credits} Credits
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                    <p className="text-sm text-gray-600 font-mono">{course.code}</p>
                  </div>
                  <div className="flex items-center text-gray-400">
                    {getCourseTypeIcon(course.courseType)}
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Semester {course.semester}</span>
                  </div>
                  
                  {course.instructor && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  
                  {course.contactHours && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{course.contactHours} (L-T-P)</span>
                    </div>
                  )}
                  
                  {course.room && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{course.room}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {course.description && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{course.description}</p>
                )}

                {/* Topics */}
                {course.topics && Array.isArray(course.topics) && course.topics.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Topics:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 4).map((topic, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                      {course.topics.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{course.topics.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {course.prerequisites && Array.isArray(course.prerequisites) && course.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Prerequisites:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.prerequisites.slice(0, 3).map((prereq, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {prereq}
                        </span>
                      ))}
                      {course.prerequisites.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{course.prerequisites.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Course Outcomes */}
                {course.courseOutcomes && Array.isArray(course.courseOutcomes) && course.courseOutcomes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Outcomes:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {course.courseOutcomes.slice(0, 2).map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                      {course.courseOutcomes.length > 2 && (
                        <li className="text-gray-500">
                          +{course.courseOutcomes.length - 2} more outcomes
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Examination Details */}
                {course.examination && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-600">CIE:</span>
                        <span className="font-medium ml-1">{course.examination.cieMarks}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">SEE:</span>
                        <span className="font-medium ml-1">{course.examination.seeMarks}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium ml-1">{course.examination.cieMarks + course.examination.seeMarks}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Courses;