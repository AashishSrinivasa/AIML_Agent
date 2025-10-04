import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Calendar, Clock, MapPin, Filter, ChevronRight } from 'lucide-react';
import { calendarApi } from '../services/api';
import { AcademicCalendar, Event } from '../types';

const Calendar: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const { data: calendarData, isLoading: calendarLoading } = useQuery(
    ['calendar', selectedYear],
    () => calendarApi.getCalendar(selectedYear),
    {
      keepPreviousData: true
    }
  );

  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery(
    ['upcoming-events', selectedYear],
    () => calendarApi.getUpcomingEvents(10, selectedYear),
    {
      keepPreviousData: true
    }
  );

  const { data: examData, isLoading: examLoading } = useQuery(
    ['exams', selectedYear],
    () => calendarApi.getExams(undefined, selectedYear),
    {
      keepPreviousData: true
    }
  );

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
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading calendar data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
        <p className="text-gray-600">Stay updated with important dates, events, and examination schedules</p>
      </div>

      {/* Year Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Academic Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Current Year</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Events
            </h2>
            
            {upcomingLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents?.data?.map((event: Event, index: number) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type).replace('100', '500').replace('800', '600')}`}></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{event.event}</h3>
                        <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {eventTypes.find(et => et.value === event.type)?.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          {/* Current Semester */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Semester</h3>
            {calendarData?.data?.semesters.map((semester, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-medium text-gray-900">{semester.name}</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(semester.startDate)} - {formatDate(semester.endDate)}
                </p>
              </div>
            ))}
          </div>

          {/* Event Types */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
            <div className="space-y-2">
              {eventTypes.map((type) => (
                <div key={type.value} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${getEventTypeColor(type.value).replace('100', '500').replace('800', '600')}`}></div>
                  <span className="text-sm text-gray-700">{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Examination Schedule */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Examination Schedule
          </h2>
          
          {examLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {examData?.data?.map((schedule: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{schedule.semester} Semester</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {schedule.exams.map((exam: any, examIndex: number) => (
                          <tr key={examIndex} className={isUpcoming(exam.date) ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {exam.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(exam.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {exam.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {exam.venue}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
