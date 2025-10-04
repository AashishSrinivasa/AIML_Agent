import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Building2, Monitor, BookOpen, Users, Search, MapPin, Wrench } from 'lucide-react';
import { infrastructureApi } from '../services/api';
import { Infrastructure, Lab, ResearchFacility } from '../types';

const Infrastructure: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: infrastructureData, isLoading } = useQuery(
    'infrastructure',
    () => infrastructureApi.getInfrastructure()
  );

  const { data: labsData } = useQuery(
    ['labs', searchTerm],
    () => infrastructureApi.getLabs(searchTerm)
  );

  const { data: researchData } = useQuery(
    'research-facilities',
    () => infrastructureApi.getResearchFacilities()
  );

  const { data: statsData } = useQuery(
    'infrastructure-stats',
    () => infrastructureApi.getStats()
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading infrastructure data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Infrastructure</h1>
        <p className="text-gray-600">Explore our state-of-the-art facilities and equipment</p>
      </div>

      {/* Stats */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.totalLabs}</div>
                <div className="text-gray-600">Labs</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.totalComputers}</div>
                <div className="text-gray-600">Computers</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.totalBooks}</div>
                <div className="text-gray-600">Books</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{statsData.data.researchFacilities}</div>
                <div className="text-gray-600">Research Facilities</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search labs and facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Labs */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Laboratories</h2>
          <div className="space-y-6">
            {labsData?.data?.map((lab: Lab, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{lab.name}</h3>
                    <p className="text-gray-600">{lab.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{lab.capacity}</div>
                    <div className="text-sm text-gray-600">capacity</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Equipment</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {lab.equipment.map((equipment, eqIndex) => (
                        <div key={eqIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{equipment.name}</span>
                            <span className="text-sm text-gray-600 ml-2">({equipment.quantity})</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            equipment.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                            equipment.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                            equipment.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {equipment.condition}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {lab.facilities.map((facility, facIndex) => (
                        <span
                          key={facIndex}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Availability: {lab.availability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Facilities */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Facilities</h2>
          <div className="space-y-6">
            {researchData?.data?.map((facility: ResearchFacility, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                    <p className="text-gray-600">Capacity: {facility.capacity}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700">{facility.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      {facility.equipment.map((equipment, eqIndex) => (
                        <span
                          key={eqIndex}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Library and Computer Labs */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Library */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
            Library
          </h2>
          
          {infrastructureData?.data?.library && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{infrastructureData.data.library.books}</div>
                  <div className="text-sm text-gray-600">Books</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{infrastructureData.data.library.journals}</div>
                  <div className="text-sm text-gray-600">Journals</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{infrastructureData.data.library.digitalResources}</div>
                  <div className="text-sm text-gray-600">Digital Resources</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{infrastructureData.data.library.seatingCapacity}</div>
                  <div className="text-sm text-gray-600">Seating Capacity</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {infrastructureData.data.library.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Computer Labs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Monitor className="w-6 h-6 mr-2 text-blue-600" />
            Computer Labs
          </h2>
          
          {infrastructureData?.data?.computerLabs && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{infrastructureData.data.computerLabs.total}</div>
                  <div className="text-sm text-gray-600">Labs</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{infrastructureData.data.computerLabs.computers}</div>
                  <div className="text-sm text-gray-600">Computers</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                <p className="text-sm text-gray-700">{infrastructureData.data.computerLabs.specifications}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Software</h4>
                <div className="flex flex-wrap gap-2">
                  {infrastructureData.data.computerLabs.software.map((software, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {software}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
