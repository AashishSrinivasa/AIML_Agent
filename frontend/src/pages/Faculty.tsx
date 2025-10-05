import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Clock, BookOpen, Award, Users, Sparkles, Zap } from 'lucide-react';
import { facultyApi } from '../services/api.ts';
import { Faculty, FacultyFilters } from '../types/index.ts';

const FacultyPage: React.FC = () => {
  const [filters, setFilters] = useState<FacultyFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: facultyData, isLoading, error } = useQuery(
    ['faculty', filters],
    () => facultyApi.getAll(filters),
    {
      keepPreviousData: true
    }
  );

  const { data: statsData } = useQuery('faculty-stats', facultyApi.getStats);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key: keyof FacultyFilters, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg">Failed to load faculty data</div>
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
                <Users className="w-10 h-10 text-purple-600" />
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
            Faculty Directory
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Meet our expert faculty members and their specializations
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
                  <Users className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statsData.data.total || 0}</div>
                  <div className="text-gray-600">Total Faculty</div>
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
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statsData.data.professors || 0}</div>
                  <div className="text-gray-600">Professors</div>
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
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statsData.data.associateProfessors || 0}</div>
                  <div className="text-gray-600">Associate Professors</div>
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
                  <Clock className="w-6 h-6 text-white" />
                </motion.div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{statsData.data.assistantProfessors || 0}</div>
                  <div className="text-gray-600">Assistant Professors</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search faculty by name, specialization, or research area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-purple-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Search
              </motion.button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <select
                value={filters.designation || ''}
                onChange={(e) => handleFilterChange('designation', e.target.value)}
                className="w-full border-2 border-purple-200/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg"
              >
              <option value="">All Designations</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <select
              value={filters.specialization || ''}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="w-full border-2 border-purple-200/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <option value="">All Specializations</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Natural Language Processing">Natural Language Processing</option>
              <option value="Computer Vision">Computer Vision</option>
              <option value="Data Science">Data Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Neural Networks">Neural Networks</option>
              <option value="Data Mining">Data Mining</option>
              <option value="Big Data">Big Data</option>
              <option value="Generative AI">Generative AI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Research Area</label>
            <select
              value={filters.researchArea || ''}
              onChange={(e) => handleFilterChange('researchArea', e.target.value)}
              className="w-full border-2 border-purple-200/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <option value="">All Research Areas</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Natural Language Processing">Natural Language Processing</option>
              <option value="Computer Vision">Computer Vision</option>
              <option value="Data Science">Data Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Neural Networks">Neural Networks</option>
              <option value="Data Mining">Data Mining</option>
              <option value="Big Data">Big Data</option>
              <option value="Generative AI">Generative AI</option>
            </select>
          </div>
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                Clear Filters
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Faculty Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading faculty data...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {facultyData?.data && Array.isArray(facultyData.data) ? facultyData.data.map((faculty: Faculty, index: number) => (
              <motion.div 
                key={faculty.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{faculty.name}</h3>
                    <p className="text-blue-600 font-medium">{faculty.designation}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Qualification</p>
                    <p className="text-sm font-medium">{faculty.qualification}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Specialization</p>
                    <div className="flex flex-wrap gap-1">
                      {faculty.specialization && Array.isArray(faculty.specialization) ? faculty.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {spec}
                        </span>
                      )) : (
                        <span className="text-gray-500 text-xs">No specializations listed</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Research Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {faculty.researchAreas && Array.isArray(faculty.researchAreas) ? faculty.researchAreas.map((area, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {area}
                        </span>
                      )) : (
                        <span className="text-gray-500 text-xs">No research areas listed</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Publications</p>
                      <p className="font-medium">{faculty.publications}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Experience</p>
                      <p className="font-medium">{faculty.experience}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${faculty.email}`} className="hover:text-blue-600">
                        {faculty.email}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <a href={`tel:${faculty.phone}`} className="hover:text-blue-600">
                        {faculty.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{faculty.office}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{faculty.officeHours}</span>
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">No faculty data available</div>
              </div>
            )}
          </motion.div>
        )}

        {facultyData?.data && Array.isArray(facultyData.data) && facultyData.data.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No faculty members found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyPage;
