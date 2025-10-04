import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Search, BookOpen, Clock, MapPin, User, Award, Calendar } from 'lucide-react';
import { coursesApi } from '../services/api.ts';
import { Course, CourseFilters } from '../types/index.ts';

const Courses: React.FC = () => {
  const [filters, setFilters] = useState<CourseFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: coursesData, isLoading, error } = useQuery(
    ['courses', filters],
    () => coursesApi.getAll(filters),
    {
      keepPreviousData: true
    }
  );

  const { data: statsData } = useQuery('course-stats', coursesApi.getStats);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key: keyof CourseFilters, value: string | number) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Failed to load courses data</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Catalog</h1>
        <p className="text-gray-600">Explore our comprehensive course offerings and academic programs</p>
      </div>

      {/* Stats */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.totalCourses}</div>
                <div className="text-gray-600">Total Courses</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.semesters.length}</div>
                <div className="text-gray-600">Semesters</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.instructors.length}</div>
                <div className="text-gray-600">Instructors</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.credits.length}</div>
                <div className="text-gray-600">Credit Options</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={filters.semester || ''}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Semesters</option>
              {statsData?.data?.semesters.map((semester: any) => (
                <option key={semester._id} value={semester._id}>
                  {semester._id} ({semester.count})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <select
              value={filters.instructor || ''}
              onChange={(e) => handleFilterChange('instructor', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Instructors</option>
              {statsData?.data?.instructors.map((instructor: any) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor._id} ({instructor.count})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
            <select
              value={filters.credits || ''}
              onChange={(e) => handleFilterChange('credits', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Credits</option>
              {statsData?.data?.credits.map((credit: any) => (
                <option key={credit._id} value={credit._id}>
                  {credit._id} credits ({credit.count})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {coursesData?.data && Array.isArray(coursesData.data) ? coursesData.data.map((course: Course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-blue-600 font-medium">{course.code}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{course.credits}</div>
                    <div className="text-sm text-gray-600">credits</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-sm">{course.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Semester</p>
                      <p className="font-medium">{course.semester}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Instructor</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{course.schedule}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{course.room}</span>
                  </div>

                  {course.prerequisites.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Prerequisites</p>
                      <div className="flex flex-wrap gap-1">
                        {course.prerequisites.map((prereq, index) => (
                          <span
                            key={index}
                            className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Topics Covered</p>
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
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No courses data available</div>
            </div>
          )}
        </div>
      )}

      {coursesData?.data && Array.isArray(coursesData.data) && coursesData.data.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No courses found matching your criteria</div>
        </div>
      )}
    </div>
  );
};

export default Courses;
