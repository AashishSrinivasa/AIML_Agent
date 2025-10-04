import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          AIML Department AI Agent
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to the AIML Department AI Assistant
          </h2>
          <p className="text-gray-600 mb-6">
            Your intelligent companion for navigating the Artificial Intelligence and Machine Learning department at BMSCE University.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">AI Chat Assistant</h3>
              <p className="text-blue-600">Get instant answers about faculty, courses, and academic information</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Faculty Directory</h3>
              <p className="text-green-600">Explore our expert faculty members and their specializations</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Course Catalog</h3>
              <p className="text-purple-600">Browse comprehensive course information and prerequisites</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              Backend API: <a href="http://localhost:5001/health" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">http://localhost:5001/health</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
