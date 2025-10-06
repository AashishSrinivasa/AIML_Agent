import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles, Zap } from 'lucide-react';
import { calendarApi } from '../services/api.ts';
import { Event } from '../types/index.ts';

const CalendarPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('');

  const { data: calendarData, isLoading: calendarLoading } = useQuery(
    ['calendar', selectedYear],
    () => calendarApi.getEvents(selectedYear),
    {
      keepPreviousData: true
    }
  );

  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery(
    ['upcoming-events', selectedYear],
    () => calendarApi.getUpcoming(),
    {
      keepPreviousData: true
    }
  );

  // Extract the calendar data (it's a single object, not an array)
  const calendar = calendarData?.data as any;

  const eventTypes = [
    { value: 'academic', label: 'Academic Events', color: 'bg-blue-100 text-blue-800' },
    { value: 'exam', label: 'Examinations', color: 'bg-red-100 text-red-800' },
    { value: 'holiday', label: 'Holidays', color: 'bg-green-100 text-green-800' },
    { value: 'event', label: 'Special Events', color: 'bg-purple-100 text-purple-800' },
    { value: 'deadline', label: 'Deadlines', color: 'bg-orange-100 text-orange-800' }
  ];

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.color : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  if (calendarLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar data...</p>
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
                <Calendar className="w-10 h-10 text-purple-600" />
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
            Academic Calendar
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Stay updated with important dates, events, and examination schedules
          </motion.p>
        </motion.div>

        {/* Year Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-purple-600" />
              Academic Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border-2 border-purple-200/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <option value="">Current Year</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-xl font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Upcoming Events
              </motion.h2>
              
              {upcomingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents?.data && Array.isArray(upcomingEvents.data) ? upcomingEvents.data.map((event: Event, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200/50"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type).replace('100', '500').replace('800', '600')}`}></div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                          <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {eventTypes.find(et => et.value === event.type)?.label}
                        </span>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 text-lg">No upcoming events available</div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Quick Info */}
          <div className="space-y-6">
            {/* Current Semester */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <motion.h3 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Sparkles className="w-5 h-5 mr-2 text-pink-600" />
                Current Semester
              </motion.h3>
              {calendar ? (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900">Academic Year: {calendar.academicYear}</h4>
                  <p className="text-sm text-gray-600">
                    Semesters: {calendar.semesters ? calendar.semesters.length : 0}
                  </p>
                  {calendar.semesters && calendar.semesters.length > 0 && (
                    <div className="mt-2">
                      {calendar.semesters.map((semester: any, index: number) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {semester.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No semester information available</div>
              )}
            </motion.div>

            {/* Event Types */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <motion.h3 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Zap className="w-5 h-5 mr-2 text-indigo-600" />
                Event Types
              </motion.h3>
              <div className="space-y-2">
                {eventTypes.map((type) => (
                  <div key={type.value} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getEventTypeColor(type.value).replace('100', '500').replace('800', '600')}`}></div>
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarPage;