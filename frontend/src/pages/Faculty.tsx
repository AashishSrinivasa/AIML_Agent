import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Search, Mail, Phone, MapPin, Clock, BookOpen, Award, Users } from 'lucide-react';
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
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">Failed to load faculty data</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Directory</h1>
        <p className="text-gray-600">Meet our expert faculty members and their specializations</p>
      </div>

      {/* Stats */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.totalFaculty}</div>
                <div className="text-gray-600">Total Faculty</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.totalPublications}</div>
                <div className="text-gray-600">Publications</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.specializations.length}</div>
                <div className="text-gray-600">Specializations</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.designations.length}</div>
                <div className="text-gray-600">Designations</div>
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
                  placeholder="Search faculty by name, specialization, or research area..."
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              value={filters.designation || ''}
              onChange={(e) => handleFilterChange('designation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Designations</option>
              {statsData?.data?.designations && Array.isArray(statsData.data.designations) ? statsData.data.designations.map((designation: any) => (
                <option key={designation._id} value={designation._id}>
                  {designation._id} ({designation.count})
                </option>
              )) : null}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <select
              value={filters.specialization || ''}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Specializations</option>
              {statsData?.data?.specializations && Array.isArray(statsData.data.specializations) ? statsData.data.specializations.map((specialization: any) => (
                <option key={specialization._id} value={specialization._id}>
                  {specialization._id} ({specialization.count})
                </option>
              )) : null}
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

      {/* Faculty Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading faculty data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyData?.data && Array.isArray(facultyData.data) ? facultyData.data.map((faculty: Faculty) => (
            <div key={faculty.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No faculty data available</div>
            </div>
          )}
        </div>
      )}

      {facultyData?.data && Array.isArray(facultyData.data) && facultyData.data.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No faculty members found matching your criteria</div>
        </div>
      )}
    </div>
  );
};

export default FacultyPage;
