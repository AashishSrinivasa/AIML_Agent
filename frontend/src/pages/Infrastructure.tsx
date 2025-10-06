import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Building2, Monitor, BookOpen, Users, Search, Wrench, Clock, Sparkles, Zap } from 'lucide-react';
import { infrastructureApi } from '../services/api.ts';
import { Lab, ResearchFacility } from '../types/index.ts';

const InfrastructurePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: infrastructureData, isLoading } = useQuery(
    'infrastructure',
    () => infrastructureApi.getInfrastructure()
  );

  // Extract the infrastructure data (it's a single object, not an array)
  const infrastructure = infrastructureData?.data as any;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading infrastructure data...</p>
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
          className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
                <Building2 className="w-10 h-10 text-purple-600" />
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
            Infrastructure
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Explore our state-of-the-art facilities and cutting-edge equipment
          </motion.p>
        </motion.div>

        {/* Stats */}
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
                <Building2 className="w-6 h-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {infrastructure?.labs ? infrastructure.labs.length : 0}
                </div>
                <div className="text-gray-600">Labs</div>
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
                <Monitor className="w-6 h-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {infrastructure?.computerLabs ? infrastructure.computerLabs.total : 0}
                </div>
                <div className="text-gray-600">Computer Labs</div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {infrastructure?.researchFacilities ? infrastructure.researchFacilities.length : 0}
                </div>
                <div className="text-gray-600">Research Facilities</div>
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
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {infrastructure?.labs ? 
                    infrastructure.labs.reduce((total, lab) => total + (lab.capacity || 0), 0) : 0}
                </div>
                <div className="text-gray-600">Total Lab Capacity</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search labs and facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg"
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Labs */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-2xl font-semibold text-gray-900 mb-6 flex items-center"
            >
              <Zap className="w-6 h-6 text-purple-600 mr-2" />
              Laboratories
            </motion.h2>
            <div className="space-y-6">
              {infrastructure?.labs ? infrastructure.labs.map((lab: Lab, index: number) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
                >
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
                        {lab.equipment && Array.isArray(lab.equipment) ? lab.equipment.map((equipment: any, eqIndex: number) => (
                          <div key={eqIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{equipment.name || equipment}</span>
                              {equipment.quantity && <span className="text-sm text-gray-600 ml-2">({equipment.quantity})</span>}
                            </div>
                            {equipment.condition && (
                              <span className={`px-2 py-1 rounded text-xs ${
                                equipment.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                                equipment.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                                equipment.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {equipment.condition}
                              </span>
                            )}
                          </div>
                        )) : (
                          <div className="text-gray-500 text-sm">No equipment listed</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {(lab as any).facilities && Array.isArray((lab as any).facilities) ? (lab as any).facilities.map((facility: any, facIndex: number) => (
                          <span
                            key={facIndex}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {facility}
                          </span>
                        )) : (
                          <div className="text-gray-500 text-sm">No facilities listed</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Availability: {lab.availability}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">No lab data available</div>
                </div>
              )}
            </div>
          </div>

          {/* Research Facilities */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-2xl font-semibold text-gray-900 mb-6 flex items-center"
            >
              <Sparkles className="w-6 h-6 text-pink-600 mr-2" />
              Research Facilities
            </motion.h2>
            <div className="space-y-6">
              {infrastructure?.researchFacilities ? infrastructure.researchFacilities.map((facility: ResearchFacility, index: number) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                      <p className="text-gray-600">Capacity: {(facility as any).capacity}</p>
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
                      <h4 className="font-medium text-gray-900 mb-2">Research Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {(facility as any).researchAreas && Array.isArray((facility as any).researchAreas) ? (facility as any).researchAreas.map((area: any, areaIndex: number) => (
                          <span
                            key={areaIndex}
                            className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                          >
                            {area}
                          </span>
                        )) : (
                          <div className="text-gray-500 text-sm">No research areas listed</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Equipment</h4>
                      <div className="flex flex-wrap gap-2">
                        {facility.equipment && Array.isArray(facility.equipment) ? facility.equipment.map((equipment, eqIndex) => (
                          <span
                            key={eqIndex}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >
                            {equipment}
                          </span>
                        )) : (
                          <div className="text-gray-500 text-sm">No equipment listed</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">No research facility data available</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InfrastructurePage;